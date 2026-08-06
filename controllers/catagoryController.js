

const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET ALL
exports.getAllCategories = catchAsync(async (req, res,next) => {

        const [rows] = await db.query(
            'SELECT * FROM catagory'
        );

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: rows
        });

});



// GET ONE

exports.getCategory = catchAsync(async (req, res,next) => {


        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM catagory WHERE catagory_id = ?',
            [id]
        );
         
        console.log(rows);

        if (rows.length === 0) {

            // return res.status(404).json({
            //     status: 'fail',
            //     message: 'Category not found'
            //});
           return next(new AppError('no catagory found with that id',404));

        }

        res.status(200).json({

            status: 'success',

            data: rows[0]

        });
});



// CREATE   return the object

exports.createCategory = catchAsync(async (req, res,next) => {
        const { 
            catagory_name, 
            catagory_description 
        } = req.body;


        const [result] = await db.query(

            'INSERT INTO catagory(catagory_name, catagory_description) VALUES(?, ?)',

            [
                catagory_name,
                catagory_description
            ]

        );


        res.status(201).json({

            status: 'success',

            insertedId: result.insertId

        });

});



// UPDATE  return the object so we .affectedRows

exports.updateCategory = catchAsync(async (req, res,next) => {
        const id = req.params.id;

        const { 
            catagory_name, 
            catagory_description 
        } = req.body;


       const [result] =  await db.query(

            `UPDATE catagory 
             SET catagory_name=?, catagory_description=? 
             WHERE catagory_id=?`,

            [
                catagory_name,
                catagory_description,
                id
            ]

        );

        if(!result.affectedRows){

            return next(new AppError('catagory not founded',404));
        }

        res.status(200).json({

            status: 'success',

            message: 'Category updated successfully'

        });
});



// DELETE  return the object so we use .affectedRows
exports.deleteCategory = catchAsync(async (req, res,next) => {

        const id = req.params.id;


       const [result] =  await db.query(

            'DELETE FROM catagory WHERE catagory_id=?',

            [id]

        );

        if(!result.affectedRows){
            return next(new AppError('catagory not founded',404));

        }

        res.status(204).json({

            status: 'success',

            data: null

        });
});