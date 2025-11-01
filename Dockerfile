# ==============================
# Tahap 1: Build Angular
# ==============================
FROM node:22 AS build

# Tentukan working directory
WORKDIR /app

# Salin package.json dan package-lock.json lalu install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file project
COPY . .

# Build Angular untuk production
RUN npm run build --prod

# ==============================
# Tahap 2: Serve menggunakan Nginx
# ==============================
FROM nginx:alpine

# Salin hasil build dari tahap 1 ke folder Nginx
COPY --from=build /app/dist/Front-End /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
