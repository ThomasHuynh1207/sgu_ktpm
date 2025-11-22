# Sử dụng image Node chính thức
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package vào container để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build dự án (chỉ cần nếu bạn muốn chạy bản build production)
# RUN npm run build

# Mở port (Vite mặc định là 5173)
EXPOSE 5173

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "dev", "--", "--host"]

