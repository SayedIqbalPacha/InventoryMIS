

const db = require('../config/db');

// GET ALL
exports.getAllCustomerPayment = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM customer_payment'
        );

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: rows
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};



// GET ONE
exports.getOneCustomerPayment = async (req, res) => {

    try {
        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM customer_payment WHERE cus_payment_id = ?',
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({

                status: 'fail',

                message: 'customer_payment not found'

            });

        }

        res.status(200).json({

            status: 'success',

            data: rows[0]

        });


    } catch (err) {

        res.status(500).json({

            status: 'error',
            message: err.message

        });

    }

};



// CREATE
exports.createCustomerPayment = async (req, res) => {

    try {

        const { 
            customer_id, 
            currency_id,
            amount,
            date,
            sale_id
        } = req.body;


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


    } catch (err) {

        res.status(500).json({

            status: 'error',

            message: err.message

        });

    }

};



// UPDATE

exports.updateCustomerPayment = async (req, res) => {

    try {

        const id = req.params.id;


        const { 
           customer_id, 
            currency_id,
            amount,
            date,
            sale_id
        } = req.body;


        await db.query(

            `UPDATE customer_payment 
             SET customer_id=?, currency_id=?, amount=?, date=?, sale_id=?
             WHERE cus_payment_id=?`,

        [
            customer_id, 
            currency_id,
            amount,
            date,
            sale_id,
            id
        ]

        );


        res.status(200).json({

            status: 'success',

            message: 'customer_payment updated successfully'

        });


    } catch (err) {

        res.status(500).json({

            status: 'error',

            message: err.message

        });

    }

};



// DELETE

exports.deleteCustomerPayment = async (req, res) => {

    try {

        const id = req.params.id;


        await db.query(

            'DELETE FROM customer_payment WHERE cus_payment_id=?',
            [id]

        );


        res.status(204).json({

            status: 'success',

            data: null

        });


    } catch (err) {

        res.status(500).json({

            status: 'error',

            message: err.message

        });

    }

};