FROM oven/bun:alpine

COPY . .

RUN bun install
RUN bunx --bun next build

EXPOSE 3000
CMD ["bunx", "--bun", "next", "start"]
