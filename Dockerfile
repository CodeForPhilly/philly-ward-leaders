FROM node:20-alpine3.18
  RUN apk update && apk add --no-cache bash && apk add --no-cache python3
  ENTRYPOINT ["bash"]