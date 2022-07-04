FROM node:16.13-alpine3.14 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ---

FROM node:16.13-alpine3.14 as production

RUN apk add dumb-init
RUN mkdir -p /usr/src/app
RUN chown -R node:node /usr/src/app

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/dist ./dist
COPY --chown=node:node --from=development /usr/src/app/package*.json ./
COPY --chown=node:node --from=development /usr/src/app/src/config/config-template.yaml ./

RUN npm install --only=production

CMD ["dumb-init", "node", "dist/main"]
