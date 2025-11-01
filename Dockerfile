# ==============================
# Stage 1: Build Angular
# ==============================
FROM node:22 AS build

WORKDIR /app

# Salin package.json & package-lock.json, lalu install dependencies
COPY package*.json ./
RUN npm install

# Salin seluruh source code project
COPY . .

# Build Angular untuk production
RUN npm run build

# ==============================
# Stage 2: Serve dengan Nginx
# ==============================
FROM nginx:alpine

# Hapus default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy isi folder browser ke root Nginx
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html

# Salin konfigurasi Nginx khusus Angular SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
