# sgu_ktpm
# Cài đặt môi trường
**1.Clone Repo**
git clone https://github.com/ThomasHuynh1207/sgu_ktpm.git
npm install cho cả frontend và backend
npm install react-router-dom
npm install --save-dev @types/react-router-dom
**2. Chạy website bằng Docker**

```
docker compose up --build
```

## Mục lục

[1. Giới thiệu phần mềm](#1-giới-thiệu-phần-mềm)

&nbsp;&nbsp;[1.1. Tổng quan dự án](#11-tổng-quan-dự-án)

&nbsp;&nbsp;[1.2. Công nghệ sử dụng](#12-công-nghệ-sử-dụng)

&nbsp;&nbsp;[1.3. Thiết kế phần mềm](#13-thiết-kế-phần-mềm)

&nbsp;&nbsp;[1.4. Thiết kế kiến trúc](#3-thiết-kế-kiến-trúc)


## 1. Giới thiệu phần mềm

### 1.1. Tổng quan dự án

Dự án “Website thương mại điện tử Fahasa” là một hệ thống bán sách giấy trực tuyến được xây dựng nhằm mô phỏng hoạt động của một nền tảng thương mại điện tử thực tế.

Để đảm bảo chất lượng phần mềm, quá trình kiểm thử website phải được thực hiện. Kiểm thử giúp đánh giá tính đúng đắn của dữ liệu, mức độ ổn định của hệ thống, khả năng xử lý yêu cầu, tính bảo mật và hiệu năng khi hoạt động trong môi trường thực. Các hoạt động kiểm thử bao gồm xây dựng và thực hiện các test case, kiểm thử đơn vị, kiểm thử tích hợp, kiểm thử hệ thống và kiểm thử chấp nhận trước khi triển khai thực tế.

### 1.2. Công nghệ sử dụng

| Danh mục       | Tools / Frameworks                                           |
| -------------- | ------------------------------------------------------------ |
| Frontend       | Vite, ReactJS, TypeScript                                    |
| Backend        | NodeJS                                                       |
| Database       | PostgreSQL                                                   |
| Authentication | JWT                                                          |
| Testing        | Postman, Selenium, K6                                        |
| CI/CD          | GitHub Actions                                               |

### 1.3. Thiết kế phần mềm

### 1.3.1. Bối cảnh kinh doanh

Website bán máy tính là một hệ thống thương mại điện tử được xây dựng theo mô hình B2C (Business-to-Customer), cho phép khách hàng cá nhân truy cập để tìm hiểu, lựa chọn và mua các sản phẩm máy tính, linh kiện và phụ kiện trực tuyến.
Mục tiêu của hệ thống là đơn giản hóa quá trình mua hàng, giúp người dùng dễ dàng tra cứu thông tin, đặt hàng và thanh toán trực tuyến.
Đối với người quản trị, hệ thống hỗ trợ quản lý sản phẩm, đơn hàng, khách hàng, tồn kho và doanh thu một cách tập trung.
Hệ thống gồm 3 nhóm tác nhân chính:
•	Khách hàng (Customer): Xem, tìm kiếm và mua sản phẩm.
•	Quản trị viên (Admin): Quản lý sản phẩm, danh mục, đơn hàng, tài khoản người dùng.
•	Hệ thống thanh toán (Payment Gateway): Xử lý giao dịch trực tuyến và xác nhận kết quả thanh toán.
Nền tảng hoạt động:
•	Giao diện người dùng: Website chạy trên trình duyệt.
•	Máy chủ ứng dụng: Backend xử lý logic nghiệp vụ (Node.js + Express).
•	Cơ sở dữ liệu: PostgreSQL lưu trữ sản phẩm, đơn hàng, tài khoản, lịch sử giao dịch.
Hệ thống hướng đến tự động hóa quy trình bán hàng của cửa hàng máy tính, nâng cao hiệu quả quản lý và mang lại trải nghiệm mua sắm hiện đại cho người tiêu dùng.

