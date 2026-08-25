// const db = require('../config/db');



// // GET ALL

// exports.getAllExchangeRates = async (req, res) => {

//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM exchange_rate'
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

// exports.getExchangeRate = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const [rows] = await db.query(
//             'SELECT * FROM exchange_rate WHERE rate_id = ?',
//             [id]
//         );

//         if (rows.length === 0) {

//             return res.status(404).json({

//                 status: 'fail',

//                 message: 'Exchange rate not found'

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

// exports.createExchangeRate = async (req, res) => {

//     try {

//         const {

//             from_currency_id,
//             to_currency_id,
//             exchange_rate,
//             effective_date

//         } = req.body;

//         const [result] = await db.query(

//             `INSERT INTO exchange_rate
//             (from_currency_id, to_currency_id, exchange_rate, effective_date)
//             VALUES (?, ?, ?, ?)`,

//             [
//                 from_currency_id,
//                 to_currency_id,
//                 exchange_rate,
//                 effective_date
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

// exports.updateExchangeRate = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const {

//             from_currency_id,
//             to_currency_id,
//             exchange_rate,
//             effective_date

//         } = req.body;

//         await db.query(

//             `UPDATE exchange_rate
//             SET
//             from_currency_id = ?,
//             to_currency_id = ?,
//             exchange_rate = ?,
//             effective_date = ?
//             WHERE rate_id = ?`,

//             [
//                 from_currency_id,
//                 to_currency_id,
//                 exchange_rate,
//                 effective_date,
//                 id
//             ]

//         );

//         res.status(200).json({

//             status: 'success',

//             message: 'Exchange rate updated successfully'

//         });

//     } catch (err) {

//         res.status(500).json({

//             status: 'error',

//             message: err.message

//         });

//     }

// };



// // DELETE

// exports.deleteExchangeRate = async (req, res) => {

//     try {

//         const id = req.params.id;

//         await db.query(

//             'DELETE FROM exchange_rate WHERE rate_id = ?',

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

exports.getAllExchangeRates = catchAsync(async (req, res,next) => {

    const [rows] = await db.query(
        'SELECT * FROM exchange_rate'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// GET ONE

exports.getExchangeRate = catchAsync(async (req, res,next) => {

    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid exchange rate ID', 400));
    }

    const [rows] = await db.query(
        'SELECT * FROM exchange_rate WHERE rate_id = ?',
        [id]
    );

    if (rows.length === 0) {

        return next(new AppError('Exchange rate not found',404));

    }

    res.status(200).json({

        status: 'success',
        data: rows[0]

    });

});


// CREATE

exports.createExchangeRate = catchAsync(async (req, res,next) => {

    const {

        from_currency_id,
        to_currency_id,
        exchange_rate,
        effective_date

    } = req.body;


    // CHECK REQUIRED FIELD

    if (!from_currency_id) {
        return next(new AppError('Please provide from currency id',400));
    }

    if (!to_currency_id) {
        return next(new AppError('Please provide to currency id',400));
    }

    if (!exchange_rate) {
        return next(new AppError('Please provide exchange rate',400));
    }

    if (!effective_date) {
        return next(new AppError('Please provide effective date',400));
    }


    // CHECK DATA TYPE

    if (!Number.isInteger(Number(from_currency_id))) {
        return next(new AppError('From currency id must be an integer',400));
    }

    if (!Number.isInteger(Number(to_currency_id))) {
        return next(new AppError('To currency id must be an integer',400));
    }

    if (isNaN(Number(exchange_rate))) {
        return next(new AppError('Exchange rate must be a number',400));
    }

    //Date.parse() returns a number when the date is valid,
    if (isNaN(Date.parse(effective_date))) {
        return next(new AppError('Effective date must be a valid date',400));
    }


    const [result] = await db.query(

        `INSERT INTO exchange_rate
        (from_currency_id, to_currency_id, exchange_rate, effective_date)
        VALUES (?, ?, ?, ?)`,

        [
            from_currency_id,
            to_currency_id,
            exchange_rate,
            effective_date
        ]

    );

    res.status(201).json({

        status: 'success',

        insertedId: result.insertId

    });

});


// UPDATE

exports.updateExchangeRate = catchAsync(async (req, res,next) => {

    const id = req.params.id;

    const {

        from_currency_id,
        to_currency_id,
        exchange_rate,
        effective_date

    } = req.body;


    // CHECK IF EXCHANGE RATE EXISTS

    const [exchangeRate] = await db.query(
        'SELECT rate_id FROM exchange_rate WHERE rate_id = ?',
        [id]
    );

    if (exchangeRate.length === 0) {

        return next(new AppError('Exchange rate not founded',404));

    }


    // CHECK REQUIRED FIELD

    if (!from_currency_id && from_currency_id !== undefined) {
        return next(new AppError('Please provide from currency id',400));
    }

    if (!to_currency_id && to_currency_id !== undefined) {
        return next(new AppError('Please provide to currency id',400));
    }

    if (!exchange_rate && exchange_rate !== undefined) {
        return next(new AppError('Please provide exchange rate',400));
    }

    if (!effective_date && effective_date !== undefined) {
        return next(new AppError('Please provide effective date',400));
    }


    // CHECK DATA TYPE

    if (from_currency_id !== undefined && !Number.isInteger(Number(from_currency_id))) {
        return next(new AppError('From currency id must be an integer',400));
    }

    if (to_currency_id !== undefined && !Number.isInteger(Number(to_currency_id))) {
        return next(new AppError('To currency id must be an integer',400));
    }

    if (exchange_rate !== undefined && isNaN(Number(exchange_rate))) {
        return next(new AppError('Exchange rate must be a number',400));
    }

    if (effective_date !== undefined && isNaN(Date.parse(effective_date))) {
        return next(new AppError('Effective date must be a valid date',400));
    }


    const [result] = await db.query(

        `UPDATE exchange_rate
        SET
        from_currency_id = COALESCE(?, from_currency_id),
        to_currency_id = COALESCE(?, to_currency_id),
        exchange_rate = COALESCE(?, exchange_rate),
        effective_date = COALESCE(?, effective_date)
        WHERE rate_id = ?`,

        [
            from_currency_id || null,
            to_currency_id || null,
            exchange_rate || null,
            effective_date || null,
            id
        ]

    );

    if(!result.affectedRows){

        return next(new AppError('Exchange rate not founded',404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Exchange rate updated successfully'

    });

});


// DELETE

exports.deleteExchangeRate = catchAsync(async (req, res,next) => {

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM exchange_rate WHERE rate_id = ?',

        [id]

    );

    if(!result.affectedRows){

        return next(new AppError('Exchange rate not founded',404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});