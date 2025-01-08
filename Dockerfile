####################################
# Image for develop                #
####################################
FROM node:23.2.0-bullseye-slim as develop


RUN apt-get update && \
    apt-get -y install \
    vim

npm install -g yarn

RUN mkdir -p /srv
RUN chown 1000:1000 -R /srv/
COPY ../*.json /srv/
COPY ../*.config.* /srv/
WORKDIR /srv/
RUN yarn


####################################
# Image for Production                #
####################################
FROM linkaform/soter:develop as prod


USER node
