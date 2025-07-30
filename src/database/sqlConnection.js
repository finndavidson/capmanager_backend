import mysql from 'mysql';

const db = mysql.createConnection({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'nfl'
})

export default db;