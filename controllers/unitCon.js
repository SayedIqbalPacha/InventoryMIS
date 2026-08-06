const db = require('../config/db');

// Get All Units
exports.getAllUnits = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM unit'
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


// Get Single Unit
exports.getUnit = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM unit WHERE unit_id=?',
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


// Create Unit
exports.createUnit = async (req, res) => {

    try {

        const {
            unit_name,
            unit_symbol
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO unit
            (unit_name, unit_symbol)
            VALUES (?, ?)`,
            [
                unit_name,
                unit_symbol
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


// Update Unit
exports.updateUnit = async (req, res) => {

    try {

        const {
            unit_name,
            unit_symbol
        } = req.body;

        await db.query(
            `UPDATE unit
            SET unit_name=?,
                unit_symbol=?
            WHERE unit_id=?`,
            [
                unit_name,
                unit_symbol,
                req.params.id
            ]
        );

        res.status(200).json({
            status: 'success',
            message: 'Unit updated successfully.'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};


// Delete Unit
exports.deleteUnit = async (req, res) => {

    try {

        await db.query(
            'DELETE FROM unit WHERE unit_id=?',
            [req.params.id]
        );

        res.status(204).json({
            status: 'success',
            message: 'Unit deleted successfully.'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};