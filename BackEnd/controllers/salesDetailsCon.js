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

    if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid sales detail ID', 400));
    }

    const [rows] = await db.query(
        'SELECT * FROM sales_details WHERE detail_id=?',
        [id]
    );

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


    // CHECK REQUIRED FIELD

    if (!sales_id) {
        return next(new AppError('Please provide sales id', 400));
    }

    if (!item_id) {
        return next(new AppError('Please provide item id', 400));
    }

    if (!quantity) {
        return next(new AppError('Please provide quantity', 400));
    }

    if (!unit_price) {
        return next(new AppError('Please provide unit price', 400));
    }


    // CHECK DATA TYPE

    if (!Number.isInteger(Number(sales_id))) {
        return next(new AppError('Sales id must be an integer', 400));
    }

    if (!Number.isInteger(Number(item_id))) {
        return next(new AppError('Item id must be an integer', 400));
    }

    if (isNaN(Number(quantity))) {
        return next(new AppError('Quantity must be a number', 400));
    }

    if (isNaN(Number(unit_price))) {
        return next(new AppError('Unit price must be a number', 400));
    }


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

    const id = req.params.id;

    const {
        sales_id,
        item_id,
        quantity,
        unit_price
    } = req.body;


    // CHECK IF SALES DETAIL EXISTS

    const [salesDetail] = await db.query(
        'SELECT detail_id FROM sales_details WHERE detail_id=?',
        [id]
    );

    if (salesDetail.length === 0) {

        return next(new AppError('Sales detail not founded', 404));

    }


    // CHECK REQUIRED FIELD

    if (!sales_id && sales_id !== undefined) {
        return next(new AppError('Please provide sales id', 400));
    }

    if (!item_id && item_id !== undefined) {
        return next(new AppError('Please provide item id', 400));
    }

    if (!quantity && quantity !== undefined) {
        return next(new AppError('Please provide quantity', 400));
    }

    if (!unit_price && unit_price !== undefined) {
        return next(new AppError('Please provide unit price', 400));
    }


    // CHECK DATA TYPE

    if (sales_id !== undefined && !Number.isInteger(Number(sales_id))) {
        return next(new AppError('Sales id must be an integer', 400));
    }

    if (item_id !== undefined && !Number.isInteger(Number(item_id))) {
        return next(new AppError('Item id must be an integer', 400));
    }

    if (quantity !== undefined && quantity !== null && quantity !== '' && isNaN(Number(quantity))) {
        return next(new AppError('Quantity must be a number', 400));
    }

    if (unit_price !== undefined && unit_price !== null && unit_price !== '' && isNaN(Number(unit_price))) {
        return next(new AppError('Unit price must be a number', 400));
    }


    const [result] = await db.query(

        `UPDATE sales_details
        SET sales_id=COALESCE(?, sales_id),
            item_id=COALESCE(?, item_id),
            quantity=COALESCE(?, quantity),
            unit_price=COALESCE(?, unit_price)
        WHERE detail_id=?`,

        [
            sales_id ?? null,
            item_id ?? null,
            quantity ?? null,
            unit_price ?? null,
            id
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

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM sales_details WHERE detail_id=?',

        [id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Sales detail not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});