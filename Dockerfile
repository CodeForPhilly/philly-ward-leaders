FROM  phusion/baseimage:jammy-1.0.1
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
 DEBIAN_FRONTEND=noninteractive apt-get install -y npm && \
 npm install -g n && \ 
 n install 14 && \
 hash -r && \
 rm -rf /var/lib/apt/lists/* /var/cache/debconf/*-old && \ 
 rm -rf /var/log/*.log /var/log/apt/*.log

RUN touch /etc/service/cron/down
RUN touch /etc/service/sshd/down

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]
