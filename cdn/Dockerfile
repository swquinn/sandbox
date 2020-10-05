FROM sandbox/nginx-fastapi:python-3.8
LABEL maintainer="Sean Quinn"

RUN rm -rf /etc/nginx/conf.d/default.conf \
 && mkdir -p /etc/nginx/sites \
 && mkdir -p /etc/nginx/sites-available \
 && mkdir -p /etc/nginx/sites-enabled \
 && mkdir -p /var/lib/nginx \
 && chown -R www-data:www-data /var/lib/nginx \
 && mkdir -p /var/cache/www \
 && chown -R www-data:www-data /var/cache/www \
 && mkdir -p /var/cache/nginx \
 && chown -R www-data:www-data /var/cache/nginx \
 && mkdir -p /var/log/www \
 && chown -R www-data:www-data /var/log/www

#: CONFIGURATION
#: =============
#:   Overwrite and add new configuration to the server.
#:
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY config/nginx/conf.d/file.conf /etc/nginx/conf.d/file.conf
COPY config/nginx/conf.d/gzip.conf /etc/nginx/conf.d/gzip.conf
COPY config/nginx/conf.d/requests.conf /etc/nginx/conf.d/requests.conf
COPY config/nginx/sites/cdn.sandbox.com /etc/nginx/sites/cdn.sandbox.com

VOLUME /srv/www

WORKDIR /srv/www/cdn.sandbox.com

#: DOCKER ENTRYPOINT
COPY config/docker-entrypoint.d/30-init.sh /docker-entrypoint.d/30-init.sh
RUN chmod +x /docker-entrypoint.d/30-init.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["-c", "/etc/supervisord.conf"]