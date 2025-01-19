FROM node:20-alpine AS runtime

ENV HOST "0.0.0.0"
ENV VITE_API_URL ""
ENV NODE_ENV "production"
ENV DATA_PATH "/app/data"

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite-dev

COPY ./common ./common
COPY ./server ./server
RUN npm --prefix ./server install --include=dev

COPY ./web ./web
RUN npm --prefix ./web install --include=dev

COPY build.js ./

RUN node build.js

EXPOSE 3000
CMD ["node", "./dist/app.js"]
