# --------
# STAGE 1: Base image with common dependencies
# --------
FROM node:16-alpine AS base
RUN apk add --no-cache bash

# --------
# STAGE 2: Build the React client
# --------
FROM base AS build_client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./

# --------
# STAGE 3: Build the server
# --------
FROM base
WORKDIR /app
COPY --from=build_client /app/client /app/client
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# --------
# STAGE 4: Run frontend & backend
# --------
EXPOSE 3000 4000
CMD cd /app/client && npm start & cd /app/server && node index.js
