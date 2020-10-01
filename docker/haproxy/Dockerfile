FROM haproxy:2.1-alpine
LABEL maintainer="Sean Quinn"

ENV ENABLE_LOGGING=0

RUN apk update && apk upgrade \
 && apk add --no-cache ca-certificates

COPY ./files/usr/local/etc/haproxy/errorfiles/ /usr/local/etc/haproxy/errorfiles/
COPY ./files/usr/local/etc/haproxy/haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

#: Add the certificates
COPY ./files/etc/ssl/private/dev.sandbox.com.pem /etc/ssl/private/dev.sandbox.com.pem
COPY ./files/usr/local/share/ca-certificates/dev.sandbox.com.crt /usr/local/share/ca-certificates/dev.sandbox.com.crt
RUN update-ca-certificates
