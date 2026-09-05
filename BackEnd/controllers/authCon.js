const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


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
    `SELECT
        user_id,
        name,
        email,
        password,
        role,
        password_changed_at,
        active
     FROM users
     WHERE email = ?`,
    [email]
);


    if (rows.length === 0) {
        return next(new AppError('User does not exist', 401));
    }

    //take the first row or object of the array which match to the email since email is unique so the first matching email is the correct email
    //if we dont write it then it will be like this : rows[0].password instead of user.password
    const user = rows[0];

    //check if user is active or not
    if (!user.active) {
    return next(
        new AppError('Your account is inactive. Please contact support.', 401));
    }

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
    token,
    
    data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
    }
});

});






//route protection 
exports.protect = catchAsync(async (req, res, next) => {

    // 1. GET TOKEN

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next( new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const token = authHeader.split(' ')[1];


    // 2. VERIFY TOKEN 
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );


    // 3. CHECK IF USER STILL EXISTS

    const [rows] = await db.query(
        'SELECT user_id, name, email, password, role, password_changed_at, active FROM users WHERE user_id = ?',
        [decoded.id]
    );

    if (rows.length === 0) {
        return next(new AppError('The user belonging to this token no longer exists.',401 ));
    }

    const user = rows[0];
  // 4. CHECK IF USER IS ACTIVE

    if (!user.active) {
        return next(
            new AppError('Your account is inactive. Please contact support.', 401));
    }

    // 4. CHECK IF PASSWORD WAS CHANGED AFTER TOKEN WAS ISSUED

    if (user.password_changed_at && new Date(user.password_changed_at).getTime() > decoded.iat * 1000
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

//(...roles) is called rest which take all values and store them as array
exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role))
         { return next(new AppError('You do not have permission to perform this action',403));}
      
    
next();
 } };

    

    // FORGOT PASSWORD

exports.forgotPassword = catchAsync(async (req, res, next) => {

    const { email } = req.body;


    // CHECK EMAIL

    if (!email) {
        return next(
            new AppError('Please provide your email', 400)
        );
    }


    // 1) GET USER BY EMAIL

    const [rows] = await db.query(
        'SELECT user_id, name, email, role FROM users WHERE email = ?',
        [email]
    );


    // CHECK IF USER EXISTS

    if (rows.length === 0) {
        return next(
            new AppError('There is no user with that email address.',404)
        );
    }


    const user = rows[0];

      
    // 2) CREATE RANDOM RESET TOKEN
    const resetToken = crypto.randomBytes(32).toString('hex');


    // HASH RESET TOKEN
    const hashedResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');



    // CREATE EXPIRATION TIME
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);


    // SAVE RESET INFORMATION
    await db.query(
        `UPDATE users
         SET password_reset_token = ?,
             password_reset_expires = ?
         WHERE user_id = ?`,
        [
            hashedResetToken,
            resetExpires,
            user.user_id
        ]
    );



// 3) send it users email the generated token
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
// req.protocol  → http
// req.get('host') → localhost:9000
// resetToken → your random token


// we create transporter to send the token or anything email 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});


await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: 'Your Password Reset Token',
    text: `You requested a password reset. Please use the following link to reset your password:\n\n${resetURL}\n\nThis link is valid for 10 minutes.`
});

        res.status(200).json({
            status: 'success',
            message: 'Reset token sent to email'
        });
    });


// RESET PASSWORD

