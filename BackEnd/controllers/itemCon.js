// const db = require('../config/db');



// // GET ALL

// exports.getAllItems = async (req, res) => {

//     try {

//         const [rows] = await db.query(
//             'SELECT * FROM item'
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

// exports.getItem = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const [rows] = await db.query(
//             'SELECT * FROM item WHERE item_id = ?',
//             [id]
//         );

//         if (rows.length === 0) {

//             return res.status(404).json({

//                 status: 'fail',

//                 message: 'Item not found'

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

// exports.createItem = async (req, res) => {

//     try {

//         const {

//             item_name,
//             description,
//             sell_price,
//             cost_price,
//             stock_quantity,
//             unit_id,
//             catagory_id

//         } = req.body;

//         const [result] = await db.query(

//             `INSERT INTO item
//             (item_name, description, sell_price, cost_price, stock_quantity, unit_id, catagory_id)
//             VALUES (?, ?, ?, ?, ?, ?, ?)`,

//             [
//                 item_name,
//                 description,
//                 sell_price,
//                 cost_price,
//                 stock_quantity,
//                 unit_id,
//                 catagory_id
//             ]

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
// exports.updateItem = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const {

//             item_name,
//             description,
//             sell_price,
//             cost_price,
//             stock_quantity,
//             unit_id,
//             catagory_id

//         } = req.body;

//         await db.query(

//             `UPDATE item
//             SET
//             item_name = ?,
//             description = ?,
//             sell_price = ?,
//             cost_price = ?,
//             stock_quantity = ?,
//             unit_id = ?,
//             catagory_id = ?
//             WHERE item_id = ?`,

//             [
//                 item_name,
//                 description,
//                 sell_price,
//                 cost_price,
//                 stock_quantity,
//                 unit_id,
//                 catagory_id,
//                 id
//             ]

//         );

//         res.status(200).json({

//             status: 'success',

//             message: 'Item updated successfully'

//         });

//     } catch (err) {

//         res.status(500).json({

//             status: 'error',

//             message: err.message

//         });

//     }

// };



// // DELETE

// exports.deleteItem = async (req, res) => {

//     try {

//         const id = req.params.id;

//         await db.query(

//             'DELETE FROM item WHERE item_id = ?',

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

exports.getAllItems = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT * FROM item'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// GET ONE

exports.getItem = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return next(new AppError('Invalid item ID', 400));
    }

    const [rows] = await db.query(
        'SELECT * FROM item WHERE item_id = ?',
        [id]
    );

    if (rows.length === 0) {

        return next(new AppError('Item not found', 404));

    }

    res.status(200).json({

        status: 'success',

        data: rows[0]

    });

});


// CREATE

exports.createItem = catchAsync(async (req, res, next) => {

    const {

        item_name,
        description,
        sell_price,
        cost_price,
        stock_quantity,
        unit_id,
        catagory_id

    } = req.body;


    // CHECK REQUIRED FIELD

    if (item_name === undefined || item_name === null || item_name === '') {
        return next(new AppError('Please provide item name', 400));
    }

    if (sell_price === undefined || sell_price === null || sell_price === '') {
        return next(new AppError('Please provide sell price', 400));
    }


    // CHECK DATA TYPE

    if (typeof item_name !== 'string') {
        return next(new AppError('Item name must be a string', 400));
    }

    if (description !== undefined && typeof description !== 'string') {
        return next(new AppError('Description must be a string', 400));
    }

    if (isNaN(Number(sell_price))) {
        return next(new AppError('Sell price must be a number', 400));
    }

    if (cost_price !== undefined && cost_price !== null && cost_price !== '' && isNaN(Number(cost_price))) {
        return next(new AppError('Cost price must be a number', 400));
    }

    if (stock_quantity !== undefined && stock_quantity !== null && stock_quantity !== '' && isNaN(Number(stock_quantity))) {
        return next(new AppError('Stock quantity must be a number', 400));
    }

    if (unit_id !== undefined && unit_id !== null && !Number.isInteger(Number(unit_id))) {
        return next(new AppError('Unit id must be an integer', 400));
    }

    if (catagory_id !== undefined && catagory_id !== null && !Number.isInteger(Number(catagory_id))) {
        return next(new AppError('Catagory id must be an integer', 400));
    }


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

});


// UPDATE

exports.updateItem = catchAsync(async (req, res, next) => {

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


    // CHECK IF ITEM EXISTS

    const [item] = await db.query(
        'SELECT item_id FROM item WHERE item_id = ?',
        [id]
    );

    if (item.length === 0) {

        return next(new AppError('Item not founded', 404));

    }


    // CHECK REQUIRED FIELD

    if (item_name !== undefined && (item_name === null || item_name === '')) {
        return next(new AppError('Please provide item name', 400));
    }

    if (sell_price !== undefined && (sell_price === null || sell_price === '')) {
        return next(new AppError('Please provide sell price', 400));
    }


    // CHECK DATA TYPE

    if (item_name !== undefined && typeof item_name !== 'string') {
        return next(new AppError('Item name must be a string', 400));
    }

    if (description !== undefined && typeof description !== 'string') {
        return next(new AppError('Description must be a string', 400));
    }

    if (sell_price !== undefined && sell_price !== null && sell_price !== '' && isNaN(Number(sell_price))) {
        return next(new AppError('Sell price must be a number', 400));
    }

    if (cost_price !== undefined && cost_price !== null && cost_price !== '' && isNaN(Number(cost_price))) {
        return next(new AppError('Cost price must be a number', 400));
    }

    if (stock_quantity !== undefined && stock_quantity !== null && stock_quantity !== '' && isNaN(Number(stock_quantity))) {
        return next(new AppError('Stock quantity must be a number', 400));
    }

    if (unit_id !== undefined && unit_id !== null && !Number.isInteger(Number(unit_id))) {
        return next(new AppError('Unit id must be an integer', 400));
    }

    if (catagory_id !== undefined && catagory_id !== null && !Number.isInteger(Number(catagory_id))) {
        return next(new AppError('Catagory id must be an integer', 400));
    }


    const [result] = await db.query(

        `UPDATE item
        SET
        item_name = COALESCE(?, item_name),
        description = COALESCE(?, description),
        sell_price = COALESCE(?, sell_price),
        cost_price = COALESCE(?, cost_price),
        stock_quantity = COALESCE(?, stock_quantity),
        unit_id = COALESCE(?, unit_id),
        catagory_id = COALESCE(?, catagory_id)
        WHERE item_id = ?`,

        [
            // || = OR → uses the right side when the left side is falsy (0, '', false, null, undefined).
            // ?? = Nullish coalescing → uses the right side only when the left side is null or undefined.
            
            item_name ?? null,
            description ?? null,
            sell_price ?? null,
            cost_price ?? null,
            stock_quantity ?? null,
            unit_id ?? null,
            catagory_id ?? null,
            id
        ]

    );

    if (!result.affectedRows) {

        return next(new AppError('Item not founded', 404));

    }

    res.status(200).json({

        status: 'success',

        message: 'Item updated successfully'

    });

});


// DELETE

exports.deleteItem = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const [result] = await db.query(

        'DELETE FROM item WHERE item_id = ?',

        [id]

    );

    if (!result.affectedRows) {

        return next(new AppError('Item not founded', 404));

    }

    res.status(204).json({

        status: 'success',

        data: null

    });

});