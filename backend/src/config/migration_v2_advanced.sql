-- Migration V2: Advanced Architecture for DUKA

USE duka_db;

-- 1. Attributes Support
CREATE TABLE IF NOT EXISTS attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'Size', 'Color', 'Material'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attribute_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attribute_id INT NOT NULL,
  value VARCHAR(255) NOT NULL, -- e.g., 'S', 'Red'
  media_url VARCHAR(255), -- Optional image for this specific attribute
  media_type ENUM('image', 'video', 'text') DEFAULT 'text',
  FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
);

-- Mapping products to attributes
CREATE TABLE IF NOT EXISTS product_attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  attribute_option_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_option_id) REFERENCES attribute_options(id) ON DELETE CASCADE,
  UNIQUE KEY unique_product_attr (product_id, attribute_option_id)
);

-- 2. Extended Product Media
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS automatic_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS gallery_urls JSON; -- Storing array of images

-- 3. Advanced Order Tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number VARCHAR(50) UNIQUE, -- ORD-YYYY-00001
ADD COLUMN IF NOT EXISTS delivery_type ENUM('Delivery', 'Pickup') DEFAULT 'Pickup',
ADD COLUMN IF NOT EXISTS delivery_location TEXT,
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
MODIFY COLUMN status ENUM('Pending', 'Payment Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Completed', 'Cancelled') DEFAULT 'Pending';

ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS selected_attributes JSON; -- e.g., {"Color": "Red", "Size": "M"}

-- 4. Settings Module
CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` TEXT,
  `category` ENUM('WhatsApp', 'Email', 'Order', 'General') DEFAULT 'General',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Default Settings
INSERT IGNORE INTO settings (`key`, `value`, `category`) VALUES 
('whatsapp_number', '+255000000000', 'WhatsApp'),
('admin_email', 'admin@example.com', 'Email'),
('smtp_host', 'smtp.gmail.com', 'Email'),
('smtp_port', '587', 'Email'),
('order_prefix', 'ORD', 'Order'),
('business_name', 'DUKA Online Mall', 'General'),
('currency', 'TZS', 'General'),
('pdf_footer', 'Shukrani kwa kuchagua DUKA!', 'General');
