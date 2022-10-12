alias dc="docker compose"

use git bash terminal
start up container:
`dc build`
`dc up -d`
`dc exec ward-leaders bash`

To exit container: `exit`
Cleanup: `dc down --rmi local`
Run `dc down --help` for more info



`docker ps` (to get list of containers)
`dc ps` (to get list of docker compose services)
`docker exec -it <container_id> bash`

`npm start`  --start application

-----------------------
updated below commands in docker file, Sept.22th: no need to run this.
`npm install -g n`
`n install <node_major_version>` (n install 14)
After updating node version:
  - npm install
  - npm rebuild 
-----------------

I need to inside the container run `rm package-lock.json` before `npm install` (installing compatible pakages version to work with npm 6.0) before my two PRs get merged to master)


Two ways:
1. use alpine image: smaller footprint, support node 10 and 14, support updates of node-sass4.14
  Dockerfile:
  FROM node:10-alpine3.11
  RUN apk update && apk add --no-cache bash
  ENTRYPOINT ["bash"]
  docker-compose.yml:
   add tty: true
   Once in container:
    run npm install
    run npm outdated to check node-sass
    run npm upate node-sass 
      run npm install -D sass-loader@^7
    delete node_modules folder and run npm install again




other commands: 
npm outdated
npm update <packageName>


`npm list -g` check versions

`FROM node:14.20-alpine3.15` 1st line of the Dockerfile is saying use node 10. The variant of that image is alpine Linux (a very stripped down OS). 3.11 is the version of alpine

`RUN apk update && apk add --no-cache bash` 2nd line updates the OS packages and installs bash

`ENTRYPOINT ["bash"]` 3rd and final line tells the image that you want to enter using the bash command

`tty` added "tty: true" in docker-compose.yml so that the container doesn't immediately exit. Basically telling docker you want an interactive shell instead of a single command



-------DOCKER KNOWLEDGE-----------
`Docker compose.yml` tool for defining and running multi-container docker application; Use yaml file to configure application services
      `docker compose up` start service
      `docker compose down` stop service
      ` docker-compose -v` check version

`Docker file` a text file with instructions to build docker image, automation of Docker image creation



==================OCT.10th===================================
Links in the app break when the site URL has a subdirectory. This makes the site incompatible with standard GitHub page URLs that use a format of user.github.io/repo-name, this is what happened to my test site.
I can still make the below changes to the master branch:
1. add deployment code for auto deployment
I fixed issues on my repo by making the below changes.  it won't need if there's no subdomain in the base URL in production.
2. change <script src="/build.js"></script>   to <script src="build.js"></script>in index.html
3. webpack.config change from publicPath: '/'  to   publicPath: '' (edited) 

======================options?==============

1. ditch webpack in favor of vue CLI or vite?
