FROM node:20-alpine AS runtime

ENV HOST "0.0.0.0"

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy only production dependencies
COPY server/ ./server/
RUN npm --prefix ./server install

COPY web/ ./web/
RUN npm --prefix ./web install

COPY build.js ./

RUN node build.js

RUN apk del python3 make g++


EXPOSE 3000
WORKDIR /app/dist
CMD ["node", "index.js"]
