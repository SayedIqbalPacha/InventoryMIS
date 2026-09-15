const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');

exports.getDashboard = catchAsync(async (req, res, next) => {
  const [[summary]] = await db.query(`
    SELECT
      (
        SELECT COUNT(*)
        FROM customer
      ) AS total_customers,

      (
        SELECT COUNT(*)
        FROM item
      ) AS total_items,

      COALESCE(
        (
          SELECT SUM(total_revenue_afn)
          FROM (
            SELECT
              spa.allocation_id,
              spa.allocated_qty
                * sd.unit_price
                * COALESCE(sr.exchange_rate, 1)
                AS total_revenue_afn
            FROM sale_purchase_allocation AS spa
            INNER JOIN sales_details AS sd
              ON spa.sales_details_id = sd.detail_id
            INNER JOIN sales AS s
              ON sd.sales_id = s.sales_id
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
          ) AS revenue_rows
        ),
        0
      ) AS total_sales_afn,

      COALESCE(
        (
          SELECT total_profit_afn
          FROM profit_view
        ),
        0
      ) AS total_profit_afn
  `);

  const [recentSales] = await db.query(`
    SELECT
      s.sales_id,
      s.sales_date,
      c.customer_name,
      sd.item_id,
      i.item_name,
      sd.quantity,
      sd.unit_price,
      COALESCE(sr.exchange_rate, 1) AS exchange_rate,

      (
        sd.quantity
        * sd.unit_price
        * COALESCE(sr.exchange_rate, 1)
      ) AS total_sale_afn

    FROM sales AS s
    INNER JOIN customer AS c
      ON c.customer_id = s.customer_id
    INNER JOIN sales_details AS sd
      ON sd.sales_id = s.sales_id
    INNER JOIN item AS i
      ON i.item_id = sd.item_id

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

    ORDER BY
      s.sales_date DESC,
      s.sales_id DESC
    LIMIT 10
  `);

  const [chartData] = await db.query(`
    SELECT
      transaction_date,
      SUM(total_sales_afn) AS total_sales_afn,
      SUM(total_purchase_afn) AS total_purchase_afn
    FROM (
      SELECT
        s.sales_date AS transaction_date,

        SUM(
          sd.quantity
          * sd.unit_price
          * COALESCE(sr.exchange_rate, 1)
        ) AS total_sales_afn,

        0 AS total_purchase_afn

      FROM sales AS s
      INNER JOIN sales_details AS sd
        ON sd.sales_id = s.sales_id

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

      GROUP BY s.sales_date

      UNION ALL

      SELECT
        p.purchase_date AS transaction_date,

        0 AS total_sales_afn,

        SUM(
          pd.quantity
          * pd.unit_price
          * COALESCE(pr.exchange_rate, 1)
        ) AS total_purchase_afn

      FROM purchase AS p
      INNER JOIN purchase_details AS pd
        ON pd.purchase_id = p.purchase_id

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

      GROUP BY p.purchase_date
    ) AS daily_data
    GROUP BY transaction_date
    ORDER BY transaction_date ASC
  `);

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalCustomers: Number(summary.total_customers),
        totalItems: Number(summary.total_items),
        totalSalesAfn: Number(summary.total_sales_afn),
        totalProfitAfn: Number(summary.total_profit_afn),
      },
      recentSales,
      chartData,
    },
  });
});
