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

    const [rows] = await db.query(
        'SELECT * FROM purchase WHERE purchase_id = ?',
        [id]
    );
    
   if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid exchange rate ID', 400));

    }

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

    const [result] = await db.query(

        `UPDATE purchase
        SET
        currency_id = ?,
        vendor_id = ?,
        purchase_date = ?,
        total_amount = ?,
        status = ?
        WHERE purchase_id = ?`,

        [
            currency_id,
            vendor_id,
            purchase_date,
            total_amount,
            status,
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
