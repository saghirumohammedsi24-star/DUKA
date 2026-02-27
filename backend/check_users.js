const mysql = require('mysql2/promise');
require('dotenv').config();

const check = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'duka_db'
    });

    try {
        const [rows] = await connection.execute('SELECT id, name, email, role, password FROM users');
        console.log('--- Current Users ---');
        console.log(rows);
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

check();
