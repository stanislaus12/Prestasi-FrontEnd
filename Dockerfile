# ==============================
# Tahap 1: Build Angular
# ==============================
FROM node:22 AS build

# Tentukan working directory
WORKDIR /app

# Salin package.json dan package-lock.json, lalu install dependencies
COPY package*.json ./
RUN npm install

# Salin seluruh source code project
COPY . .

# Build Angular untuk production
# Pastikan nama project sesuai dengan angular.json
RUN npm run build

# ==============================
# Tahap 2: Serve dengan Nginx
# ==============================
FROM nginx:alpine

# Hapus default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Salin hasil build Angular dari tahap 1 ke folder Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Beri permission agar Nginx bisa membaca file
RUN chmod -R 755 /usr/share/nginx/html

# Salin konfigurasi Nginx khusus Angular SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
