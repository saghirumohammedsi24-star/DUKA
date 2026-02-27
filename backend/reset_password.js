const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const reset = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'duka_db'
    });

    try {
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await connection.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, 'admin@example.com']
        );

        console.log('✅ Password reset to: admin123');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

reset();
