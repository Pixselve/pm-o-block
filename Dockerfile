FROM node:11
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update
RUN apt-get install python
RUN npm install prisma2 -g --unsafe-perm
RUN npm install
COPY . .
RUN prisma2 generate

FROM node:11-alpine
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
CMD npm run start