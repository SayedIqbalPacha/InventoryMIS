
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
    
    const [rows] = await db.query(
        'SELECT * FROM purchase_details WHERE detail_id = ?',
        [id]
    );

      if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid exchange rate ID', 400));
    }

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

    const {
        purchase_id,
        item_id,
        quantity,
        unit_price
    } = req.body;

    const [result] = await db.query(

        `UPDATE purchase_details
        SET purchase_id=?,
            item_id=?,
            quantity=?,
            unit_price=?
        WHERE detail_id=?`,

        [
            purchase_id,
            item_id,
            quantity,
            unit_price,
            req.params.id
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

    const [result] = await db.query(

        'DELETE FROM purchase_details WHERE detail_id=?',

        [req.params.id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Purchase detail not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});
