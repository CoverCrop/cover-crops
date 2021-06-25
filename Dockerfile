# ----------------------------------------------------------------------
# Build application using node
# ----------------------------------------------------------------------

FROM node:14.5.0-alpine AS builder

WORKDIR /usr/src/app

ARG REACT_APP_ENV=""
ENV REACT_APP_ENV=${REACT_APP_ENV}

COPY package.json package-lock.json /usr/src/app/

RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY .eslintrc *.js ./
COPY src ./src/
COPY public ./public/

RUN npm run build

# ----------------------------------------------------------------------
# Include nginx web server and host the build
# ----------------------------------------------------------------------

FROM nginx:1.19.1-alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
COPY public /usr/share/nginx/html/public/
COPY public/keycloak.json /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

