const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const bcrypt = require('bcryptjs');


// GET ALL USERS

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const [rows] = await db.query(
        `SELECT
            user_id,
            name,
            email,
            role,
            active
         FROM users`
    );

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows });

});




// GET ONE USER

exports.getUser = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const [rows] = await db.query(
        `SELECT
            user_id,
            name,
            email,
            role,
            active
         FROM users
         WHERE user_id = ?`,
        [id]
    );

    if (rows.length === 0) {
        return next(
            new AppError('No user found with that id',404));
         }
      res.status(200).json({
        status: 'success',
        data: rows[0]
    });

});

// CREATE USER

exports.createUser = catchAsync(async (req, res, next) => {

    const {
        name,
        email,
        password,
        passwordConfirm,
        role
    } = req.body;


    // REQUIRED FIELDS

    if (!name) {
        return next(
            new AppError('Please provide your name', 400)
        );
    }

    if (!email) {
        return next(
            new AppError('Please provide your email', 400)
        );
    }
     if (!password) {
        return next(
            new AppError('Please provide your password', 400)
        );
    }

    if (!passwordConfirm) {
        return next(
            new AppError('Please confirm your password', 400)
        );
    }


    // CHECK DATA TYPE

      if (typeof name !== 'string') {
            return next(new AppError('Name must be a string', 400));
        }

      if (typeof email !== 'string') {
            return next(new AppError('Email must be a string', 400));
        }

      if (typeof password !== 'string') {
            return next(new AppError('Password must be a string', 400));
        }

      if (typeof passwordConfirm !== 'string') {
            return next(new AppError('Password confirmation must be a string', 400));
        }

      if (role !== undefined && typeof role !== 'string') {
            return next(new AppError('Role must be a string', 400));
        }


    // PASSWORD CONFIRMATION

    if (password !== passwordConfirm) {
        return next(
            new AppError('Passwords are not the same!', 400)
        );
    }



   //EMAIL VALIDATION

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return next(new AppError('Please provide a valid email', 400));
    }

    // CHECK EMAIL

    const [existingUser] = await db.query(
        'SELECT user_id FROM users WHERE email = ?',
        [email]);

     if (existingUser.length > 0) {
        return next(new AppError('This email is already registered',400));
    }

     // CHECK ROLE
    const selectedRole = role || 'user';

    if (!['admin', 'manager', 'user'].includes(selectedRole)) {
        return next(new AppError('Invalid role', 400));
    }


    // MANAGER CANNOT CREATE ADMIN

    if (req.user.role === 'manager' && selectedRole === 'admin') {
        return next(
            new AppError('Manager cannot create an admin user',403));
    }


  // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 12);

    // CREATE USER

    const [result] = await db.query(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [
            name,
            email,
            hashedPassword,
            selectedRole
        ]
    );

    // SEND RESPONSE

    res.status(201).json({
        status: 'success',
        data: {
            user_id: result.insertId,
            name,
            email,
            role: selectedRole,
            active: true
        }});

});


// UPDATE USER

exports.updateUser = catchAsync(async (req, res, next) => {

    const id = req.params.id;

    const {
        name,
        email,
        password,
        passwordConfirm,
        role
    } = req.body;


    // CHECK DATA TYPE

    if (name !== undefined && typeof name !== 'string') {
        return next(new AppError('Name must be a string', 400));
    }

    if (email !== undefined && typeof email !== 'string') {
        return next(new AppError('Email must be a string', 400));
    }

    if (role !== undefined && typeof role !== 'string') {
        return next(new AppError('Role must be a string', 400));
    }

    // PASSWORD IS NOT UPDATED HERE

    if (password || passwordConfirm) {
        return next(new AppError('This route is not for updating passwords. Please use the password reset route.',400));
    }


    // CHECK REQUIRED FIELD

    if (!name && name !== undefined) {
        return next(new AppError('Please provide your name', 400));
    }

    if (!email && email !== undefined) {
        return next(new AppError('Please provide your email', 400));
    }

    // CHECK ROLE

    if (role &&!['admin', 'manager', 'user'].includes(role)) {
        return next(new AppError('Invalid role', 400));
    }


    // MANAGER CANNOT PROMOTE USER TO ADMIN

    if (req.user.role === 'manager' && role === 'admin' ) {
        return next(new AppError('Manager cannot assign the admin role',403));
    }


    //EMAIL VALIDATION

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return next(new AppError('Please provide a valid email', 400));
    }

    
    // CHECK EMAIL

    if (email) {

        const [existingUser] = await db.query(
            `SELECT user_id
             FROM users
             WHERE email = ?
             AND user_id != ?`,
            [email, id]
        );

        if (existingUser.length > 0) {
            
            return next(new AppError('This email is already registered',400));
        }
    }


    // UPDATE USER

    const [result] = await db.query(
        `UPDATE users
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             role = COALESCE(?, role)
         WHERE user_id = ?`,
         [
            name ?? null,
            email ?? null,
            role ?? null,
            id
         ]
    );


    // CHECK IF USER EXISTS

    if (result.affectedRows === 0) {
        return next(new AppError('No user found with that id', 404)
        );
    }


    // GET UPDATED USER

    const [rows] = await db.query(
        `SELECT
            user_id,
            name,
            email,
            role,
            active
         FROM users
         WHERE user_id = ?`,
        [id]
    );


    // SEND RESPONSE

    res.status(200).json({
        status: 'success',
        data: rows[0]
    });

});


// DELETE USER
// Soft delete: user is not removed from database

exports.deleteUser = catchAsync(async (req, res, next) => {

    const id = req.params.id;


    // DEACTIVATE USER

    const [result] = await db.query(
        `UPDATE users
         SET active = FALSE
         WHERE user_id = ?`,
        [id]
    );


    // CHECK IF USER EXISTS

    if (result.affectedRows === 0) {
        return next(new AppError('No user found with that id', 404));
    }


    // SEND RESPONSE

    res.status(200).json({
        status: 'success',
        message: 'User has been deactivated successfully'
    });

});