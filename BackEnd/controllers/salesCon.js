// const db = require('../config/db');

// // Get All Sales
// exports.getAllSales = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM sales'
//         );

//         res.status(200).json({
//             status: 'success',
//             results: rows.length,
//             data: rows
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }
// };

// // Get Single Sale
// exports.getSale = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM sales WHERE sales_id = ?',
//             [req.params.id]
//         );

//         res.status(200).json({
//             status: 'success',
//             data: rows
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }
// };

// // Create Sale
// exports.createSale = async (req, res) => {

//     try {

//         const {
//             customer_id,
//             sales_date,
//             currency_id
//         } = req.body;

//         const [result] = await db.query(
//             `INSERT INTO sales
//             (customer_id,sales_date,currency_id)
//             VALUES (?,?,?)`,
//             [
//                 customer_id,
//                 sales_date,
//                 currency_id
//             ]
//         );

//         res.status(201).json({
//             status: 'success',
//             insertId: result.insertId
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }

// };

// // Update Sale
// exports.updateSale = async (req, res) => {

//     try {

//         const {
//             customer_id,
//             sales_date,
//             currency_id
//         } = req.body;

//         await db.query(
//             `UPDATE sales
//             SET customer_id=?,
//                 sales_date=?,
//                 currency_id=?
//             WHERE sales_id=?`,
//             [
//                 customer_id,
//                 sales_date,
//                 currency_id,
//                 req.params.id
//             ]
//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Sale updated successfully.'
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }

// };

// // Delete Sale
// exports.deleteSale = async (req, res) => {

//     try {

//         await db.query(
//             'DELETE FROM sales WHERE sales_id=?',
//             [req.params.id]
//         );

//         res.status(204).json({
//             status: 'success',
//             message: 'Sale deleted successfully.'
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }

// };

// const db = require('../config/db');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// // Get All Sales

// exports.getAllSales = catchAsync(async (req, res, next) => {
//   const [rows] = await db.query('SELECT * FROM sales');

//   res.status(200).json({
//     status: 'success',
//     results: rows.length,
//     data: rows,
//   });
// });

// // Get Single Sale

// exports.getSale = catchAsync(async (req, res, next) => {
//   const id = req.params.id;

//   if (!/^\d+$/.test(id)) {
//     return next(new AppError('Invalid sale ID', 400));
//   }

//   const [rows] = await db.query('SELECT * FROM sales WHERE sales_id = ?', [id]);

//   if (rows.length === 0) {
//     return next(new AppError('Sale not found', 404));
//   }

//   res.status(200).json({
//     status: 'success',

//     data: rows[0],
//   });
// });

// // Create Sale

// exports.createSale = catchAsync(async (req, res, next) => {
//   const { customer_id, sales_date, currency_id } = req.body;

//   // CHECK REQUIRED FIELD

//   if (!customer_id) {
//     return next(new AppError('Please provide customer id', 400));
//   }

//   if (!sales_date) {
//     return next(new AppError('Please provide sales date', 400));
//   }

//   if (!currency_id) {
//     return next(new AppError('Please provide currency id', 400));
//   }

//   // CHECK DATA TYPE

//   if (!Number.isInteger(Number(customer_id))) {
//     return next(new AppError('Customer id must be an integer', 400));
//   }

//   if (isNaN(Date.parse(sales_date))) {
//     return next(new AppError('Sales date must be a valid date', 400));
//   }

//   if (!Number.isInteger(Number(currency_id))) {
//     return next(new AppError('Currency id must be an integer', 400));
//   }

//   const [result] = await db.query(
//     `INSERT INTO sales
//         (customer_id,sales_date,currency_id)
//         VALUES (?,?,?)`,

//     [customer_id, sales_date, currency_id],
//   );

//   res.status(201).json({
//     status: 'success',

//     insertId: result.insertId,
//   });
// });

// // Update Sale

// exports.updateSale = catchAsync(async (req, res, next) => {
//   const id = req.params.id;

//   const { customer_id, sales_date, currency_id } = req.body;

//   // CHECK IF SALE EXISTS

