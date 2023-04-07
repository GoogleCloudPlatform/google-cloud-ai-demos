FROM node:18-alpine as react-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build:production

# server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 8080
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]