// const db = require('../config/db');

// // Get All Sales Details
// exports.getAllSalesDetails = async (req, res) => {

//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM sales_details'
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


// // Get Single Sales Detail
// exports.getSalesDetail = async (req, res) => {

//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM sales_details WHERE detail_id=?',
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


// // Create Sales Detail
// exports.createSalesDetail = async (req, res) => {

//     try {

//         const {
//             sales_id,
//             item_id,
//             quantity,
//             unit_price
//         } = req.body;

//         const [result] = await db.query(
//             `INSERT INTO sales_details
//             (sales_id,item_id,quantity,unit_price)
//             VALUES (?,?,?,?)`,
//             [
//                 sales_id,
//                 item_id,
//                 quantity,
//                 unit_price
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


// // Update Sales Detail
// exports.updateSalesDetail = async (req, res) => {

//     try {

//         const {
//             sales_id,
//             item_id,
//             quantity,
//             unit_price
//         } = req.body;

//         await db.query(
//             `UPDATE sales_details
//             SET sales_id=?,
//                 item_id=?,
//                 quantity=?,
//                 unit_price=?
//             WHERE detail_id=?`,
//             [
//                 sales_id,
//                 item_id,
//                 quantity,
//                 unit_price,
//                 req.params.id
//             ]
//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Sales detail updated successfully.'
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }

// };


// // Delete Sales Detail
// exports.deleteSalesDetail = async (req, res) => {

//     try {

//         await db.query(
//             'DELETE FROM sales_details WHERE detail_id=?',
//             [req.params.id]
//         );

//         res.status(204).json({
//             status: 'success',
//             message: 'Sales detail deleted successfully.'
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


// Get All Sales Details

exports.getAllSalesDetails = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT * FROM sales_details'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// Get Single Sales Detail

exports.getSalesDetail = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const [rows] = await db.query(
        'SELECT * FROM sales_details WHERE detail_id=?',
        [id]
    );

      if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid exchange rate ID', 400));
     }

    if (rows.length === 0) {

        return next(new AppError('Sales detail not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data: rows[0]

    });

});


// Create Sales Detail

exports.createSalesDetail = catchAsync(async (req, res, next) => {

    const {
        sales_id,
        item_id,
        quantity,
        unit_price
    } = req.body;

    const [result] = await db.query(

        `INSERT INTO sales_details
        (sales_id,item_id,quantity,unit_price)
        VALUES (?,?,?,?)`,

        [
            sales_id,
            item_id,
            quantity,
            unit_price
        ]

    );

    res.status(201).json({

        status: 'success',

        insertId: result.insertId

    });

});


// Update Sales Detail

exports.updateSalesDetail = catchAsync(async (req, res, next) => {

    const {
        sales_id,
        item_id,
        quantity,
        unit_price
    } = req.body;

    const [result] = await db.query(

        `UPDATE sales_details
        SET sales_id=?,
            item_id=?,
            quantity=?,
            unit_price=?
        WHERE detail_id=?`,

        [
            sales_id,
            item_id,
            quantity,
            unit_price,
            req.params.id
        ]

    );

    if (!result.affectedRows) {

        return next(new AppError('Sales detail not founded', 404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Sales detail updated successfully.'

    });

});


// Delete Sales Detail

exports.deleteSalesDetail = catchAsync(async (req, res, next) => {

    const [result] = await db.query(

        'DELETE FROM sales_details WHERE detail_id=?',

        [req.params.id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Sales detail not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});
