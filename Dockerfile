FROM node:12.22.10-alpine3.14 as builder

# Set working directory
WORKDIR /app

# build production version
ENV NODE_ENV=production

# Copy package.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package.json ./

# Install dependencies
RUN yarn install

# Copy project
COPY . .

# Build app
RUN yarn run build

# Make clear image
FROM node:12.22.10-alpine3.14

RUN apk --no-cache add curl

WORKDIR /app

# build production version
ENV NODE_ENV=production

COPY --from=builder /app/dist dist
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/tsconfig.build.json tsconfig.build.json

EXPOSE 8008

CMD ["yarn", "start", "dist/src/main.js"]

HEALTHCHECK --start-period=30s \
            --interval=10s \
            --timeout=10s \
            --retries=3 \
            CMD [ "curl", "--fail", "http://localhost:8008" ]
