FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install --no-save @rollup/rollup-linux-x64-musl
COPY . .
RUN npm run build

FROM alpine:3.20
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["sh", "-c", "rm -rf /shared/* && cp -r /app/dist/. /shared/"]