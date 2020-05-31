FROM node

EXPOSE 4000

WORKDIR /opt/covid-map
COPY . /opt/covid-map

RUN yarn --cwd /opt/covid-map
RUN yarn --cwd /opt/covid-map build

RUN rm -rf /opt/covid-map/src

CMD [ "yarn", "--cwd", "/opt/covid-map", "start" ]