# Sử dụng Node.js image chính thức
FROM node:20-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình package vào container trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

RUN npm install -g nodemon

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng backend (thường là 5000)
EXPOSE 5000

# Lệnh chạy server
CMD ["npm", "start"]
