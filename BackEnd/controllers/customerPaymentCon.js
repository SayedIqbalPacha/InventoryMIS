

// const db = require('../config/db');

// // GET ALL
// exports.getAllCustomerPayment = async (req, res) => {

//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM customer_payment'
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
// exports.getOneCustomerPayment = async (req, res) => {

//     try {
//         const id = req.params.id;

//         const [rows] = await db.query(
//             'SELECT * FROM customer_payment WHERE cus_payment_id = ?',
//             [id]
//         );

//         if (rows.length === 0) {

//             return res.status(404).json({

//                 status: 'fail',

//                 message: 'customer_payment not found'

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
// exports.createCustomerPayment = async (req, res) => {

//     try {

//         const { 
//             customer_id, 
//             currency_id,
//             amount,
//             date,
//             sale_id
//         } = req.body;


//         const [result] = await db.query(

//             'INSERT INTO customer_payment(customer_id,currency_id,amount,date,sale_id) VALUES(?,?,?,?,?)',

//         [
//             customer_id, 
//             currency_id,
//             amount,
//             date,
//             sale_id
//         ]

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

// exports.updateCustomerPayment = async (req, res) => {

//     try {

//         const id = req.params.id;


//         const { 
//            customer_id, 
//             currency_id,
//             amount,
//             date,
//             sale_id
//         } = req.body;


//         await db.query(

//             `UPDATE customer_payment 
//              SET customer_id=?, currency_id=?, amount=?, date=?, sale_id=?
//              WHERE cus_payment_id=?`,

//         [
//             customer_id, 
//             currency_id,
//             amount,
//             date,
//             sale_id,
//             id
//         ]

//         );


//         res.status(200).json({

//             status: 'success',

//             message: 'customer_payment updated successfully'

//         });


//     } catch (err) {

//         res.status(500).json({

//             status: 'error',

//             message: err.message

//         });

//     }

// };



// // DELETE

// exports.deleteCustomerPayment = async (req, res) => {

//     try {

//         const id = req.params.id;


//         await db.query(

//             'DELETE FROM customer_payment WHERE cus_payment_id=?',
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
exports.getAllCustomerPayment = catchAsync(async (req, res,next) => {

    const [rows] = await db.query(
        'SELECT * FROM customer_payment'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// GET ONE
exports.getOneCustomerPayment = catchAsync(async (req, res,next) => {

    const id = req.params.id;

    const [rows] = await db.query(
        'SELECT * FROM customer_payment WHERE cus_payment_id = ?',
        [id]
    );

    if (rows.length === 0) {

        return next(new AppError('customer_payment not found',404));

    }

    res.status(200).json({

        status: 'success',

        data: rows[0]

    });

});


// CREATE
exports.createCustomerPayment = catchAsync(async (req, res,next) => {

    const {
        customer_id,
        currency_id,
        amount,
        date,
        sale_id
    } = req.body;


    // CHECK REQUIRED FIELD

    if (!currency_id) {
        return next(new AppError('Please provide currency id',400));
    }


    // CHECK DATA TYPE

    if (customer_id !== undefined && !Number.isInteger(Number(customer_id))) {
        return next(new AppError('Customer id must be an integer',400));
    }

    if (!Number.isInteger(Number(currency_id))) {
        return next(new AppError('Currency id must be an integer',400));
    }

    if (amount !== undefined && isNaN(Number(amount))) {
        return next(new AppError('Amount must be a number',400));
    }

    if (sale_id !== undefined && !Number.isInteger(Number(sale_id))) {
        return next(new AppError('Sale id must be an integer',400));
    }

    if (date !== undefined && isNaN(Date.parse(date))) {
        return next(new AppError('Date must be a valid date',400));
    }


    const [result] = await db.query(

        'INSERT INTO customer_payment(customer_id,currency_id,amount,date,sale_id) VALUES(?,?,?,?,?)',

        [
            customer_id,
            currency_id,
            amount,
            date,
            sale_id
        ]

    );

    res.status(201).json({

        status: 'success',

        insertedId: result.insertId

    });

});


// UPDATE

exports.updateCustomerPayment = catchAsync(async (req, res,next) => {

    const id = req.params.id;


    const {
        customer_id,
        currency_id,
        amount,
        date,
        sale_id
    } = req.body;


    // CHECK IF CUSTOMER_PAYMENT EXISTS

    const [customerPayment] = await db.query(
        'SELECT cus_payment_id FROM customer_payment WHERE cus_payment_id = ?',
        [id]
    );

    if (customerPayment.length === 0) {

        return next(new AppError('customer_payment not founded',404));

    }


    // CHECK REQUIRED FIELD

    if (!currency_id && currency_id !== undefined) {
        return next(new AppError('Please provide currency id',400));
    }


    // CHECK DATA TYPE

    if (customer_id !== undefined && !Number.isInteger(Number(customer_id))) {
        return next(new AppError('Customer id must be an integer',400));
    }

    if (currency_id !== undefined && !Number.isInteger(Number(currency_id))) {
        return next(new AppError('Currency id must be an integer',400));
    }

    if (amount !== undefined && isNaN(Number(amount))) {
        return next(new AppError('Amount must be a number',400));
    }

    if (sale_id !== undefined && !Number.isInteger(Number(sale_id))) {
        return next(new AppError('Sale id must be an integer',400));
    }

    if (date !== undefined && isNaN(Date.parse(date))) {
        return next(new AppError('Date must be a valid date',400));
    }


    const [result] = await db.query(

        `UPDATE customer_payment
         SET customer_id=COALESCE(?, customer_id),
             currency_id=COALESCE(?, currency_id),
             amount=COALESCE(?, amount),
             date=COALESCE(?, date),
             sale_id=COALESCE(?, sale_id)
         WHERE cus_payment_id=?`,

        [
            customer_id || null,
            currency_id || null,
            amount || null,
            date || null,
            sale_id || null,
            id
        ]

    );

    if(!result.affectedRows){

        return next(new AppError('customer_payment not founded',404));

    }


    res.status(200).json({

        status: 'success',

        message: 'customer_payment updated successfully'

    });

});


// DELETE

exports.deleteCustomerPayment = catchAsync(async (req, res,next) => {

    const id = req.params.id;


    const [result] = await db.query(

        'DELETE FROM customer_payment WHERE cus_payment_id=?',
        [id]

    );

    if(!result.affectedRows){

        return next(new AppError('customer_payment not founded',404));

    }


    res.status(204).json({

        status: 'success',

        data: null

    });

});