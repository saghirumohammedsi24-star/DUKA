const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('Seeding database...');

        // 1. Create Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.execute(
            'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin User', 'admin@example.com', hashedPassword, 'admin']
        );
        console.log('✅ Admin user created: admin@example.com / admin123');

        // 2. Create Sample Products
        const products = [
            ['iPhone 15 Pro', 'Latest Apple smartphone with titanium design.', 999.99, 'Electronics', 50, 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400'],
            ['MacBook Air M3', 'Incredibly thin and fast laptop.', 1099.00, 'Electronics', 30, 'https://images.unsplash.com/photo-1517336714460-453b5a41ff53?w=400'],
            ['Sony WH-1000XM5', 'Industry leading noise canceling headphones.', 348.00, 'Audio', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
            ['Nike Air Max', 'Classic sneakers for everyday comfort.', 120.00, 'Fashion', 80, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
        ];

        for (const p of products) {
            await db.execute(
                'INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                p
            );
        }
        console.log('✅ Sample products added.');

        console.log('Seeding complete! You can now log in.');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

seed();
