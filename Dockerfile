FROM node:12

WORKDIR /app

COPY . .

RUN npx yarn install

ENV CASSANDRA_IP localhost

ENTRYPOINT [ "node" ]
CMD [ "app.js" ]