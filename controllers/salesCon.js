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

const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


// Get All Sales

exports.getAllSales = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT * FROM sales'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// Get Single Sale

exports.getSale = catchAsync(async (req, res, next) => {

    const id = req.params.id;
    
    const [rows] = await db.query(
        'SELECT * FROM sales WHERE sales_id = ?',
        [id]
    );

    if (!/^\d+$/.test(id)) {
    return next(new AppError('Invalid exchange rate ID', 400));
    }
    if (rows.length === 0) {

        return next(new AppError('Sale not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data: rows[0]

    });

});


// Create Sale

exports.createSale = catchAsync(async (req, res, next) => {

    const {
        customer_id,
        sales_date,
        currency_id
    } = req.body;

    const [result] = await db.query(

        `INSERT INTO sales
        (customer_id,sales_date,currency_id)
        VALUES (?,?,?)`,

        [
            customer_id,
            sales_date,
            currency_id
        ]

    );

    res.status(201).json({

        status: 'success',

        insertId: result.insertId

    });

});


// Update Sale

exports.updateSale = catchAsync(async (req, res, next) => {

    const {
        customer_id,
        sales_date,
        currency_id
    } = req.body;

    const [result] = await db.query(

        `UPDATE sales
        SET customer_id=?,
            sales_date=?,
            currency_id=?
        WHERE sales_id=?`,

        [
            customer_id,
            sales_date,
            currency_id,
            req.params.id
        ]

    );

    if (!result.affectedRows) {

        return next(new AppError('Sale not founded', 404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Sale updated successfully.'

    });

});


// Delete Sale

exports.deleteSale = catchAsync(async (req, res, next) => {

    const [result] = await db.query(

        'DELETE FROM sales WHERE sales_id=?',

        [req.params.id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Sale not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});
