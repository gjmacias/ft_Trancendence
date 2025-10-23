FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (will be copied in via volume during dev)
COPY ./conf/package*.json ./

RUN npm install
RUN npm install -y bash

COPY ./conf/* ./
COPY ./public/ ./public/
COPY ./certs/ ./certs/
COPY ./assets/ ./public/assets/
COPY ./volume-frontend/ ./src/
COPY index.html ./

# Build the application with vite build
RUN npm run build

# Second stage: Serve the built application with nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./certs/* /etc/nginx/certs/
COPY ./conf/nginx.conf /etc/nginx/nginx.conf

# Expose port for nginx
EXPOSE 5173

# Default command to run nginx
CMD ["nginx", "-g", "daemon off;"]
