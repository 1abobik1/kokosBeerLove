# Stage 1: build the React app
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npx webpack --mode production

# Stage 2: nginx serves the app, proxies /api/* to the microservices and stores uploaded images
FROM nginx:1.28-alpine
RUN rm /etc/nginx/conf.d/default.conf \
    && mkdir -p /etc/nginx/snippets /etc/nginx/ssl \
       /uploads/news_images /uploads/shop_images /uploads/player_photos /uploads/team_logos /uploads/user_avatar \
    && chown -R nginx:nginx /uploads /var/cache/nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/app.conf nginx/proxy.conf /etc/nginx/snippets/
COPY nginx/https.conf /etc/nginx/https.conf.disabled
COPY --chmod=755 nginx/40-enable-https.sh /docker-entrypoint.d/40-enable-https.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 443
