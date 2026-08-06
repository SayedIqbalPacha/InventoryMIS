const db = require('../config/db');

// Get All Sales
exports.getAllSales = async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM sales'
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


// Get Single Sale
exports.getSale = async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM sales WHERE sales_id = ?',
            [req.params.id]
        );

        res.status(200).json({
            status: 'success',
            data: rows
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }
};


// Create Sale
exports.createSale = async (req, res) => {

    try {

        const {
            customer_id,
            sales_date,
            currency_id
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO sales
            (customer_id,sales_date,currency_id)
            VALUES (?,?,?)`,
            [
                customer_id,
                sales_date,
                currency_id
            ]
        );

        res.status(201).json({
            status: 'success',
            insertId: result.insertId
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};


// Update Sale
exports.updateSale = async (req, res) => {

    try {

        const {
            customer_id,
            sales_date,
            currency_id
        } = req.body;

        await db.query(
            `UPDATE sales
            SET customer_id=?,
                sales_date=?,
                currency_id=?
            WHERE sales_id=?`,
            [
                customer_id,
                sales_date,
                currency_id,
                req.params.id
            ]
        );

        res.status(200).json({
            status: 'success',
            message: 'Sale updated successfully.'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};


// Delete Sale
exports.deleteSale = async (req, res) => {

    try {

        await db.query(
            'DELETE FROM sales WHERE sales_id=?',
            [req.params.id]
        );

        res.status(204).json({
            status: 'success',
            message: 'Sale deleted successfully.'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};