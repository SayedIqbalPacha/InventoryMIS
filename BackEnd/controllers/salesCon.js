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

    if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid sale ID', 400));
    }

    const [rows] = await db.query(
        'SELECT * FROM sales WHERE sales_id = ?',
        [id]
    );

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


    // CHECK REQUIRED FIELD

    if (!customer_id) {
        return next(new AppError('Please provide customer id', 400));
    }

    if (!sales_date) {
        return next(new AppError('Please provide sales date', 400));
    }

    if (!currency_id) {
        return next(new AppError('Please provide currency id', 400));
    }


    // CHECK DATA TYPE

    if (!Number.isInteger(Number(customer_id))) {
        return next(new AppError('Customer id must be an integer', 400));
    }

    if (isNaN(Date.parse(sales_date))) {
        return next(new AppError('Sales date must be a valid date', 400));
    }

    if (!Number.isInteger(Number(currency_id))) {
        return next(new AppError('Currency id must be an integer', 400));
    }


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

    const id = req.params.id;

    const {
        customer_id,
        sales_date,
        currency_id
    } = req.body;


    // CHECK IF SALE EXISTS

    const [sale] = await db.query(
        'SELECT sales_id FROM sales WHERE sales_id = ?',
        [id]
    );

    if (sale.length === 0) {

        return next(new AppError('Sale not founded', 404));

    }


    // CHECK REQUIRED FIELD

    if (!customer_id && customer_id !== undefined) {
        return next(new AppError('Please provide customer id', 400));
    }

    if (!sales_date && sales_date !== undefined) {
        return next(new AppError('Please provide sales date', 400));
    }

    if (!currency_id && currency_id !== undefined) {
        return next(new AppError('Please provide currency id', 400));
    }


    // CHECK DATA TYPE

    if (customer_id !== undefined && !Number.isInteger(Number(customer_id))) {
        return next(new AppError('Customer id must be an integer', 400));
    }

    if (sales_date !== undefined && isNaN(Date.parse(sales_date))) {
        return next(new AppError('Sales date must be a valid date', 400));
    }

    if (currency_id !== undefined && !Number.isInteger(Number(currency_id))) {
        return next(new AppError('Currency id must be an integer', 400));
    }


    const [result] = await db.query(

        `UPDATE sales
        SET customer_id=COALESCE(?, customer_id),
            sales_date=COALESCE(?, sales_date),
            currency_id=COALESCE(?, currency_id)
        WHERE sales_id=?`,

        [
            customer_id ?? null,
            sales_date ?? null,
            currency_id ?? null,
            id
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

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM sales WHERE sales_id=?',

        [id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Sale not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});