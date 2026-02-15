FROM oven/bun:alpine AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM alpine:3.23
RUN apk --no-cache add darkhttpd
COPY --from=builder /app/dist /srv
EXPOSE 80
CMD ["darkhttpd", "/srv", "--port", "80"]
