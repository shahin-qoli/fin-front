FROM node:lts-alpine

WORKDIR /app
ADD . /app/


RUN yarn global add @vue/cli
RUN yarn install 
ENV HOST=0.0.0.0
CMD ["yarn", "run", "serve"]
