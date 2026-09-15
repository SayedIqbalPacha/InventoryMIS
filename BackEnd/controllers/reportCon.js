const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ==================================================
// GET REPORTS
// ==================================================

exports.getReports = catchAsync(async (req, res, next) => {
  const [
    profitResult,
    lossResult,
    stockResult,
    salesResult,
    purchaseResult,
    costResult,
  ] = await Promise.all([
    // -----------------------------------------------
    // PROFIT SUMMARY
    // -----------------------------------------------

    db.query(`
      SELECT *
      FROM profit_view
    `),

    // -----------------------------------------------
    // LOSS REPORT
    // -----------------------------------------------

    db.query(`
      SELECT *
      FROM loss_view
      ORDER BY allocation_id DESC
    `),

    // -----------------------------------------------
    // STOCK REPORT
    // -----------------------------------------------

    db.query(`
      SELECT *
      FROM stock_view
      ORDER BY item_id
    `),

    // -----------------------------------------------
    // SALES REPORT
    // -----------------------------------------------

    db.query(`
      SELECT
        se.sales_id,
        se.item_id,
        i.item_name,
        se.sale_of_item
      FROM sale_eachitem AS se
      INNER JOIN item AS i
        ON i.item_id = se.item_id
      ORDER BY se.sales_id DESC
    `),

    // -----------------------------------------------
    // PURCHASE REPORT
    // -----------------------------------------------

    db.query(`
      SELECT
        pv.purchase_id,
        pv.item_id,
        i.item_name,
        pv.cost_to_afn,
        pv.total_qty
      FROM purchase_view AS pv
      INNER JOIN item AS i
        ON i.item_id = pv.item_id
      ORDER BY pv.purchase_id DESC
    `),

    // -----------------------------------------------
    // COST REPORT
    // -----------------------------------------------

    db.query(`
      SELECT
        ce.purchase_id,
        ce.item_id,
        i.item_name,
        ce.cost_of_item_afn
      FROM cost_eachitem AS ce
      INNER JOIN item AS i
        ON i.item_id = ce.item_id
      ORDER BY ce.purchase_id DESC
    `),
  ]);

  const profit = profitResult[0];
  const loss = lossResult[0];
  const stock = stockResult[0];
  const sales = salesResult[0];
  const purchases = purchaseResult[0];
  const costs = costResult[0];

  // --------------------------------------------------
  // PROFIT VIEW RETURNS ONE SUMMARY ROW
  // --------------------------------------------------

  const profitSummary = profit[0] || {
    total_revenue_afn: 0,
    total_cost_afn: 0,
    total_profit_afn: 0,
  };

  // --------------------------------------------------
  // CALCULATE LOSS
  // --------------------------------------------------

  const totalLoss = loss.reduce(
    (total, row) => total + Number(row.total_loss_afn || 0),
    0,
  );

  // --------------------------------------------------
  // STOCK SUMMARY
  // --------------------------------------------------

  const totalItems = stock.length;

  const totalPurchased = stock.reduce(
    (total, row) => total + Number(row.total_purchased || 0),
    0,
  );

  const totalSold = stock.reduce(
    (total, row) => total + Number(row.total_sold || 0),
    0,
  );

  const currentStock = stock.reduce(
    (total, row) => total + Number(row.current_stock || 0),
    0,
  );

  // --------------------------------------------------
  // SEND RESPONSE
  // --------------------------------------------------

  res.status(200).json({
    status: 'success',

    data: {
      summary: {
        total_revenue_afn: Number(profitSummary.total_revenue_afn || 0),

        total_cost_afn: Number(profitSummary.total_cost_afn || 0),

        total_profit_afn: Number(profitSummary.total_profit_afn || 0),

        total_loss_afn: totalLoss,

        total_items: totalItems,

        total_purchased: totalPurchased,

        total_sold: totalSold,

        current_stock: currentStock,
      },

      stock,

      sales,

      purchases,

      costs,

      loss,
    },
  });
});
