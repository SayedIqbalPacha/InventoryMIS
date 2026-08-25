const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// jwt.sign(payload, secret, options)
const signToken = id => {
    return jwt.sign(
        { id: id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

// SIGN UP

exports.signup = catchAsync(async (req, res, next) => {

    const {
        name,
        email,
        password,
        passwordConfirm
    } = req.body;


    // REQUIRED FIELDS

    if (!name) {
        return next(new AppError('Please provide your name', 400));
    }

    if (!email) {
        return next(new AppError('Please provide your email', 400));
    }

    if (!password) {
        return next(new AppError('Please provide your password', 400));
    }

    if (!passwordConfirm) {
        return next(new AppError('Please confirm your password', 400));
    }


    // PASSWORD CONFIRMATION

    if (password !== passwordConfirm) {
        return next(new AppError('Passwords are not the same!', 400));
    }


    // CHECK IF EMAIL ALREADY EXISTS

    const [existingUser] = await db.query(
        'SELECT user_id FROM users WHERE email = ?',
        [email]
    );

    if (existingUser.length > 0) {
        return next(new AppError('This email is already registered', 400));
    }


    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 12);


    // CREATE USER

    const [result] = await db.query(

        'INSERT INTO users(name, email, password, role) VALUES(?, ?, ?, ?)',

        [
            name,
            email,
            hashedPassword,
            'user'
        ]

    );


    // CREATE TOKEN

    const token = signToken(result.insertId);


    // SEND RESPONSE

    res.status(201).json({
        status: 'success',
        token,
        insertedId: result.insertId
    });

});



// LOGIN
exports.login = catchAsync(async (req, res, next) => {

    const {
        email,
        password
    } = req.body;


    // REQUIRED FIELDS

    if (!email) {
        return next(new AppError('Please provide your email', 400));
    }

    if (!password) {
        return next(new AppError('Please provide your password', 400));
    }


    // CHECK IF USER EXISTS
    const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );


    if (rows.length === 0) {
        return next(new AppError('User does not exist', 401));
    }

    //take the first row or object of the array which match to the email since email is unique so the first matching email is the correct email
    //if we dont write it then it will be like this : rows[0].password instead of user.password
    const user = rows[0];

    // CHECK PASSWORD

    const correctPassword = await bcrypt.compare(
        password,
        user.password
    );


    if (!correctPassword) {
        return next(new AppError('Incorrect email or password', 401));
    }


    // CREATE TOKEN

    const token = signToken(user.user_id);

    // SEND RESPONSE

    res.status(200).json({
        status: 'success',
        token
    });

});






//route protection 
exports.protect = catchAsync(async (req, res, next) => {

    // 1. GET TOKEN

    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401
            )
        );
    }

    const token = authHeader.split(' ')[1];


    // 2. VERIFY TOKEN 
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );


    // 3. CHECK IF USER STILL EXISTS

    const [rows] = await db.query(
        'SELECT user_id, name, email, password, role, password_changed_at FROM users WHERE user_id = ?',
        [decoded.id]
    );

    if (rows.length === 0) {
        return next(
            new AppError(
                'The user belonging to this token no longer exists.',
                401
            )
        );
    }

    const user = rows[0];


    // 4. CHECK IF PASSWORD WAS CHANGED AFTER TOKEN WAS ISSUED

    if (
        user.password_changed_at &&
        new Date(user.password_changed_at).getTime() > decoded.iat * 1000
        //iat: issued at which is in seconds and getTime take the changed time from  db at the ms format
    ) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401
            )
        );
    }


    // 5. GRANT our user object to the req which has(body,params,header) so then next() know that who made the request

    req.user = user;

    next();
});



// this is authorization part 
//... is called rest which take all values and store them as array
exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return next(new AppError('You do not have permission to perform this action',403));
        }
        next();
    }};

    