const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


// GET ALL USERS

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        'SELECT user_id, name, email, role FROM users'
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows
    });

});


// GET ONE USER

exports.getUser = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const [rows] = await db.query(
        'SELECT user_id, name, email, role FROM users WHERE user_id = ?',
        [id]
    );

    if (rows.length === 0) {
        return next(new AppError('No user found with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: rows[0]
    });

});