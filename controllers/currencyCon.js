const db = require('../config/db');



// GET ALL

exports.getAllCurrencies = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM currency'
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

exports.getCurrency = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM currency WHERE currency_id = ?',
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                status: 'fail',
                message: 'Currency not found'
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

exports.createCurrency = async (req, res) => {

    try {

        const { currency_code } = req.body;

        const [result] = await db.query(

            'INSERT INTO currency (currency_code) VALUES (?)',

            [currency_code]

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

exports.updateCurrency = async (req, res) => {

    try {

        const id = req.params.id;

        const { currency_code } = req.body;

        await db.query(

            'UPDATE currency SET currency_code = ? WHERE currency_id = ?',

            [currency_code, id]

        );

        res.status(200).json({
            status: 'success',
            message: 'Currency updated successfully'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};



// DELETE

exports.deleteCurrency = async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(

            'DELETE FROM currency WHERE currency_id = ?',

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