exports.resetPassword = catchAsync(async (req, res, next) => {

    // GET TOKEN FROM URL

    const token = req.params.token;


    // HASH THE TOKEN

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');


    // FIND USER BY RESET TOKEN
const [rows] = await db.query(
    `SELECT
        user_id,
        name,
        email,
        role,
        password_reset_expires
     FROM users
     WHERE password_reset_token = ?
     AND password_reset_expires > NOW()`,
    [hashedToken]
);

    // CHECK IF TOKEN EXISTS

    if (rows.length === 0) {
        return next(
            new AppError(
                'Token is invalid or has expired',
                400
            )
        );
    }


    const user = rows[0];



    // GET NEW PASSWORD

    const {
        password,
        passwordConfirm
    } = req.body;


    // REQUIRED FIELDS

    if (!password) {
        return next( new AppError('Please provide your new password', 400));}

    if (!passwordConfirm) {
        return next(new AppError('Please confirm your new password', 400));}


    // PASSWORD CONFIRMATION

    if (password !== passwordConfirm) {
        return next(
            new AppError('Passwords are not the same!', 400)
        );
    }


    // HASH NEW PASSWORD

    const hashedPassword = await bcrypt.hash(password, 12);


    // UPDATE USER

    await db.query(
        `UPDATE users
         SET password = ?,
             password_changed_at = NOW(),
             password_reset_token = NULL,
             password_reset_expires = NULL
         WHERE user_id = ?`,
        [
            hashedPassword,
            user.user_id
        ]
    );

      const Newtoken = signToken(user.user_id);

res.status(200).json({
    status: 'success',
    Newtoken
});
    });


   
// UPDATE CURRENT USER
exports.updateMe = catchAsync(async (req, res, next) => {

    // 1) CHECK IF USER IS TRYING TO UPDATE PASSWORD

    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password updates. Please use /updateMyPassword.', 400 ));
    }


    // 2) CHECK IF USER IS TRYING TO UPDATE ROLE

    if (req.body.role) {
        return next( new AppError('You cannot update your role.',403 ));
    }


    // 3) GET DATA FROM REQUEST

    const { name, email } = req.body;

    // 4) CHECK IF NAME OR EMAIL WAS PROVIDED

    if (!name && !email) {
        return next(
            new AppError(
                'Please provide name or email to update',
                400
            )
        );
    }


    // 5) CHECK IF EMAIL ALREADY EXISTS

    if (email) {
        const [rows] = await db.query(
            `SELECT user_id
             FROM users
             WHERE email = ?
             AND user_id != ?`,
            [email, req.user.user_id]
        );

        if (rows.length > 0) {
            return next(new AppError('This email is already registered', 400));
         }
    }


    // 6) UPDATE CURRENT USER

    await db.query(
        `UPDATE users
         SET name = COALESCE(?, name),
             email = COALESCE(?, email)
         WHERE user_id = ?`,
        [
            name || null,
            email || null,
            req.user.user_id
        ]
    );


    // 7) GET UPDATED USER

    const [updatedRows] = await db.query(
        `SELECT user_id, name, email, role
         FROM users
         WHERE user_id = ?`,
        [req.user.user_id]
    );


    // 8) SEND RESPONSE

    res.status(200).json({
        status: 'success',
        data: {user: updatedRows[0]}
    });

});

// DELETE CURRENT USER
// Soft delete: user is not removed from database

exports.deleteMe = catchAsync(async (req, res, next) => {

    await db.query(
        `UPDATE users
         SET active = FALSE
         WHERE user_id = ?`,
        [req.user.user_id]
    );


    res.status(204).json({
        status: 'success',
        data: null
    });

});// DELETE CURRENT USER
// Soft delete: user is not removed from database

exports.deleteMe = catchAsync(async (req, res, next) => {

    await db.query(
        `UPDATE users
         SET active = FALSE
         WHERE user_id = ?`,
        [req.user.user_id]
    );


    res.status(204).json({
        status: 'success',
        data: null
    });

});

// DELETE CURRENT USER
// Soft delete: user is not removed from database

exports.deleteMe = catchAsync(async (req, res, next) => {

    // 1) DEACTIVATE CURRENT USER

    const [result] = await db.query(
        `UPDATE users
         SET active = FALSE
         WHERE user_id = ?`,
        [req.user.user_id]
    );


    // 2) CHECK IF USER WAS ACTUALLY UPDATED

    if (result.affectedRows === 0) {
        return next(new AppError('User could not be deactivated',404 ));
    }


    // 3) SEND RESPONSE

    res.status(200).json({status: 'success',message: 'Your account has been deactivated successfully' });

});