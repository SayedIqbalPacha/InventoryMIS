const db = require('../config/db');



// GET ALL

exports.getAllExchangeRates = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM exchange_rate'
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

exports.getExchangeRate = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM exchange_rate WHERE rate_id = ?',
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({

                status: 'fail',

                message: 'Exchange rate not found'

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

exports.createExchangeRate = async (req, res) => {

    try {

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

    } catch (err) {

        res.status(500).json({

            status: 'error',

            message: err.message

        });

    }

};



// UPDATE

exports.updateExchangeRate = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            from_currency_id,
            to_currency_id,
            exchange_rate,
            effective_date

        } = req.body;

        await db.query(

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

        res.status(200).json({

            status: 'success',

            message: 'Exchange rate updated successfully'

        });

    } catch (err) {

        res.status(500).json({

            status: 'error',

            message: err.message

        });

    }

};



// DELETE

exports.deleteExchangeRate = async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(

            'DELETE FROM exchange_rate WHERE rate_id = ?',

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