//   const [sale] = await db.query(
//     'SELECT sales_id FROM sales WHERE sales_id = ?',
//     [id],
//   );

//   if (sale.length === 0) {
//     return next(new AppError('Sale not founded', 404));
//   }

//   // CHECK REQUIRED FIELD

//   if (!customer_id && customer_id !== undefined) {
//     return next(new AppError('Please provide customer id', 400));
//   }

//   if (!sales_date && sales_date !== undefined) {
//     return next(new AppError('Please provide sales date', 400));
//   }

//   if (!currency_id && currency_id !== undefined) {
//     return next(new AppError('Please provide currency id', 400));
//   }

//   // CHECK DATA TYPE

//   if (customer_id !== undefined && !Number.isInteger(Number(customer_id))) {
//     return next(new AppError('Customer id must be an integer', 400));
//   }

//   if (sales_date !== undefined && isNaN(Date.parse(sales_date))) {
//     return next(new AppError('Sales date must be a valid date', 400));
//   }

//   if (currency_id !== undefined && !Number.isInteger(Number(currency_id))) {
//     return next(new AppError('Currency id must be an integer', 400));
//   }

//   const [result] = await db.query(
//     `UPDATE sales
//         SET customer_id=COALESCE(?, customer_id),
//             sales_date=COALESCE(?, sales_date),
//             currency_id=COALESCE(?, currency_id)
//         WHERE sales_id=?`,

//     [customer_id ?? null, sales_date ?? null, currency_id ?? null, id],
//   );

//   if (!result.affectedRows) {
//     return next(new AppError('Sale not founded', 404));
//   }

//   res.status(200).json({
//     status: 'success',

//     message: 'Sale updated successfully.',
//   });
// });

// // Delete Sale

// exports.deleteSale = catchAsync(async (req, res, next) => {
//   const id = req.params.id;

//   const [result] = await db.query(
//     'DELETE FROM sales WHERE sales_id=?',

//     [id],
//   );

//   if (!result.affectedRows) {
//     return next(new AppError('Sale not founded', 404));
//   }

//   res.status(204).json({
//     status: 'success',

//     data: null,
//   });
// });
/* eslint-disable no-restricted-syntax */

const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const allocateSale = require('../utils/saleAllocation');

// ==================================================
// GET ALL SALES
// ==================================================

exports.getAllSales = catchAsync(async (req, res, next) => {
  const [rows] = await db.query('SELECT * FROM sales');

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});

// ==================================================
// GET SINGLE SALE
// ==================================================

exports.getSale = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!/^\d+$/.test(id)) {
    return next(new AppError('Invalid sale ID', 400));
  }

  const [rows] = await db.query('SELECT * FROM sales WHERE sales_id = ?', [id]);

  if (rows.length === 0) {
    return next(new AppError('Sale not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: rows[0],
  });
});

// ==================================================
// GET AVAILABLE STOCK
// ==================================================

exports.getAvailableStock = catchAsync(async (req, res, next) => {
  const [rows] = await db.query(
    `SELECT
        i.item_id,
        i.item_name,
        COALESCE(sv.current_stock, 0) AS available_stock
     FROM item AS i
     LEFT JOIN stock_view AS sv
       ON sv.item_id = i.item_id
     ORDER BY i.item_id`,
  );

  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: rows,
  });
});

// ==================================================
// CREATE SALE + DETAILS + ALLOCATIONS
// ==================================================

