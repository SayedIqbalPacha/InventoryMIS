const AppError = require('../utils/appError');

const errDev = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
};

const errProd = (err,res) =>{
    if(err.isOperational){
       return res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    });
    }

    else{
        console.error('somthing went wrong',err);

        res.status(500).json({
            status:'fail',
            message:'somthing went wrong'
        });
    }
   
}


const handleDuplicateFieldDB = err => {
    return new AppError(
        'Duplicate value. This record already exists.',
        400
    );
};

const handleForeignKeyDB = err => {
    return new AppError(
        'Referenced record does not exist.',
        400
    );
};

const handleDeleteReferenceDB = err => {
    return new AppError(
        'Cannot delete this record because it is used by other records.',
        400
    );
};

const handleNullValueDB = err => {
    return new AppError(
        err.sqlMessage,
        400
    );
};

const handleWrongValueDB = err => {
    return new AppError(
        err.sqlMessage,
        400
    );
};

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'; 

    if(process.env.NODE_ENV === 'development'){
            errDev(err,res);
    } else if(process.env.NODE_ENV === 'production'){

        let error = err ;
        error.message = err.message;

        if (error.code === 'ER_DUP_ENTRY')
            error = handleDuplicateFieldDB(error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2')
            error = handleForeignKeyDB(error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2')
            error = handleDeleteReferenceDB(error);

        if (error.code === 'ER_BAD_NULL_ERROR')
            error = handleNullValueDB(error);

        if (error.code === 'ER_TRUNCATED_WRONG_VALUE')
            error = handleWrongValueDB(error);

        errProd(error, res);
    
    }

};

