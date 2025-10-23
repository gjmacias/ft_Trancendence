FROM node:24-alpine

WORKDIR /app

# Copiamos package.json y tsconfig.json
COPY ./conf/package*.json ./
COPY ./conf/tsconfig.json ./

# Instalar dependencias
RUN npm install fastify-cookie
RUN npm install axios
RUN apk add --no-cache sqlite

# END CACHED
COPY ./certs/ ./certs/
COPY ./volume-backend ./src

EXPOSE 4000

CMD ["npm", "run", "dev"]
