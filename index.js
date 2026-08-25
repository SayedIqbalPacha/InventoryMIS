const env =  require('dotenv')
env.config({ path: './config.env' });

const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorCon');
// here we need to use middleware for posting , which act bw req and res
app.use(express.json());
app.use(morgan('dev'));


// Import Routes
const catagoryRot = require('./routes/catagoryRot');
const customerRot = require('./routes/customerRot');
const currencyRot = require('./routes/currencyRot');
const customerPaymentRot = require('./routes/customerPaymentRot');
const itemRot = require('./routes/itemRot');
const purchaseRot = require('./routes/purchaseRot');    
const exchangeRateRot = require('./routes/exchangeRateRot');
const purchaseDetailsRot = require('./routes/purchaseDetailsRot');
const salesRot = require('./routes/salesRot');
const salesDetailsRot = require('./routes/salesDetailsRot');
const unitRot = require('./routes/unitRot');
const vendorRot = require('./routes/vendorRot');
const vendorPaymentRot = require('./routes/vendorPaymentRot');
const authRot = require('./routes/authRot');
const users = require('./routes/userRot');
// Use Routes3
app.use('/api/v1/catagories', catagoryRot);
app.use('/api/v1/customer', customerRot);
app.use('/api/v1/currency',currencyRot);
app.use('/api/v1/customerPayment',customerPaymentRot);
app.use('/api/v1/item', itemRot);
app.use('/api/v1/purchase',purchaseRot);
app.use('/api/v1/purchaseDetails',purchaseDetailsRot);
app.use('/api/v1/exchangeRate', exchangeRateRot);
app.use('/api/v1/sales',salesRot);
app.use('/api/v1/salesDetails',salesDetailsRot);
app.use('/api/v1/unit',unitRot);
app.use('/api/v1/vendor',vendorRot);
app.use('/api/v1/vendorPayment',vendorPaymentRot);
app.use('/api/v1/users',users);
app.use('/api/v1/auth',authRot);

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:"fail",
    //     message:`cant find the ${req.originalUrl} at this server`

    // });

    next(new AppError(`cant find ${req.originalUrl} at this server`,404))
});

app.use(globalErrorHandling);

module.exports = app;


