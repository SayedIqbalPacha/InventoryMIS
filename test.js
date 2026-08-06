require('dotenv').config();

const db = require('./config/db');

async function test() {
    try {
        const [rows] = await db.query('SELECT * FROM catagory ');
        console.log('Connected to MySQL!');
        console.log(rows);
    } catch (err) {
        console.error(err);
    }
}

test();