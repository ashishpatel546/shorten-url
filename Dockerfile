FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json ./
# RUN npm config set strict-ssl false
RUN npm install
COPY . .
RUN npm run build
# EXPOSE PORT, SHOULD BE SAME AS SERVICE PORT
EXPOSE 3000
CMD [ "node", "./dist/main.js" ]