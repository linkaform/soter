####################################
# Image for develop                #
####################################
FROM node:23.2.0-bullseye-slim


RUN mkdir -p /srv
RUN chown 1000:1000 -R /srv/
COPY *.json /srv/
COPY *.config.* /srv/
WORKDIR /srv/
RUN yarn

USER node
