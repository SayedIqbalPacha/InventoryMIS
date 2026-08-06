const dotenv = require('dotenv').config();

process.on('uncaughtException',err=>{
    console.log(' uncaughtException 💥 shutting down');
    console.log(err.name,err.message);
     process.exit(1);
  
});

const index = require('./index');

// this line take the data from the environmental variables
// dotenv.config({path:'./config.env'});

// console.log(process.env);
const port  = process.env.PORT || 3000 ;

const server = index.listen(port,()=>{
    console.log(`file runs on port ${port}`);
});

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('unhandled rejection 💥 shutting down');
    server.close(()=>{
        process.exit(1);
    });
});

