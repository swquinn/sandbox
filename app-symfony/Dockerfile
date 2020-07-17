FROM sandbox/nginx-symfony:php-7.4
LABEL maintainer="Sean Quinn"

RUN apk add --no-cache --upgrade --virtual .sandbox-deps postgresql-dev

#: CONFIGURATION
#: =============
#:   Overwrite and add new configuration to the server.
#:
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY config/nginx/conf.d/file.conf /etc/nginx/conf.d/file.conf
COPY config/nginx/conf.d/gzip.conf /etc/nginx/conf.d/gzip.conf
COPY config/nginx/conf.d/php-fpm.conf /etc/nginx/conf.d/php-fpm.conf
COPY config/nginx/conf.d/requests.conf /etc/nginx/conf.d/requests.conf
COPY config/nginx/sites/app.sandbox.com /etc/nginx/sites/app.sandbox.com

RUN rm -rf /etc/nginx/conf.d/default.conf \
 && mkdir -p /var/lib/nginx \
 && chown -R www-data:www-data /var/lib/nginx \
 && mkdir -p /var/cache/www \
 && chown -R www-data:www-data /var/cache/www \
 && mkdir -p /var/cache/nginx \
 && chown -R www-data:www-data /var/cache/nginx \
 && mkdir -p /var/log/www \
 && chown -R www-data:www-data /var/log/www

#: DOCKER ENTRYPOINT
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["-c", "/etc/supervisord.conf"]