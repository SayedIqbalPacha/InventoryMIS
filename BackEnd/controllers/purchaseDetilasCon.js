
// const db = require('../config/db');

// // Get All Purchase Details
// exports.getAllPurchaseDetails = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM purchase_details'
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


// // Get Single Purchase Detail
// exports.getPurchaseDetail = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM purchase_details WHERE detail_id = ?',
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


// // Create Purchase Detail
// exports.createPurchaseDetail = async (req, res) => {
//     try {

//         const {
//             purchase_id,
//             item_id,
//             quantity,
//             unit_price
//         } = req.body;

//         const [result] = await db.query(
//             `INSERT INTO purchase_details
//             (purchase_id,item_id,quantity,unit_price)
//             VALUES (?,?,?,?)`,
//             [
//                 purchase_id,
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


// // Update Purchase Detail
// exports.updatePurchaseDetail = async (req, res) => {
//     try {

//         const {
//             purchase_id,
//             item_id,
//             quantity,
//             unit_price
//         } = req.body;

//         await db.query(
//             `UPDATE purchase_details
//             SET purchase_id=?,
//                 item_id=?,
//                 quantity=?,
//                 unit_price=?
//             WHERE detail_id=?`,
//             [
//                 purchase_id,
//                 item_id,
//                 quantity,
//                 unit_price,
//                 req.params.id
//             ]
//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Purchase detail updated successfully.'
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }
// };


// // Delete Purchase Detail
// exports.deletePurchaseDetail = async (req, res) => {
//     try {

//         await db.query(
//             'DELETE FROM purchase_details WHERE detail_id=?',
//             [req.params.id]
//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Purchase detail deleted successfully.'
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


// Get All Purchase Details

exports.getAllPurchaseDetails = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT * FROM purchase_details'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// Get Single Purchase Detail

exports.getPurchaseDetail = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid purchase detail ID', 400));
    }

    const [rows] = await db.query(
        'SELECT * FROM purchase_details WHERE detail_id = ?',
        [id]
    );

    if (rows.length === 0) {

        return next(new AppError('Purchase detail not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data: rows[0]

    });

});


// Create Purchase Detail

exports.createPurchaseDetail = catchAsync(async (req, res, next) => {

    const {
        purchase_id,
        item_id,
        quantity,
        unit_price
    } = req.body;


    // CHECK REQUIRED FIELD

    if (!purchase_id) {
        return next(new AppError('Please provide purchase id', 400));
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

    if (!Number.isInteger(Number(purchase_id))) {
        return next(new AppError('Purchase id must be an integer', 400));
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

        `INSERT INTO purchase_details
        (purchase_id,item_id,quantity,unit_price)
        VALUES (?,?,?,?)`,

        [
            purchase_id,
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


// Update Purchase Detail

exports.updatePurchaseDetail = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const {
        purchase_id,
        item_id,
        quantity,
        unit_price
    } = req.body;


    // CHECK IF PURCHASE DETAIL EXISTS

    const [purchaseDetail] = await db.query(
        'SELECT detail_id FROM purchase_details WHERE detail_id = ?',
        [id]
    );

    if (purchaseDetail.length === 0) {

        return next(new AppError('Purchase detail not founded', 404));

    }


    // CHECK REQUIRED FIELD

    if (!purchase_id && purchase_id !== undefined) {
        return next(new AppError('Please provide purchase id', 400));
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

    if (purchase_id !== undefined && !Number.isInteger(Number(purchase_id))) {
        return next(new AppError('Purchase id must be an integer', 400));
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

        `UPDATE purchase_details
        SET purchase_id=COALESCE(?, purchase_id),
            item_id=COALESCE(?, item_id),
            quantity=COALESCE(?, quantity),
            unit_price=COALESCE(?, unit_price)
        WHERE detail_id=?`,

        [
            purchase_id ?? null,
            item_id ?? null,
            quantity ?? null,
            unit_price ?? null,
            id
        ]

    );

    if (!result.affectedRows) {

        return next(new AppError('Purchase detail not founded', 404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Purchase detail updated successfully.'

    });

});


// Delete Purchase Detail

exports.deletePurchaseDetail = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM purchase_details WHERE detail_id=?',

        [id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Purchase detail not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});