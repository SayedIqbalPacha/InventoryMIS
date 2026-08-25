// const db = require('../config/db');



// // GET ALL

// exports.getAllPurchases = async (req, res) => {

//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM purchase'
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



// // GET ONE

// exports.getPurchase = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const [rows] = await db.query(
//             'SELECT * FROM purchase WHERE purchase_id = ?',
//             [id]
//         );

//         if (rows.length === 0) {

//             return res.status(404).json({

//                 status: 'fail',

//                 message: 'Purchase not found'

//             });

//         }

//         res.status(200).json({

//             status: 'success',

//             data: rows[0]

//         });

//     } catch (err) {

//         res.status(500).json({

//             status: 'error',

//             message: err.message

//         });

//     }

// };



// // CREATE

// exports.createPurchase = async (req, res) => {

//     try {

//         const {

//             currency_id,
//             vendor_id,
//             purchase_date,
//             total_amount,
//             status

//         } = req.body;

//         const [result] = await db.query(

//             `INSERT INTO purchase
//             (currency_id, vendor_id, purchase_date, total_amount, status)
//             VALUES (?, ?, ?, ?, ?)`,

//             [
//                 currency_id,
//                 vendor_id,
//                 purchase_date,
//                 total_amount,
//                 status
//             ]

//         );

//         res.status(201).json({

//             status: 'success',

//             insertedId: result.insertId

//         });

//     } catch (err) {

//         res.status(500).json({

//             status: 'error',

//             message: err.message

//         });

//     }

// };



// // UPDATE

// exports.updatePurchase = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const {

//             currency_id,
//             vendor_id,
//             purchase_date,
//             total_amount,
//             status

//         } = req.body;

//         await db.query(

//             `UPDATE purchase
//             SET
//             currency_id = ?,
//             vendor_id = ?,
//             purchase_date = ?,
//             total_amount = ?,
//             status = ?
//             WHERE purchase_id = ?`,

//             [
//                 currency_id,
//                 vendor_id,
//                 purchase_date,
//                 total_amount,
//                 status,
//                 id
//             ]

//         );

//         res.status(200).json({

//             status: 'success',

//             message: 'Purchase updated successfully'

//         });

//     } catch (err) {

//         res.status(500).json({

//             status: 'error',

//             message: err.message

//         });

//     }

// };



// // DELETE

// exports.deletePurchase = async (req, res) => {

//     try {

//         const id = req.params.id;

//         await db.query(

//             'DELETE FROM purchase WHERE purchase_id = ?',

//             [id]

//         );

//         res.status(204).json({

//             status: 'success',

//             data: null

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


// GET ALL

exports.getAllPurchases = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT * FROM purchase'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// GET ONE

exports.getPurchase = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid purchase ID', 400));
    }

    const [rows] = await db.query(
        'SELECT * FROM purchase WHERE purchase_id = ?',
        [id]
    );

    if (rows.length === 0) {

        return next(new AppError('Purchase not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data: rows[0]

    });

});


// CREATE

exports.createPurchase = catchAsync(async (req, res, next) => {

    const {

        currency_id,
        vendor_id,
        purchase_date,
        total_amount,
        status

    } = req.body;


    // CHECK REQUIRED FIELD

    if (!currency_id) {
        return next(new AppError('Please provide currency id', 400));
    }

    if (!vendor_id) {
        return next(new AppError('Please provide vendor id', 400));
    }

    if (!purchase_date) {
        return next(new AppError('Please provide purchase date', 400));
    }


    // CHECK DATA TYPE

    if (!Number.isInteger(Number(currency_id))) {
        return next(new AppError('Currency id must be an integer', 400));
    }

    if (!Number.isInteger(Number(vendor_id))) {
        return next(new AppError('Vendor id must be an integer', 400));
    }

    if (isNaN(Date.parse(purchase_date))) {
        return next(new AppError('Purchase date must be a valid date', 400));
    }

    if (total_amount !== undefined && total_amount !== null && total_amount !== '' && isNaN(Number(total_amount))) {
        return next(new AppError('Total amount must be a number', 400));
    }

    if (status !== undefined && status !== null && typeof status !== 'string') {
        return next(new AppError('Status must be a string', 400));
    }


    const [result] = await db.query(

        `INSERT INTO purchase
        (currency_id, vendor_id, purchase_date, total_amount, status)
        VALUES (?, ?, ?, ?, ?)`,
        [
            currency_id,
            vendor_id,
            purchase_date,
            total_amount,
            status
        ]

    );

    res.status(201).json({

        status: 'success',

        insertedId: result.insertId

    });

});


// UPDATE

exports.updatePurchase = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const {

        currency_id,
        vendor_id,
        purchase_date,
        total_amount,
        status

    } = req.body;


    // CHECK IF PURCHASE EXISTS

    const [purchase] = await db.query(
        'SELECT purchase_id FROM purchase WHERE purchase_id = ?',
        [id]
    );

    if (purchase.length === 0) {

        return next(new AppError('Purchase not founded', 404));

    }


    // CHECK REQUIRED FIELD

    if (!currency_id && currency_id !== undefined) {
        return next(new AppError('Please provide currency id', 400));
    }

    if (!vendor_id && vendor_id !== undefined) {
        return next(new AppError('Please provide vendor id', 400));
    }

    if (!purchase_date && purchase_date !== undefined) {
        return next(new AppError('Please provide purchase date', 400));
    }


    // CHECK DATA TYPE

    if (currency_id !== undefined && !Number.isInteger(Number(currency_id))) {
        return next(new AppError('Currency id must be an integer', 400));
    }

    if (vendor_id !== undefined && !Number.isInteger(Number(vendor_id))) {
        return next(new AppError('Vendor id must be an integer', 400));
    }

    if (purchase_date !== undefined && isNaN(Date.parse(purchase_date))) {
        return next(new AppError('Purchase date must be a valid date', 400));
    }

    if (total_amount !== undefined && total_amount !== null && total_amount !== '' && isNaN(Number(total_amount))) {
        return next(new AppError('Total amount must be a number', 400));
    }

    if (status !== undefined && status !== null && typeof status !== 'string') {
        return next(new AppError('Status must be a string', 400));
    }


    const [result] = await db.query(

        `UPDATE purchase
        SET
        currency_id = COALESCE(?, currency_id),
        vendor_id = COALESCE(?, vendor_id),
        purchase_date = COALESCE(?, purchase_date),
        total_amount = COALESCE(?, total_amount),
        status = COALESCE(?, status)
        WHERE purchase_id = ?`,

        [
            currency_id ?? null,
            vendor_id ?? null,
            purchase_date ?? null,
            total_amount ?? null,
            status ?? null,
            id
        ]

    );

    if (!result.affectedRows) {

        return next(new AppError('Purchase not founded', 404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Purchase updated successfully'

    });

});


// DELETE

exports.deletePurchase = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM purchase WHERE purchase_id = ?',

        [id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Purchase not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});