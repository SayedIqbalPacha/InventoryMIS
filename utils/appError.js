class AppError extends Error{
    constructor(message,statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        //this mean the object and the this.constructor mean the class of that obj
        Error.captureStackTrace(this,this.constructor);
    }

}

module.exports = AppError;