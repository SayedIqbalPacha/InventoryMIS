

// const db = require('../config/db');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// // GET ALL
// exports.getAllCategories = catchAsync(async (req, res,next) => {

//         const [rows] = await db.query(
//             'SELECT * FROM catagory'
//         );

//         res.status(200).json({
//             status: 'success',
//             results: rows.length,
//             data: rows
//         });

// });



// // GET ONE

// exports.getCategory = catchAsync(async (req, res,next) => {


//         const id = req.params.id;

//         const [rows] = await db.query(
//             'SELECT * FROM catagory WHERE catagory_id = ?',
//             [id]
//         );
         
//         // console.log(rows);

//         if (rows.length === 0) {

            
//            return next(new AppError('no catagory found with that id',404));

//         }

//         res.status(200).json({

//             status: 'success',

//             data: rows[0]

//         });
// });



// // CREATE   return the object

// exports.createCategory = catchAsync(async (req, res,next) => {
//         const { 
//             catagory_name, 
//             catagory_description 
//         } = req.body;


//         const [result] = await db.query(

//             'INSERT INTO catagory(catagory_name, catagory_description) VALUES(?, ?)',

//             [
//                 catagory_name,
//                 catagory_description
//             ]

//         );
//         res.status(201).json({

//             status: 'success',

//             insertedId: result.insertId

//         });

// });



// // UPDATE  return the object so we .affectedRows

// exports.updateCategory = catchAsync(async (req, res,next) => {
//         const id = req.params.id;

//         const { 
//             catagory_name, 
//             catagory_description 
//         } = req.body;


//        const [result] =  await db.query(

//             `UPDATE catagory 
//              SET catagory_name=?, catagory_description=? 
//              WHERE catagory_id=?`,
//             [
//                 catagory_name,
//                 catagory_description,
//                 id
//             ]

//         );

//         if(!result.affectedRows){

//             return next(new AppError('catagory not founded',404));
//         }

//         res.status(200).json({

//             status: 'success',

//             message: 'Category updated successfully'

//         });
// });



// // DELETE  return the object so we use .affectedRows
// exports.deleteCategory = catchAsync(async (req, res,next) => {

//         const id = req.params.id;


//        const [result] =  await db.query(

//             'DELETE FROM catagory WHERE catagory_id=?',

//             [id]

//         );

//         if(!result.affectedRows){
//             return next(new AppError('catagory not founded',404));

//         }

//         res.status(204).json({

//             status: 'success',

//             data: null

//         });
// });


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
         
        // console.log(rows);

        if (rows.length === 0) {

            
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


        // CHECK REQUIRED FIELD

        if (!catagory_name) {
            return next(new AppError('Please provide category name', 400));
        }
        
        if (typeof catagory_name !== 'string') {
            return next(new AppError('Category name must be a string', 400));
        }

        // CHECK IF CATEGORY NAME ALREADY EXISTS
        const [existingCategory] = await db.query(
            'SELECT catagory_id FROM catagory WHERE catagory_name = ?',
            [catagory_name]
        );

        if (existingCategory.length > 0) {
            return next(new AppError('This category name is already registered', 400));
        }


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


        // CHECK IF CATEGORY EXISTS

        const [category] = await db.query(
            'SELECT catagory_id, catagory_name, catagory_description FROM catagory WHERE catagory_id = ?',
            [id]
        );

        if (category.length === 0) {

            return next(new AppError('catagory not founded',404));

        }


        // CHECK REQUIRED FIELD

        //customer_id !== undefined  this means check if its provided by user
        if (!catagory_name && catagory_name !== undefined) {
            return next(new AppError('Please provide category name', 400));
        }


        // CHECK IF CATEGORY NAME ALREADY EXISTS

        if (catagory_name) {

            const [existingCategory] = await db.query(
                `SELECT catagory_id
                 FROM catagory
                 WHERE catagory_name = ?
                 AND catagory_id != ?`,
                [catagory_name, id]
            );

            if (existingCategory.length > 0) {
                return next(
                    new AppError('This category name is already registered', 400)
                );
            }
        }


        const [result] =  await db.query(

            `UPDATE catagory 
             SET catagory_name = COALESCE(?, catagory_name),
                 catagory_description = COALESCE(?, catagory_description)
             WHERE catagory_id = ?`,
            [
                //|| null is mainly used to turn a missing JavaScript value into NULL, which lets COALESCE() keep the existing value.
                catagory_name || null,
                catagory_description || null,
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