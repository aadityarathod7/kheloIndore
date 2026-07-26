FROM node:20.9.0-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

RUN npm install
#RUN npm install && npm install -g phantomjs-prebuilt

COPY . .

EXPOSE 3037

CMD ["npm", "start"]
