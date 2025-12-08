-- 1. Bật extension pgcrypto để dùng crypt() và gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tạo các bảng (đã thêm đầy đủ các cột bạn cần cho orders ngay từ đầu)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_details CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(15),
    address VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')) DEFAULT 'Pending',
    shipping_address VARCHAR(255),
    
    -- Các cột bạn yêu cầu thêm
    payment_method VARCHAR(50) DEFAULT 'COD', -- COD, CreditCard, BankTransfer, v.v.
    phone VARCHAR(20),
    full_name VARCHAR(100),
    notes TEXT
);

CREATE TABLE order_details (
    detail_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    price NUMERIC(12,2) NOT NULL
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method VARCHAR(20) CHECK (payment_method IN ('COD', 'CreditCard', 'BankTransfer')) DEFAULT 'COD',
    payment_status VARCHAR(20) CHECK (payment_status IN ('Pending', 'Completed', 'Failed')) DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo tài khoản admin mặc định
INSERT INTO users (username, password, email, full_name, role)
VALUES (
    'admin', 
    crypt('admin123', gen_salt('bf')), 
    'admin@shop.com', 
    'Quản trị viên', 
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- 4. Thêm danh mục
INSERT INTO categories (category_name, description) VALUES
('Desktop PC', 'Máy bộ để bàn nguyên bộ hoặc case lắp sẵn'),
('Laptop', 'Máy tính xách tay các hãng ASUS, Dell, HP, Acer, MSI...'),
('Monitor', 'Màn hình máy tính từ 24" đến 34", Full HD, 2K, 4K, gaming...'),
('Keyboard', 'Bàn phím cơ, bàn phím văn phòng, bàn phím gaming RGB'),
('Mouse', 'Chuột có dây và không dây, chuột gaming, chuột văn phòng'),
('Headset', 'Tai nghe chụp tai gaming, tai nghe có mic, tai nghe không dây')
ON CONFLICT DO NOTHING;

-- 5. Thêm sản phẩm mẫu (giá đã bao gồm VAT)
INSERT INTO products (category_id, product_name, description, price, stock, image) VALUES
(1, 'PC Gaming Ryzen 5 5600X + RTX 3060', 'Cấu hình mạnh chơi game 2K mượt', 25990000, 15, 'https://i.ibb.co.com/0jQ9g5K/pc-gaming.jpg'),
(1, 'PC Văn phòng Intel i3-12100', 'Phù hợp làm việc, học tập online', 8990000, 30, 'https://i.ibb.co.com/5Yg5Y5Y/office-pc.jpg'),
(2, 'Laptop ASUS TUF Gaming A15', 'Ryzen 7 + RTX 4060', 32990000, 8, 'https://i.ibb.co.com/3N5d9sN/asus-tuf.jpg'),
(2, 'Laptop Dell Inspiron 15 3520', 'i5-1235U, 16GB RAM', 15990000, 20, 'https://i.ibb.co.com/0jQ9g5K/dell-inspiron.jpg'),
(2, 'MacBook Air M2 13" Midnight', '8GB/256GB', 23990000, 12, 'https://i.ibb.co.com/5Yg5Y5Y/macbook-midnight.jpg'),
(3, 'Màn hình LG UltraGear 27" 2K 165Hz', 'Nano IPS 1ms', 7490000, 25, 'https://i.ibb.co.com/3N5d9sN/lg-ultragear.jpg'),
(3, 'Màn hình Samsung Odyssey G5 32"', 'Cong 144Hz', 6490000, 18, 'https://i.ibb.co.com/0jQ9g5K/samsung-odyssey.jpg'),
(4, 'Bàn phím Keychron K8 Pro', 'Hotswap RGB Bluetooth', 2490000, 40, 'https://i.ibb.co.com/5Yg5Y5Y/keychron-k8.jpg'),
(4, 'Bàn phím Logitech MX Keys Mini', 'Không dây đèn tự động', 2690000, 35, 'https://i.ibb.co.com/3N5d9sN/mx-keys-mini.jpg'),
(5, 'Chuột Logitech G Pro X Superlight 2', '63g trắng', 3990000, 22, 'https://i.ibb.co.com/0jQ9g5K/gpro-superlight2.jpg'),
(5, 'Chuột Razer DeathAdder V3 Pro', '63g trắng', 4190000, 15, 'https://i.ibb.co.com/5Yg5Y5Y/deathadder-v3-pro.jpg'),
(6, 'Tai nghe SteelSeries Arctis Nova 7', 'Wireless 38h pin', 4990000, 28, 'https://i.ibb.co.com/3N5d9sN/arctis-nova7.jpg'),
(6, 'Tai nghe HyperX Cloud II Wireless', '7.1 surround', 3290000, 50, 'https://i.ibb.co.com/0jQ9g5K/hyperx-cloud2.jpg')
ON CONFLICT DO NOTHING;  

-- Hoàn tất!
SELECT 'Database đã được tạo thành công với đầy đủ dữ liệu mẫu!' AS status;