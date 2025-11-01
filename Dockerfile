# Gunakan image Node.js untuk build tahap pertama
FROM node:22 AS build

WORKDIR /app

# Salin package dan install dependency
COPY package*.json ./
RUN npm install

# Salin semua file dan build aplikasi Angular
COPY . .
RUN npm run build --prod

# Tahap kedua: gunakan Nginx untuk serve hasil build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
