FROM oven/bun:alpine

COPY . .

RUN bun install
RUN bun --bun run build

EXPOSE 3000
CMD ["bun", "--bun", "run", "start"]
