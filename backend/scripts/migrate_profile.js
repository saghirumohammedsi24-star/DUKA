const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Starting migration...');

        // Add columns to users table
        const queries = [
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(255) NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS dob DATE NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS gender ENUM('Male', 'Female', 'Other') NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10, 2) DEFAULT 0`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS loyalty_points INT DEFAULT 0`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('Active', 'Deactivated') DEFAULT 'Active'`,

            // Create addresses table
            `CREATE TABLE IF NOT EXISTS addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                is_default BOOLEAN DEFAULT FALSE,
                full_address TEXT NOT NULL,
                city_region_zone VARCHAR(255) NOT NULL,
                postal_code VARCHAR(20) NULL,
                country VARCHAR(100) NOT NULL,
                gps_location VARCHAR(255) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`
        ];

        for (const query of queries) {
            console.log(`Executing: ${query.substring(0, 50)}...`);
            await db.execute(query);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
