const db = require('../config/db');

// Get All Vendors
exports.getAllVendors = async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM vendor'
        );

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                vendors: rows
            }
        });

    } catch (err) {

        res.status(500).json({
            status: 'fail',
            message: err.message
        });

    }
};


// Get Single Vendor
exports.getVendor = async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM vendor WHERE vendor_id = ?',
            [req.params.id]
        );

        res.status(200).json({
            status: 'success',
            data: {
                vendor: rows
            }
        });

    } catch (err) {

        res.status(500).json({
            status: 'fail',
            message: err.message
        });

    }
};


// Create Vendor
exports.createVendor = async (req, res) => {
    try {

        const {
            vendor_name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO vendor
            (vendor_name, contact_person, phone, email, address)
            VALUES (?, ?, ?, ?, ?)`,
            [
                vendor_name,
                contact_person,
                phone,
                email,
                address
            ]
        );

        res.status(201).json({
            status: 'success',
            data: {
                vendor_id: result.insertId
            }
        });

    } catch (err) {

        res.status(500).json({
            status: 'fail',
            message: err.message
        });

    }
};


// Update Vendor
exports.updateVendor = async (req, res) => {
    try {

        const {
            vendor_name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        await db.query(
            `UPDATE vendor
            SET vendor_name = ?,
                contact_person = ?,
                phone = ?,
                email = ?,
                address = ?
            WHERE vendor_id = ?`,
            [
                vendor_name,
                contact_person,
                phone,
                email,
                address,
                req.params.id
            ]
        );

        res.status(200).json({
            status: 'success',
            message: 'Vendor updated successfully.'
        });

    } catch (err) {

        res.status(500).json({
            status: 'fail',
            message: err.message
        });

    }
};


// Delete Vendor
exports.deleteVendor = async (req, res) => {
    try {

        await db.query(
            'DELETE FROM vendor WHERE vendor_id = ?',
            [req.params.id]
        );

        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (err) {

        res.status(500).json({
            status: 'fail',
            message: err.message
        });

    }
};