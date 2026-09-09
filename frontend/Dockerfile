# === STAGE 1: Build the React Application ===
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# === STAGE 2: Serve the Static Files with Nginx ===
FROM nginx:alpine

# Copy custom Nginx configuration for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built HTML/JS/CSS assets from Stage 1 into Nginx web server directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
