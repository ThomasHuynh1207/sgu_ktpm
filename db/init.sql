CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
    price NUMERIC(10,2) NOT NULL,
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
    total_amount NUMERIC(10,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')) DEFAULT 'Pending',
    shipping_address VARCHAR(255)
);

CREATE TABLE order_details (
    detail_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT,
    price NUMERIC(10,2)
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
    order_id INT REFERENCES orders(order_id),
    payment_method VARCHAR(20) CHECK (payment_method IN ('COD', 'CreditCard', 'BankTransfer')) DEFAULT 'COD',
    payment_status VARCHAR(20) CHECK (payment_status IN ('Pending', 'Completed', 'Failed')) DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', crypt('admin123', gen_salt('bf')), 'admin@shop.com', 'Quản trị viên', 'admin');

-- 1. Thêm danh mục sản phẩm
INSERT INTO categories (category_name, description) VALUES
('Desktop PC', 'Máy bộ để bàn nguyên bộ hoặc case lắp sẵn'),
('Laptop', 'Máy tính xách tay các hãng ASUS, Dell, HP, Acer, MSI...'),
('Monitor', 'Màn hình máy tính từ 24" đến 34", Full HD, 2K, 4K, gaming...'),
('Keyboard', 'Bàn phím cơ, bàn phím văn phòng, bàn phím gaming RGB'),
('Mouse', 'Chuột có dây và không dây, chuột gaming, chuột văn phòng'),
('Headset', 'Tai nghe chụp tai gaming, tai nghe có mic, tai nghe không dây');

-- 2. Thêm một vài sản phẩm mẫu (giá đã bao gồm VAT)
INSERT INTO products (category_id, product_name, description, price, stock, image) VALUES
(1, 'PC Gaming Ryzen 5 5600X + RTX 3060', 'Cấu hình mạnh chơi game 2K mượt, tản nhiệt nước', 25990000, 15, 'https://gearvn.com/wp-content/uploads/2022/12/pc-gvn-amd-r5-5600x-vga-rtx-3060-1.jpg'),
(1, 'PC Văn phòng Intel i3-12100', 'Phù hợp làm việc, học tập online, xem phim', 8990000, 30, 'https://www.anphatpc.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/p/c/pcap-office-iso-tcvn-4-intel-i3-12100-16gb-512gb-window-11-pro-ban-quyen-1.jpg'),
(2, 'Laptop ASUS TUF Gaming A15 (2024)', 'Ryzen 7 7735HS + RTX 4060 140W', 32990000, 8, 'https://www.asus.com/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-a15-2024/img/overview/overview_photo_1.jpg'),
(2, 'Laptop Dell Inspiron 15 3520', 'i5-1235U, 16GB RAM, 512GB SSD', 15990000, 20, 'https://hoanghamobile.com/upload/product/dell-inspiron-15-3520-71027003-1-400x400.jpg'),
(2, 'MacBook Air M2 13" 2022', '8GB/256GB - Midnight', 23990000, 12, 'https://www.apple.com/v/macbook-air-m2/f/images/overview/hero_midnight__f2x0b1q3e5g6_large.jpg'),
(3, 'Màn hình LG UltraGear 27GP850-B 27" 2K 165Hz', 'Nano IPS, 1ms, HDR10', 7490000, 25, 'https://www.lg.com/dam/jcr:0b0e0b0e-0b0e-4b0e-8b0e-0b0e0b0e0b0e/27GP850-B.png'),
(3, 'Màn hình Samsung Odyssey G5 32" Cong 144Hz', 'VA, 2K', 6490000, 18, 'https://images.samsung.com/is/image/samsung/p6/global/monitor/gaming/odyssey-g5-g55c/LS32CG552EEXXV-frontblack-524928?$FB_TYPE_A_JPG$'),
(4, 'Bàn phím cơ Keychron K8 Pro QMK/VIA', 'Hotswap, RGB, Bluetooth', 2490000, 40, 'https://www.keychron.com/cdn/shop/files/K8Pro_Q1_QMK_VIA_Wireless_Custom_Mechanical_Keyboard_1_2048x.jpg?v=1689277462'),
(4, 'Bàn phím Logitech MX Keys Mini', 'Không dây, đèn nền tự động', 2690000, 35, 'https://www.logitech.com/content/dam/logitech/en/mx-keys-mini/products/mx-keys-mini-mice-keyboards-mice-keyboards.0.color.1.jpg'),
(5, 'Chuột Logitech G Pro X Superlight 2', 'Trắng, 63g, 32K DPI', 3990000, 22, 'https://resource.logitechg.com/content/dam/logitech/en/products/gaming-mice/pro-x2-superlight-wireless-gaming-mouse/gallery/pro-x2-superlight-wireless-gaming-mouse-white.png'),
(5, 'Chuột Razer DeathAdder V3 Pro', '63g, HyperSpeed Wireless', 4190000, 15, 'https://assets2.razerzone.com/images/pnx.assets/0b0e0b0e-0b0e-4b0e-8b0e-0b0e0b0e0b0e/razer-deathadder-v3-pro-white.png'),
(6, 'Tai nghe SteelSeries Arctis Nova 7 Wireless', '2.4GHz + Bluetooth, 38h pin', 4990000, 28, 'https://www.steelseries.com/content/dam/steelseries/websites/steelseries-com/us/gaming-headsets/arctis-nova-7/arctis-nova-7-black.png'),
(6, 'Tai nghe HyperX Cloud II Wireless', '7.1 surround, 30h pin', 3290000, 50, 'https://hyperx.com/wp-content/uploads/2020/10/cloud2wireless-1.png');

-- 3. Thêm cột payment_method vào bảng orders
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'orders';

ALTER TABLE orders
ADD COLUMN payment_method VARCHAR(50);

ALTER TABLE orders ADD COLUMN phone VARCHAR(20);
ALTER TABLE orders ADD COLUMN full_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN notes TEXT;

ALTER TABLE orders 
ALTER COLUMN total_amount TYPE DECIMAL(14,2);