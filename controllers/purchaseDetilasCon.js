
const db = require('../config/db');

// Get All Purchase Details
exports.getAllPurchaseDetails = async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM purchase_details'
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


// Get Single Purchase Detail
exports.getPurchaseDetail = async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM purchase_details WHERE detail_id = ?',
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


// Create Purchase Detail
exports.createPurchaseDetail = async (req, res) => {
    try {

        const {
            purchase_id,
            item_id,
            quantity,
            unit_price
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO purchase_details
            (purchase_id,item_id,quantity,unit_price)
            VALUES (?,?,?,?)`,
            [
                purchase_id,
                item_id,
                quantity,
                unit_price
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


// Update Purchase Detail
exports.updatePurchaseDetail = async (req, res) => {
    try {

        const {
            purchase_id,
            item_id,
            quantity,
            unit_price
        } = req.body;

        await db.query(
            `UPDATE purchase_details
            SET purchase_id=?,
                item_id=?,
                quantity=?,
                unit_price=?
            WHERE detail_id=?`,
            [
                purchase_id,
                item_id,
                quantity,
                unit_price,
                req.params.id
            ]
        );

        res.status(200).json({
            status: 'success',
            message: 'Purchase detail updated successfully.'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }
};


// Delete Purchase Detail
exports.deletePurchaseDetail = async (req, res) => {
    try {

        await db.query(
            'DELETE FROM purchase_details WHERE detail_id=?',
            [req.params.id]
        );

        res.status(200).json({
            status: 'success',
            message: 'Purchase detail deleted successfully.'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }
};