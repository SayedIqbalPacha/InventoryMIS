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

function isValidDate(value) {
  if (!value) {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function saleExchangeJoin() {
  return `
    LEFT JOIN exchange_rate AS sr
      ON sr.rate_id = (
        SELECT er.rate_id
        FROM exchange_rate AS er
        WHERE er.from_currency_id = s.currency_id
          AND er.to_currency_id = 100
          AND er.effective_date <= s.sales_date
        ORDER BY
          er.effective_date DESC,
          er.rate_id DESC
        LIMIT 1
      )
  `;
}

function purchaseExchangeJoin() {
  return `
    LEFT JOIN exchange_rate AS pr
      ON pr.rate_id = (
        SELECT er.rate_id
        FROM exchange_rate AS er
        WHERE er.from_currency_id = p.currency_id
          AND er.to_currency_id = 100
          AND er.effective_date <= p.purchase_date
        ORDER BY
          er.effective_date DESC,
          er.rate_id DESC
        LIMIT 1
      )
  `;
}

function paymentExchangeJoin() {
  return `
    LEFT JOIN exchange_rate AS payr
      ON payr.rate_id = (
        SELECT er.rate_id
        FROM exchange_rate AS er
        WHERE er.from_currency_id = cp.currency_id
          AND er.to_currency_id = 100
          AND er.effective_date <= cp.date
        ORDER BY
          er.effective_date DESC,
          er.rate_id DESC
        LIMIT 1
      )
  `;
}

// ==================================================
// GET CUSTOMER ACTIVITY
// ==================================================

exports.getCustomerActivity = catchAsync(async (req, res, next) => {
  const name = String(req.query.name || '').trim();
  const fromDate = String(req.query.fromDate || '').trim();
  const toDate = String(req.query.toDate || '').trim();
  const customerIdQuery = String(req.query.customerId || '').trim();

  if (!fromDate || !toDate) {
    return next(new AppError('Please provide from date and to date', 400));
  }

  if (!isValidDate(fromDate) || !isValidDate(toDate)) {
    return next(new AppError('Please provide valid dates as YYYY-MM-DD', 400));
  }

  if (fromDate > toDate) {
    return next(new AppError('From date cannot be after to date', 400));
  }

  let customer = null;

  if (customerIdQuery) {
    if (!/^\d+$/.test(customerIdQuery)) {
      return next(new AppError('Invalid customer id', 400));
    }

    const [rows] = await db.query(
      'SELECT * FROM customer WHERE customer_id = ?',
      [customerIdQuery],
    );

    customer = rows[0] || null;
  } else {
    if (!name) {
      return next(new AppError('Please provide a customer name', 400));
    }

    const [rows] = await db.query(
      `SELECT *
       FROM customer
       WHERE customer_name LIKE ?
       ORDER BY customer_name`,
      [`%${name}%`],
    );

    if (rows.length === 0) {
      return next(new AppError('No customer found with that name', 404));
    }

    const exactMatches = rows.filter(
      (row) => row.customer_name.toLowerCase() === name.toLowerCase(),
    );

    if (rows.length > 1 && exactMatches.length !== 1) {
      return res.status(200).json({
        status: 'success',
        needsSelection: true,
        data: {
          matches: rows.map((row) => ({
            customer_id: row.customer_id,
            customer_name: row.customer_name,
            phone: row.phone,
            email: row.email,
          })),
        },
      });
    }

    customer = exactMatches[0] || rows[0];
  }

  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  const customerId = customer.customer_id;

  const [invoices] = await db.query(
    `
      SELECT
        s.sales_id,
        s.sales_date,
        s.currency_id,
        cur.currency_code,
        SUM(sd.quantity) AS total_qty,
        SUM(sd.quantity * sd.unit_price) AS total_original,
        SUM(
          sd.quantity
          * sd.unit_price
          * COALESCE(sr.exchange_rate, 1)
        ) AS total_afn
      FROM sales AS s
      INNER JOIN sales_details AS sd
        ON sd.sales_id = s.sales_id
      LEFT JOIN currency AS cur
        ON cur.currency_id = s.currency_id
      ${saleExchangeJoin()}
      WHERE s.customer_id = ?
        AND DATE(s.sales_date) BETWEEN ? AND ?
      GROUP BY
        s.sales_id,
        s.sales_date,
        s.currency_id,
        cur.currency_code
      ORDER BY
        s.sales_date DESC,
        s.sales_id DESC
    `,
    [customerId, fromDate, toDate],
  );

  const [invoiceItems] = await db.query(
    `
      SELECT
        s.sales_id,
        s.sales_date,
        i.item_name,
        sd.quantity,
        sd.unit_price,
        COALESCE(sr.exchange_rate, 1) AS exchange_rate,
        (
          sd.quantity
          * sd.unit_price
          * COALESCE(sr.exchange_rate, 1)
        ) AS total_afn
      FROM sales AS s
      INNER JOIN sales_details AS sd
        ON sd.sales_id = s.sales_id
      INNER JOIN item AS i
        ON i.item_id = sd.item_id
      ${saleExchangeJoin()}
      WHERE s.customer_id = ?
        AND DATE(s.sales_date) BETWEEN ? AND ?
      ORDER BY
        s.sales_date DESC,
        s.sales_id DESC,
        sd.detail_id ASC
    `,
    [customerId, fromDate, toDate],
  );

  const [payments] = await db.query(
    `
      SELECT
        cp.cus_payment_id,
        cp.sale_id,
        cp.date,
        cp.amount,
        cur.currency_code,
        COALESCE(payr.exchange_rate, 1) AS exchange_rate,
        (
          cp.amount * COALESCE(payr.exchange_rate, 1)
        ) AS amount_afn
      FROM customer_payment AS cp
      LEFT JOIN currency AS cur
        ON cur.currency_id = cp.currency_id
      ${paymentExchangeJoin()}
      WHERE cp.customer_id = ?
        AND DATE(cp.date) BETWEEN ? AND ?
      ORDER BY
        cp.date DESC,
        cp.cus_payment_id DESC
    `,
    [customerId, fromDate, toDate],
  );

  const [soldRows] = await db.query(
    `
      SELECT
        i.item_id,
        i.item_name,
        SUM(sd.quantity) AS quantity_sold,
        SUM(
          sd.quantity
          * sd.unit_price
          * COALESCE(sr.exchange_rate, 1)
        ) AS sold_afn
      FROM sales AS s
      INNER JOIN sales_details AS sd
        ON sd.sales_id = s.sales_id
      INNER JOIN item AS i
        ON i.item_id = sd.item_id
      ${saleExchangeJoin()}
      WHERE s.customer_id = ?
        AND DATE(s.sales_date) BETWEEN ? AND ?
      GROUP BY
        i.item_id,
        i.item_name
      ORDER BY sold_afn DESC
    `,
    [customerId, fromDate, toDate],
  );

  const [[profit]] = await db.query(
    `
      SELECT
        COALESCE(SUM(
          spa.allocated_qty
          * sd.unit_price
          * COALESCE(sr.exchange_rate, 1)
        ), 0) AS revenue_afn,

        COALESCE(SUM(
          spa.allocated_qty
          * pd.unit_price
          * COALESCE(pr.exchange_rate, 1)
        ), 0) AS cost_afn
      FROM sale_purchase_allocation AS spa
      INNER JOIN sales_details AS sd
        ON spa.sales_details_id = sd.detail_id
      INNER JOIN sales AS s
        ON sd.sales_id = s.sales_id
      INNER JOIN purchase_details AS pd
        ON spa.purchase_details_id = pd.detail_id
      INNER JOIN purchase AS p
        ON pd.purchase_id = p.purchase_id
      ${saleExchangeJoin()}
      ${purchaseExchangeJoin()}
      WHERE s.customer_id = ?
        AND DATE(s.sales_date) BETWEEN ? AND ?
    `,
    [customerId, fromDate, toDate],
  );

  const revenueAfn = Number(profit.revenue_afn || 0);
  const costAfn = Number(profit.cost_afn || 0);
  const profitAfn = revenueAfn - costAfn;

  const totalSoldAfn = soldRows.reduce(
    (total, row) => total + Number(row.sold_afn || 0),
    0,
  );

  const totalQuantitySold = soldRows.reduce(
    (total, row) => total + Number(row.quantity_sold || 0),
    0,
  );

  const totalPaidAfn = payments.reduce(
    (total, row) => total + Number(row.amount_afn || 0),
    0,
  );

  res.status(200).json({
    status: 'success',
    needsSelection: false,
    data: {
      customer: {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        contact_person: customer.contact_person,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      },
      period: {
        fromDate,
        toDate,
      },
      sold: {
        total_sold_afn: totalSoldAfn,
        total_quantity: totalQuantitySold,
        items: soldRows,
      },
      profit: {
        revenue_afn: revenueAfn,
        cost_afn: costAfn,
        profit_afn: profitAfn,
      },
      payments: {
        total_paid_afn: totalPaidAfn,
        rows: payments,
      },
      invoices,
      invoiceItems,
    },
  });
});
