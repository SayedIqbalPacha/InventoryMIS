// const db = require('../config/db');

// // Get All Vendor Payments
// exports.getAllVendorPayments = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM vendor_payment'
//         );

//         res.status(200).json({
//             status: 'success',
//             results: rows.length,
//             data: {
//                 vendorPayments: rows
//             }
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Get Single Vendor Payment
// exports.getVendorPayment = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM vendor_payment WHERE payment_id = ?',
//             [req.params.id]
//         );

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 vendorPayment: rows
//             }
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Create Vendor Payment
// exports.createVendorPayment = async (req, res) => {
//     try {

//         const {
//             purchase_id,
//             currency_id,
//             amount,
//             payment_date,
//             vendor_id
//         } = req.body;

//         const [result] = await db.query(
//             `INSERT INTO vendor_payment
//             (purchase_id, currency_id, amount, payment_date, vendor_id)
//             VALUES (?, ?, ?, ?, ?)`,
//             [
//                 purchase_id,
//                 currency_id,
//                 amount,
//                 payment_date,
//                 vendor_id
//             ]
//         );

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 payment_id: result.insertId
//             }
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Update Vendor Payment
// exports.updateVendorPayment = async (req, res) => {
//     try {

//         const {
//             purchase_id,
//             currency_id,
//             amount,
//             payment_date,
//             vendor_id
//         } = req.body;

//         await db.query(
//             `UPDATE vendor_payment
//             SET purchase_id = ?,
//                 currency_id = ?,
//                 amount = ?,
//                 payment_date = ?,
//                 vendor_id = ?
//             WHERE payment_id = ?`,
//             [
//                 purchase_id,
//                 currency_id,
//                 amount,
//                 payment_date,
//                 vendor_id,
//                 req.params.id
//             ]
//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Vendor payment updated successfully.'
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Delete Vendor Payment
// exports.deleteVendorPayment = async (req, res) => {
//     try {

//         await db.query(
//             'DELETE FROM vendor_payment WHERE payment_id = ?',
//             [req.params.id]
//         );

//         res.status(204).json({
//             status: 'success',
//             data: null
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };

const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


// Get All Vendor Payments

exports.getAllVendorPayments = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT * FROM vendor_payment'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: {
            vendorPayments: rows
        }
    });

});


// Get Single Vendor Payment

exports.getVendorPayment = catchAsync(async (req, res, next) => {

    const id = req.params.id;
    const [rows] = await db.query(
        'SELECT * FROM vendor_payment WHERE payment_id = ?',
        [id]
    );

       if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid exchange rate ID', 400));
        }

    if (rows.length === 0) {

        return next(new AppError('Vendor payment not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data: {
            vendorPayment: rows[0]
        }

    });

});


// Create Vendor Payment

exports.createVendorPayment = catchAsync(async (req, res, next) => {

    const {
        purchase_id,
        currency_id,
        amount,
        payment_date,
        vendor_id
    } = req.body;

    const [result] = await db.query(

        `INSERT INTO vendor_payment
        (purchase_id, currency_id, amount, payment_date, vendor_id)
        VALUES (?, ?, ?, ?, ?)`,

        [
            purchase_id,
            currency_id,
            amount,
            payment_date,
            vendor_id
        ]

    );

    res.status(201).json({

        status: 'success',

        data: {
            payment_id: result.insertId
        }

    });

});


// Update Vendor Payment

exports.updateVendorPayment = catchAsync(async (req, res, next) => {

    const {
        purchase_id,
        currency_id,
        amount,
        payment_date,
        vendor_id
    } = req.body;

    const [result] = await db.query(

        `UPDATE vendor_payment
        SET purchase_id = ?,
            currency_id = ?,
            amount = ?,
            payment_date = ?,
            vendor_id = ?
        WHERE payment_id = ?`,

        [
            purchase_id,
            currency_id,
            amount,
            payment_date,
            vendor_id,
            req.params.id
        ]

    );

    if (!result.affectedRows) {

        return next(new AppError('Vendor payment not founded', 404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Vendor payment updated successfully.'

    });

});


// Delete Vendor Payment

exports.deleteVendorPayment = catchAsync(async (req, res, next) => {

    const [result] = await db.query(

        'DELETE FROM vendor_payment WHERE payment_id = ?',

        [req.params.id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Vendor payment not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});

