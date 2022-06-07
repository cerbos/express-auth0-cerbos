FROM node:18 AS build-env
ADD . /app
WORKDIR /app
RUN npm install --production

FROM gcr.io/distroless/nodejs:18-amd64
COPY --from=build-env /app /app
WORKDIR /app
CMD ["index.js"]