const AppError = require('./appError');

// generally this function insert data into sale_purchase_allocation table based on FIFO allocation
async function allocateSale(connection, salesDetailId, itemId, saleQuantity) {
  const requestedQuantity = Number(saleQuantity);

  // --------------------------------------------------
  // GET PURCHASE DETAILS
  // FIFO: OLDEST PURCHASE FIRST
  // --------------------------------------------------

  // we wrtie this query to get all purchase details for items that are completed and we will use it in FIFO allocation
  const [purchaseDetails] = await connection.query(
    `SELECT
        pd.detail_id,
        pd.quantity,
        p.purchase_date
     FROM purchase_details AS pd
     INNER JOIN purchase AS p
       ON p.purchase_id = pd.purchase_id
     WHERE pd.item_id = ?
        AND LOWER(TRIM(p.status)) IN (
      'completed',
      'success',
      'done',
      'complete'
  )
     ORDER BY p.purchase_date ASC, pd.detail_id ASC
     FOR UPDATE`,
    [itemId],
  );

  if (purchaseDetails.length === 0) {
    throw new AppError(
      `No completed purchase stock found for item ${itemId}.`,
      400,
    );
  }

  // --------------------------------------------------
  // GET ALREADY ALLOCATED QUANTITY
  // --------------------------------------------------

  const purchaseDetailIds = purchaseDetails.map((detail) => detail.detail_id);

  // this query gives us the total allocated quantity for each purchase detail and we will use it in
  const [allocatedRows] = await connection.query(
    `SELECT
        purchase_details_id,
        SUM(allocated_qty) AS allocated_qty
     FROM sale_purchase_allocation
     WHERE purchase_details_id IN (?)
     GROUP BY purchase_details_id`,
    [purchaseDetailIds],
  );

  const allocatedMap = new Map(
    allocatedRows.map((row) => [
      Number(row.purchase_details_id),
      Number(row.allocated_qty),
    ]),
  );

  // --------------------------------------------------
  // CHECK TOTAL AVAILABLE STOCK
  // --------------------------------------------------

  const totalAvailable = purchaseDetails.reduce((total, purchaseDetail) => {
    const purchasedQuantity = Number(purchaseDetail.quantity);

    const allocatedQuantity =
      allocatedMap.get(Number(purchaseDetail.detail_id)) || 0;

    const availableQuantity = purchasedQuantity - allocatedQuantity;

    return total + Math.max(availableQuantity, 0);
  }, 0);

  if (requestedQuantity > totalAvailable) {
    throw new AppError(
      `Insufficient stock for item ${itemId}. Available: ${totalAvailable}, requested: ${requestedQuantity}.`,
      400,
    );
  }

  // --------------------------------------------------
  // FIFO ALLOCATION
  // --------------------------------------------------

  let remainingQuantity = requestedQuantity;

  // This loop must remain sequential because
  // every iteration depends on remainingQuantity.
  // eslint-disable-next-line no-await-in-loop
  for (const purchaseDetail of purchaseDetails) {
    if (remainingQuantity <= 0) {
      break;
    }

    const purchasedQuantity = Number(purchaseDetail.quantity);

    const allocatedQuantity =
      allocatedMap.get(Number(purchaseDetail.detail_id)) || 0;

    const availableQuantity = Math.max(
      purchasedQuantity - allocatedQuantity,
      0,
    );

    if (availableQuantity <= 0) {
      continue;
    }

    //.min is used to ensure we don't allocate more than available or more than remaining it take the smaller of the two values
    const quantityToAllocate = Math.min(remainingQuantity, availableQuantity);

    await connection.query(
      `INSERT INTO sale_purchase_allocation
        (
          sales_details_id,
          purchase_details_id,
          allocated_qty
        )
       VALUES (?, ?, ?)`,
      [salesDetailId, purchaseDetail.detail_id, quantityToAllocate],
    );

    remainingQuantity -= quantityToAllocate;
  }
}

module.exports = allocateSale;
