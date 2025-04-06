# --------
# STAGE 1: Build & run the server
# --------
FROM node:16-alpine AS server

WORKDIR /app/server

COPY server/package*.json ./

RUN npm install

COPY server/ ./

COPY --from=build_client /app/client/build ./public

EXPOSE 4000

CMD ["node", "index.js"]

# --------
# STAGE 2: Build the React client
# --------
FROM node:16-alpine AS build_client

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client/ ./

EXPOSE 3000

RUN npm run build


