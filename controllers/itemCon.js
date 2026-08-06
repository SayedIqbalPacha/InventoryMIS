const db = require('../config/db');



// GET ALL

exports.getAllItems = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM item'
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

exports.getItem = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM item WHERE item_id = ?',
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({

                status: 'fail',

                message: 'Item not found'

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

exports.createItem = async (req, res) => {

    try {

        const {

            item_name,
            description,
            sell_price,
            cost_price,
            stock_quantity,
            unit_id,
            catagory_id

        } = req.body;

        const [result] = await db.query(

            `INSERT INTO item
            (item_name, description, sell_price, cost_price, stock_quantity, unit_id, catagory_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,

            [
                item_name,
                description,
                sell_price,
                cost_price,
                stock_quantity,
                unit_id,
                catagory_id
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
exports.updateItem = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            item_name,
            description,
            sell_price,
            cost_price,
            stock_quantity,
            unit_id,
            catagory_id

        } = req.body;

        await db.query(

            `UPDATE item
            SET
            item_name = ?,
            description = ?,
            sell_price = ?,
            cost_price = ?,
            stock_quantity = ?,
            unit_id = ?,
            catagory_id = ?
            WHERE item_id = ?`,

            [
                item_name,
                description,
                sell_price,
                cost_price,
                stock_quantity,
                unit_id,
                catagory_id,
                id
            ]

        );

        res.status(200).json({

            status: 'success',

            message: 'Item updated successfully'

        });

    } catch (err) {

        res.status(500).json({

            status: 'error',

            message: err.message

        });

    }

};



// DELETE

exports.deleteItem = async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(

            'DELETE FROM item WHERE item_id = ?',

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