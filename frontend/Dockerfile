# Sử dụng Node 20
FROM node:20

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép file cấu hình trước để tận dụng cache Docker
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng Vite (React dev server)
EXPOSE 5173

# Chạy ứng dụng React ở chế độ development
CMD ["npm", "run", "dev", "--", "--host"]
