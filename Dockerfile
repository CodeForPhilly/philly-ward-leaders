FROM node:14.20.1-alpine3.15
  RUN apk update && apk add --no-cache bash
  ENTRYPOINT ["bash"]