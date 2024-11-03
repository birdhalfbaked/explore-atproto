FROM node:23-alpine3.19 as builder

USER node

WORKDIR /project

COPY yarn.lock package.json ./

RUN yarn install

FROM node:23-alpine3.19 as runtime

COPY --from=builder /project /project

USER root

COPY ./src /project/src/
COPY index.ts /project/index.ts

WORKDIR /project

ENTRYPOINT [ "yarn", "tsx" ]

CMD [ "./index.ts" ]
