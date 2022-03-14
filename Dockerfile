FROM  phusion/baseimage:18.04-1.0.0-amd64

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
 DEBIAN_FRONTEND=noninteractive apt-get install -y npm && \
 /usr/bin/npm install npm@5.7.1 -g --production && \
 /usr/bin/npm cache rm && \
 rm -rf /var/lib/apt/lists/* /var/cache/debconf/*-old && \
 rm -rf /var/log/*.log /var/log/apt/*.log

RUN touch /etc/service/cron/down
RUN touch /etc/service/sshd/down

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]
