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

  

    const [rows] = await db.query(
        'SELECT * FROM exchange_rate WHERE rate_id = ?',
        [id]
    );
  
      if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid exchange rate ID', 400));
        }

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

    const [result] = await db.query(

        `UPDATE exchange_rate
        SET
        from_currency_id = ?,
        to_currency_id = ?,
        exchange_rate = ?,
        effective_date = ?
        WHERE rate_id = ?`,

        [
            from_currency_id,
            to_currency_id,
            exchange_rate,
            effective_date,
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