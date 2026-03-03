-- Migration V3: Intelligent Evolution for DUKA
USE duka_db;

-- 1. Product Enhancements
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS brand VARCHAR(100),
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS price_depends_on_attribute BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS status ENUM('Active', 'Draft', 'Out of Stock', 'Archived') DEFAULT 'Active';

-- 2. Attribute Categorization
ALTER TABLE attributes 
ADD COLUMN IF NOT EXISTS type ENUM('Variation', 'Informational') DEFAULT 'Variation';

ALTER TABLE attribute_options 
ADD COLUMN IF NOT EXISTS price_modifier DECIMAL(10, 2) DEFAULT 0.00;

-- 3. Order Engine Upgrades
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_notes TEXT,
ADD COLUMN IF NOT EXISTS payment_status ENUM('Unpaid', 'Paid', 'Partial', 'Refunded') DEFAULT 'Unpaid';

-- Table for Status History (Timeline)
CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 4. Customer Engagement
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- 5. Address Book Expansion (Ensuring flexibility for multiple addresses)
-- Addresses table exists, but we can add labels
ALTER TABLE addresses 
ADD COLUMN IF NOT EXISTS label VARCHAR(50) DEFAULT 'Home'; -- 'Home', 'Office', etc.

-- 6. Activity Logs for Security
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
