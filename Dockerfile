FROM node:18-slim as base

WORKDIR /app
RUN apt-get update -y \
    && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


#
# 依存関係を解消するコンテナ
#
FROM base as resolver

ENV NODE_ENV=development
COPY package.json yarn.lock .
RUN yarn install


#
# ビルダ
#
FROM resolver as builder

ENV NODE_ENV=production
COPY . .
RUN yarn run prisma generate \
    && yarn run build


#
# 本番環境コンテナ
#
FROM base as production

COPY --from=builder /app/build build
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

ENTRYPOINT ["node_modules/.bin/remix-serve"]
CMD ["build/index.js"]
