FROM node:20-alpine

WORKDIR /app

# Mirror npm (nhanh hơn ở VN / CI)
ARG NPM_REGISTRY=https://registry.npmmirror.com
RUN npm config set registry $NPM_REGISTRY

# Cache npm toàn cục
RUN --mount=type=cache,target=/root/.npm \
    npm install -g esbuild@latest --unsafe-perm=true

# Copy package để cache
COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Copy source
COPY . .

# Vite dev port
EXPOSE 5173

# Chạy dev server – Render OK
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]