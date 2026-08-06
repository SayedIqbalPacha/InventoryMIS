const db = require('../config/db');

// GET ALL
exports.getAllCustomers = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM customer'
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

exports.getCustomer = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM customer WHERE customer_id = ?',
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                status: 'fail',
                message: 'Customer not found'
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

exports.createCustomer = async (req, res) => {

    try {

        const {
            customer_name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        const [result] = await db.query(

            `INSERT INTO customer
            (customer_name, contact_person, phone, email, address)
            VALUES (?, ?, ?, ?, ?)`,

            [
                customer_name,
                contact_person,
                phone,
                email,
                address
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

exports.updateCustomer = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            customer_name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        await db.query(

            `UPDATE customer
            SET
            customer_name = ?,
            contact_person = ?,
            phone = ?,
            email = ?,
            address = ?
            WHERE customer_id = ?`,

            [
                customer_name,
                contact_person,
                phone,
                email,
                address,
                id
            ]

        );

        res.status(200).json({
            status: 'success',
            message: 'Customer updated successfully'
        });

    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }

};



// DELETE

exports.deleteCustomer = async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(
            'DELETE FROM customer WHERE customer_id = ?',
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