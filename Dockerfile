# Compile and build angular
FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Serve with nginx server
FROM nginx:latest
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/chillers-app/browser /usr/share/nginx/html
EXPOSE 80
