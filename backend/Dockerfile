FROM node:16.14.0
WORKDIR /index
COPY package.json .
RUN npm install --force
COPY . .
EXPOSE 5000
CMD ["npm", "start"]