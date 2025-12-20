FROM node:20-alpine

# Thư mục làm việc
WORKDIR /app

# (Tuỳ chọn) Dùng mirror npm nhanh hơn
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry $NPM_REGISTRY

# Copy package trước để tận dụng cache
COPY package*.json ./

# Cài dependencies (CI-friendly)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Cài nodemon (chỉ dùng nếu bạn chạy dev)
# 👉 Nếu backend prod KHÔNG cần nodemon → xoá dòng này
RUN npm install -g nodemon

# Copy source code
COPY . .

# Expose port backend (Render sẽ override bằng PORT env)
EXPOSE 5000

# Render sẽ inject PORT → bạn nên dùng process.env.PORT
CMD ["npm", "start"]