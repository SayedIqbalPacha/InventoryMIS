const express = require('express');

const userController = require('../controllers/userCon');

const {
    protect,
    restrictTo
} = require('../controllers/authCon');

const router = express.Router();


// GET ALL USERS
// user, manager, admin
router
    .route('/')
    .get(
        protect,
        restrictTo('user', 'manager', 'admin'),
        userController.getAllUsers
    )

    // CREATE USER
    // manager, admin
    .post(
        protect,
        restrictTo('manager', 'admin'),
        userController.createUser
    );


// GET ONE / UPDATE / DELETE
router
    .route('/:id')

    // GET ONE USER
    // user, manager, admin
    .get(
        protect,
        restrictTo('user', 'manager', 'admin'),
        userController.getUser
    )

    // UPDATE USER
    // manager, admin
    .patch(
        protect,
        restrictTo('manager', 'admin'),
        userController.updateUser
    )

    // DELETE USER
    // admin only
    .delete(
        protect,
        restrictTo('admin'),
        userController.deleteUser
    );


module.exports = router;