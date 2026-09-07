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
        data: rows
    });

});


// Get Single Vendor

exports.getVendor = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid vendor ID', 400));
    }

    const [rows] = await db.query(
        'SELECT * FROM vendor WHERE vendor_id = ?',
        [id]
    );

    if (rows.length === 0) {

        return next(new AppError('Vendor not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data:rows[0]
        

    });

});


// Create Vendor

exports.createVendor = catchAsync(async (req, res, next) => {

    const {
        vendor_name,
        email,
        address
    } = req.body;


    // CHECK REQUIRED FIELD

    if (!vendor_name) {
        return next(new AppError('Please provide vendor name', 400));
    }


    // CHECK DATA TYPE

    if (typeof vendor_name !== 'string') {
        return next(new AppError('Vendor name must be a string', 400));
    }

    if (email !== undefined && typeof email !== 'string') {
        return next(new AppError('Email must be a string', 400));
    }

    if (address !== undefined && typeof address !== 'string') {
        return next(new AppError('Address must be a string', 400));
    }


    const [result] = await db.query(

        `INSERT INTO vendor
        (vendor_name, email, address)
        VALUES (?, ?, ?)`,

        [
            vendor_name,
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

    const id = req.params.id;

    const {
        vendor_name,
        email,
        address
    } = req.body;


    // CHECK IF VENDOR EXISTS

    const [vendor] = await db.query(
        'SELECT vendor_id FROM vendor WHERE vendor_id = ?',
        [id]
    );

    if (vendor.length === 0) {

        return next(new AppError('Vendor not founded', 404));

    }


    // CHECK REQUIRED FIELD

    if (!vendor_name && vendor_name !== undefined) {
        return next(new AppError('Please provide vendor name', 400));
    }


    // CHECK DATA TYPE

    if (vendor_name !== undefined && typeof vendor_name !== 'string') {
        return next(new AppError('Vendor name must be a string', 400));
    }

    if (email !== undefined && typeof email !== 'string') {
        return next(new AppError('Email must be a string', 400));
    }

    if (address !== undefined && typeof address !== 'string') {
        return next(new AppError('Address must be a string', 400));
    }


    const [result] = await db.query(

        `UPDATE vendor
        SET vendor_name = COALESCE(?, vendor_name),
            email = COALESCE(?, email),
            address = COALESCE(?, address)
        WHERE vendor_id = ?`,

        [
            vendor_name ?? null,
            email ?? null,
            address ?? null,
            id
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

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM vendor WHERE vendor_id = ?',

        [id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Vendor not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});