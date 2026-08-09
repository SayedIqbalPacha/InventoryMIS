// const db = require('../config/db');

// // Get All Vendors
// exports.getAllVendors = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM vendor'
//         );

//         res.status(200).json({
//             status: 'success',
//             results: rows.length,
//             data: {
//                 vendors: rows
//             }
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Get Single Vendor
// exports.getVendor = async (req, res) => {
//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM vendor WHERE vendor_id = ?',
//             [req.params.id]
//         );

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 vendor: rows
//             }
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Create Vendor
// exports.createVendor = async (req, res) => {
//     try {

//         const {
//             vendor_name,
//             contact_person,
//             phone,
//             email,
//             address
//         } = req.body;

//         const [result] = await db.query(
//             `INSERT INTO vendor
//             (vendor_name, contact_person, phone, email, address)
//             VALUES (?, ?, ?, ?, ?)`,
//             [
//                 vendor_name,
//                 contact_person,
//                 phone,
//                 email,
//                 address
//             ]
//         );

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 vendor_id: result.insertId
//             }
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Update Vendor
// exports.updateVendor = async (req, res) => {
//     try {

//         const {
//             vendor_name,
//             contact_person,
//             phone,
//             email,
//             address
//         } = req.body;

//         await db.query(
//             `UPDATE vendor
//             SET vendor_name = ?,
//                 contact_person = ?,
//                 phone = ?,
//                 email = ?,
//                 address = ?
//             WHERE vendor_id = ?`,
//             [
//                 vendor_name,
//                 contact_person,
//                 phone,
//                 email,
//                 address,
//                 req.params.id
//             ]
//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Vendor updated successfully.'
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'fail',
//             message: err.message
//         });

//     }
// };


// // Delete Vendor
// exports.deleteVendor = async (req, res) => {
//     try {

//         await db.query(
//             'DELETE FROM vendor WHERE vendor_id = ?',
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

// Get All Vendors

exports.getAllVendors = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT * FROM vendor'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: {
            vendors: rows
        }
    });

});


// Get Single Vendor

exports.getVendor = catchAsync(async (req, res, next) => {

    const id = req.params.id;
    const [rows] = await db.query(
        'SELECT * FROM vendor WHERE vendor_id = ?',
        [id]
    );

       if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid exchange rate ID', 400));
    }
    if (rows.length === 0) {

        return next(new AppError('Vendor not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data: {
            vendor: rows[0]
        }

    });

});


// Create Vendor

exports.createVendor = catchAsync(async (req, res, next) => {

    const {
        vendor_name,
        contact_person,
        phone,
        email,
        address
    } = req.body;

    const [result] = await db.query(

        `INSERT INTO vendor
        (vendor_name, contact_person, phone, email, address)
        VALUES (?, ?, ?, ?, ?)`,

        [
            vendor_name,
            contact_person,
            phone,
            email,
            address
        ]

    );

    res.status(201).json({

        status: 'success',

        data: {
            vendor_id: result.insertId
        }

    });

});


// Update Vendor

exports.updateVendor = catchAsync(async (req, res, next) => {

    const {
        vendor_name,
        contact_person,
        phone,
        email,
        address
    } = req.body;

    const [result] = await db.query(

        `UPDATE vendor
        SET vendor_name = ?,
            contact_person = ?,
            phone = ?,
            email = ?,
            address = ?
        WHERE vendor_id = ?`,

        [
            vendor_name,
            contact_person,
            phone,
            email,
            address,
            req.params.id
        ]

    );

    if (!result.affectedRows) {

        return next(new AppError('Vendor not founded', 404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Vendor updated successfully.'

    });

});


// Delete Vendor

exports.deleteVendor = catchAsync(async (req, res, next) => {

    const [result] = await db.query(

        'DELETE FROM vendor WHERE vendor_id = ?',

        [req.params.id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Vendor not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});
