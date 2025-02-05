FROM node:20.11-alpine as base

RUN apk add --update --no-cache make

RUN mkdir -p /opt/app/
COPY *.json /opt/app/
WORKDIR /opt/app/

RUN npm ci
COPY src /opt/app/src/
RUN npm run build

ENV NODE_OPTIONS="--enable-source-maps"
ENV NODE_ENV=production
ENV SERVICE_PORT=8080

EXPOSE ${SERVICE_PORT}

FROM node:20.11-alpine as production
WORKDIR /opt/app/

COPY --from=base --chown=node:node /opt/app/*.json ./
COPY --from=base --chown=node:node /opt/app/node_modules ./node_modules

RUN rm -rf tsconfig.build.json \
 && npm prune --omit dev \
 && chown -R node:node /opt/app

USER node

ENTRYPOINT ["node", "/opt/app/build/src/main.js"]

FROM node:20.11-alpine as development
WORKDIR /opt/app/

COPY --from=base --chown=node:node /opt/app/*.json ./
COPY --from=base --chown=node:node /opt/app/src ./src
COPY --from=base --chown=node:node /opt/app/node_modules ./node_modules

RUN chown -R node:node /opt/app

USER node

ENTRYPOINT ["npm", "run", "start:dev"]
