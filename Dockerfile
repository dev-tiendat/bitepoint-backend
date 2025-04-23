FROM node:23-slim AS base

ARG PROJECT_DIR

ENV DB_HOST=mysql \
    APP_PORT=7001

RUN yarn global add pm2

WORKDIR $PROJECT_DIR
COPY ./ $PROJECT_DIR
RUN chmod +x ./wait-for-it.sh 

RUN ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime \
    && echo 'Asia/Ho_Chi_Minh' > /etc/timezone

FROM base AS build
RUN npm install --legacy-peer-deps
RUN npm run build


FROM base
COPY --from=build $PROJECT_DIR/node_modules $PROJECT_DIR/node_modules
COPY --from=build $PROJECT_DIR/dist $PROJECT_DIR/dist

EXPOSE $APP_PORT

ENTRYPOINT ./wait-for-it.sh $DB_HOST:$DB_PORT -- npm run migration:run && pm2-runtime ecosystem.config.js