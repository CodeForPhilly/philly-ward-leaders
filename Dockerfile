FROM node:14-alpine3.15
  RUN apk update && apk add --no-cache bash && \
  npm install -g npm@8.15.0
  ENTRYPOINT ["bash"]