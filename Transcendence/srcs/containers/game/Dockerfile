# Usa una versión base
FROM node:24-alpine

# Directorio de trabajo
WORKDIR /app

COPY ./conf/package*.json ./

RUN npm install \
 && npm install fastify-cookie --save-dev typescript @types/node concurrently nodemon

# END CACHED
COPY ./conf/tsconfig.json ./
COPY ./certs/ ./certs/
COPY ./volume-game/ ./src/

EXPOSE 10000

CMD ["npm", "run", "dev"]