exports.createSale = catchAsync(async (req, res, next) => {
  const { customer_id, sales_date, currency_id, details } = req.body;

  // --------------------------------------------------
  // HEADER VALIDATION
  // --------------------------------------------------

  if (!customer_id) {
    return next(new AppError('Please provide customer id', 400));
  }

  if (!sales_date) {
    return next(new AppError('Please provide sales date', 400));
  }

  if (!currency_id) {
    return next(new AppError('Please provide currency id', 400));
  }

  if (!Array.isArray(details) || details.length === 0) {
    return next(new AppError('Please add at least one sales item', 400));
  }

  // --------------------------------------------------
  // HEADER DATA TYPES
  // --------------------------------------------------

  if (!Number.isInteger(Number(customer_id))) {
    return next(new AppError('Customer id must be an integer', 400));
  }

  if (isNaN(Date.parse(sales_date))) {
    return next(new AppError('Sales date must be a valid date', 400));
  }

  if (!Number.isInteger(Number(currency_id))) {
    return next(new AppError('Currency id must be an integer', 400));
  }

  // --------------------------------------------------
  // DETAIL VALIDATION
  // --------------------------------------------------

  for (let i = 0; i < details.length; i++) {
    const detail = details[i];

    if (!detail.item_id) {
      return next(
        new AppError(`Please provide item id for item ${i + 1}`, 400),
      );
    }

    if (!Number.isInteger(Number(detail.item_id))) {
      return next(
        new AppError(`Item id for item ${i + 1} must be an integer`, 400),
      );
    }

    if (
      detail.quantity === undefined ||
      detail.quantity === null ||
      detail.quantity === ''
    ) {
      return next(
        new AppError(`Please provide quantity for item ${i + 1}`, 400),
      );
    }

    if (isNaN(Number(detail.quantity))) {
      return next(
        new AppError(`Quantity for item ${i + 1} must be a number`, 400),
      );
    }

    if (Number(detail.quantity) <= 0) {
      return next(
        new AppError(`Quantity for item ${i + 1} must be greater than 0`, 400),
      );
    }

    if (
      detail.unit_price === undefined ||
      detail.unit_price === null ||
      detail.unit_price === ''
    ) {
      return next(
        new AppError(`Please provide unit price for item ${i + 1}`, 400),
      );
    }

    if (isNaN(Number(detail.unit_price))) {
      return next(
        new AppError(`Unit price for item ${i + 1} must be a number`, 400),
      );
    }

    if (Number(detail.unit_price) < 0) {
      return next(
        new AppError(`Unit price for item ${i + 1} cannot be negative`, 400),
      );
    }
  }

  const connection = await db.getConnection();

  try {
    // transaction is needed cause it combine multiple queries and if one of them fails, it will rollback all the changes made by previous queries
    await connection.beginTransaction();

    // --------------------------------------------------
    // CREATE SALES HEADER
    // --------------------------------------------------

    const [saleResult] = await connection.query(
      `INSERT INTO sales
        (
          customer_id,
          sales_date,
          currency_id
        )
       VALUES (?, ?, ?)`,
      [customer_id, sales_date, currency_id],
    );

    const salesId = saleResult.insertId;

    // --------------------------------------------------
    // CREATE DETAILS + ALLOCATIONS
    // --------------------------------------------------

    for (const detail of details) {
      const [detailResult] = await connection.query(
        `INSERT INTO sales_details
          (
            sales_id,
            item_id,
            quantity,
            unit_price
          )
         VALUES (?, ?, ?, ?)`,
        [
          salesId,
          Number(detail.item_id),
          Number(detail.quantity),
          Number(detail.unit_price),
        ],
      );

      const salesDetailId = detailResult.insertId;

      // AUTOMATIC ALLOCATION
      await allocateSale(
        connection,
        salesDetailId,
        Number(detail.item_id),
        Number(detail.quantity),
      );
    }

    // --------------------------------------------------
    // EVERYTHING SUCCESSFUL
    // --------------------------------------------------

    await connection.commit();

    res.status(201).json({
      status: 'success',
      message: 'Sale created successfully.',
      insertId: salesId,
    });
  } catch (err) {
    await connection.rollback();
    return next(err);
  } finally {
    // release the connection back to the pool
    connection.release();
  }
});

// ==================================================
// UPDATE SALE + ALL DETAILS + ALLOCATIONS
// ==================================================

