
FROM node:18-bullseye
WORKDIR /app
COPY package.json ./
COPY src ./src
RUN npm install
RUN npx playwright install --with-deps
CMD ["npm","start"]
