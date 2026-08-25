// const db = require('../config/db');

// // GET ALL

// exports.getAllCurrencies = async (req, res) => {

//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM currency'
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

// exports.getCurrency = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const [rows] = await db.query(
//             'SELECT * FROM currency WHERE currency_id = ?',
//             [id]
//         );

//         if (rows.length === 0) {

//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'Currency not found'
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

// exports.createCurrency = async (req, res) => {

//     try {

//         const { currency_code } = req.body;

//         const [result] = await db.query(

//             'INSERT INTO currency (currency_code) VALUES (?)',

//             [currency_code]

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

// exports.updateCurrency = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const { currency_code } = req.body;

//         await db.query(

//             'UPDATE currency SET currency_code = ? WHERE currency_id = ?',

//             [currency_code, id]

//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Currency updated successfully'
//         });

//     } catch (err) {

//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         });

//     }

// };



// // DELETE

// exports.deleteCurrency = async (req, res) => {

//     try {

//         const id = req.params.id;

//         await db.query(

//             'DELETE FROM currency WHERE currency_id = ?',

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

exports.getAllCurrencies = catchAsync(async (req, res,next) => {

    const [rows] = await db.query(
        'SELECT * FROM currency'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// GET ONE

exports.getCurrency = catchAsync(async (req, res,next) => {

    const id = req.params.id;

    const [rows] = await db.query(
        'SELECT * FROM currency WHERE currency_id = ?',
        [id]
    );

    if (rows.length === 0) {

        return next(new AppError('Currency not found',404));
    }

    res.status(200).json({
        status: 'success',
        data: rows[0]
    });

});


// CREATE

exports.createCurrency = catchAsync(async (req, res,next) => {

    const { currency_code } = req.body;

    // CHECK REQUIRED FIELD

    if (!currency_code) {
        return next(new AppError('Please provide currency code',400));
    }

    // CHECK DATA TYPE

    if (typeof currency_code !== 'string') {
        return next(new AppError('Currency code must be a string',400));
    }

    // CHECK IF CURRENCY CODE ALREADY EXISTS
    const [existingCurrency] = await db.query(
        'SELECT currency_id FROM currency WHERE currency_code = ?',
        [currency_code]
    );
    if (existingCurrency.length > 0) {
        return next(new AppError('This currency code is already registered',400));
    }

    const [result] = await db.query(

        'INSERT INTO currency (currency_code) VALUES (?)',

        [currency_code]

    );

    res.status(201).json({
        status: 'success',
        insertedId: result.insertId
    });

});


// UPDATE

exports.updateCurrency = catchAsync(async (req, res,next) => {

    const id = req.params.id;

    const { currency_code } = req.body;

    // CHECK IF CURRENCY EXISTS

    const [currency] = await db.query(
        'SELECT currency_id, currency_code FROM currency WHERE currency_id = ?',
        [id]
    );

    if (currency.length === 0) {

        return next(new AppError('Currency not founded',404));

    }

    // CHECK REQUIRED FIELD

    if (!currency_code && currency_code !== undefined) {
        return next(new AppError('Please provide currency code',400));
    }

    // CHECK DATA TYPE

    if (currency_code !== undefined && typeof currency_code !== 'string') {
        return next(new AppError('Currency code must be a string',400));
    }

    // CHECK IF CURRENCY CODE ALREADY EXISTS

    if (currency_code) {

        const [existingCurrency] = await db.query(
            `SELECT currency_id
             FROM currency
             WHERE currency_code = ?
             AND currency_id != ?`,
            [currency_code, id]
        );

        if (existingCurrency.length > 0) {
            return next(
                new AppError('This currency code is already registered',400)
            );
        }
    }
    

    const [result] = await db.query(

        `UPDATE currency
         SET currency_code = COALESCE(?, currency_code)
         WHERE currency_id = ?`,

        [
            currency_code || null,
            id
        ]

    );

    if(!result.affectedRows){
        return next(new AppError('Currency not founded',404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Currency updated successfully'
    });

});


// DELETE

exports.deleteCurrency = catchAsync(async (req, res,next) => {

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM currency WHERE currency_id = ?',

        [id]

    );

    if(!result.affectedRows){

        return next(new AppError('Currency not founded',404));

    }

    res.status(204).json({
        status: 'success',
        data: null
    });

});