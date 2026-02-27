-- Migration to add addresses table and missing user columns

USE duka_db;

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(255),
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS gender ENUM('male', 'female', 'other'),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS loyalty_points INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS status ENUM('active', 'suspended', 'inactive') DEFAULT 'active';

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_address TEXT NOT NULL,
  city_region_zone VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20),
  country VARCHAR(100),
  gps_location VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
