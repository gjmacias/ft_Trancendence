FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ git curl bash  

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json

RUN npm install 

# END CACHED
RUN mkdir -p ./certs/
COPY ./certs/ ./certs/ 
COPY ./volume-blockchain/ ./src/


EXPOSE 9650

CMD ["npm", "run", "dev"]