exports.updateSale = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const { customer_id, sales_date, currency_id, details } = req.body;

  if (!/^\d+$/.test(id)) {
    return next(new AppError('Invalid sale ID', 400));
  }

  if (
    customer_id === undefined &&
    sales_date === undefined &&
    currency_id === undefined &&
    details === undefined
  ) {
    return next(new AppError('Please provide data to update', 400));
  }

  if (customer_id !== undefined && !Number.isInteger(Number(customer_id))) {
    return next(new AppError('Customer id must be an integer', 400));
  }

  if (sales_date !== undefined && isNaN(Date.parse(sales_date))) {
    return next(new AppError('Sales date must be a valid date', 400));
  }

  if (currency_id !== undefined && !Number.isInteger(Number(currency_id))) {
    return next(new AppError('Currency id must be an integer', 400));
  }

  if (details !== undefined) {
    if (!Array.isArray(details) || details.length === 0) {
      return next(new AppError('Sale must contain at least one item', 400));
    }

    for (let i = 0; i < details.length; i++) {
      const detail = details[i];

      if (!detail.item_id) {
        return next(
          new AppError(`Please provide item id for item ${i + 1}`, 400),
        );
      }

      if (!Number.isInteger(Number(detail.item_id))) {
        return next(
          new AppError(`Item id for item ${i + 1} must be an integer`, 400),
        );
      }

      if (!detail.quantity || isNaN(Number(detail.quantity))) {
        return next(
          new AppError(
            `Please provide a valid quantity for item ${i + 1}`,
            400,
          ),
        );
      }

      if (Number(detail.quantity) <= 0) {
        return next(
          new AppError(
            `Quantity for item ${i + 1} must be greater than 0`,
            400,
          ),
        );
      }

      if (
        detail.unit_price === undefined ||
        detail.unit_price === null ||
        detail.unit_price === '' ||
        isNaN(Number(detail.unit_price))
      ) {
        return next(
          new AppError(
            `Please provide a valid unit price for item ${i + 1}`,
            400,
          ),
        );
      }

      if (Number(detail.unit_price) < 0) {
        return next(
          new AppError(`Unit price for item ${i + 1} cannot be negative`, 400),
        );
      }
    }
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // --------------------------------------------------
    // CHECK SALE
    // --------------------------------------------------

    const [sale] = await connection.query(
      `SELECT sales_id
       FROM sales
       WHERE sales_id = ?
       FOR UPDATE`,
      [id],
    );

    if (sale.length === 0) {
      throw new AppError('Sale not found', 404);
    }

    // --------------------------------------------------
    // UPDATE HEADER
    // --------------------------------------------------

    await connection.query(
      `UPDATE sales
       SET customer_id = COALESCE(?, customer_id),
           sales_date = COALESCE(?, sales_date),
           currency_id = COALESCE(?, currency_id)
       WHERE sales_id = ?`,
      [customer_id ?? null, sales_date ?? null, currency_id ?? null, id],
    );

    // --------------------------------------------------
    // REPLACE DETAILS ONLY IF SENT
    // --------------------------------------------------

    if (details !== undefined) {
      // Because sales_details has ON DELETE CASCADE
      // this also removes its allocation rows.
      await connection.query(
        `DELETE FROM sales_details
         WHERE sales_id = ?`,
        [id],
      );

      // ------------------------------------------------
      // CREATE NEW DETAILS + ALLOCATIONS
      // ------------------------------------------------

      for (const detail of details) {
        const [detailResult] = await connection.query(
          `INSERT INTO sales_details
            (
              sales_id,
              item_id,
              quantity,
              unit_price
            )
           VALUES (?, ?, ?, ?)`,
          [
            id,
            Number(detail.item_id),
            Number(detail.quantity),
            Number(detail.unit_price),
          ],
        );

        const salesDetailId = detailResult.insertId;

        await allocateSale(
          connection,
          salesDetailId,
          Number(detail.item_id),
          Number(detail.quantity),
        );
      }
    }

    await connection.commit();

    res.status(200).json({
      status: 'success',
      message: 'Sale updated successfully.',
    });
  } catch (err) {
    await connection.rollback();
    return next(err);
  } finally {
    connection.release();
  }
});

// delete sale
exports.deleteSale = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!/^\d+$/.test(id)) {
    return next(new AppError('Invalid sale ID', 400));
  }

  const [result] = await db.query('DELETE FROM sales WHERE sales_id = ?', [id]);

  if (result.affectedRows === 0) {
    return next(new AppError('Sale not found.', 404));
  }

  res.status(204).send();
});
