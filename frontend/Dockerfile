# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Dùng mirror VN (có thể truyền từ compose args cũng được)
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry $NPM_REGISTRY

# Cache npm toàn cục – lần đầu chậm, lần sau instant
RUN --mount=type=cache,target=/root/.npm \
    npm install -g esbuild@latest --unsafe-perm=true

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]