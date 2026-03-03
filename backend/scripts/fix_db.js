const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixDb = async () => {
    console.log('--- DUKA Database Fixer ---');

    // Connect without a specific database first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        // 1. Create Database
        console.log('Creating database "duka_db"...');
        await connection.query('CREATE DATABASE IF NOT EXISTS duka_db');
        await connection.query('USE duka_db');
        console.log('✅ Database ready.');

        // 2. Run Schema
        console.log('Creating tables...');
        const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split schema into individual queries (basic splitting by ;)
        const queries = schemaSql.split(';').filter(q => q.trim() !== '');
        for (let query of queries) {
            await connection.query(query);
        }
        console.log('✅ Tables created successfully.');

        // 3. Seed Admin User
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.execute(
            'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin User', 'admin@example.com', hashedPassword, 'admin']
        );
        console.log('✅ Admin credentials created.');

        // 4. Seed Products
        console.log('Adding sample products...');
        const products = [
            ['iPhone 15 Pro', 'Latest Apple smartphone with titanium design.', 999.99, 'Electronics', 50, 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400'],
            ['MacBook Air M3', 'Incredibly thin and fast laptop.', 1099.00, 'Electronics', 30, 'https://images.unsplash.com/photo-1517336714460-453b5a41ff53?w=400'],
            ['Sony WH-1000XM5', 'Industry leading noise canceling headphones.', 348.00, 'Audio', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
            ['Nike Air Max', 'Classic sneakers for everyday comfort.', 120.00, 'Fashion', 80, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
        ];

        for (const p of products) {
            await connection.execute(
                'INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                p
            );
        }
        console.log('✅ Sample products added.');

        console.log('\n🚀 ALL DONE! You can now log in.');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error fixing database:', err.message);
        process.exit(1);
    }
};

fixDb();
