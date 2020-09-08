FROM sandbox/symfony:php-7.4
LABEL maintainer="Sean Quinn"

#: The version of nginx to install
ENV NGINX_VERSION=1.17.6 \
    NGINX_GPG_KEYS=573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
    NGINX_SHA512="de7031fdac1354096d3388d6f711a508328ce66c168967ee0658c294226d6e7a161ce7f2628d577d56f8b63ff6892cc576af6f7ef2a6aa2e17c62ff7b6bf0d98 *stdin" \
    NJS_VERSION=0.3.7 \
    WWW_DIR=/srv/www


#: ==========================================================================
#: FROM extesla/supervisor
#: ==========================================================================

RUN apk add --no-cache supervisor \
    && mkdir -p /etc/supervisor/conf.d \
    && sed -i 's/^\(\[supervisord\]\)$/\1\nnodaemon=true/' /etc/supervisord.conf \
    && sed -i 's/^\(files = .*\)$/;\1/' /etc/supervisord.conf \
    && sed -i 's/^\(\[include\]\)$/\1\nfiles = \/etc\/supervisor\/conf.d\/*.conf/' /etc/supervisord.conf


#: ==========================================================================
#: FROM extesla/nginx
#: ==========================================================================

#: DEPENDENCIES
#: ============
#:
#:   .build-deps::
#:
#:   .gettext::
#:     We bring in gettext so we can get `envsubst` which we use later in the
#:     build. We don't need the rest of gettext, so we want to eventually
#:     remove all of the other files that are included. Prior to deleting the
#:     gettext package(s) we want to move `envsubst` out of /usr/bin, then
#:     delete all of the gettext dependencies (which will be removed cleanly),
#:     and then finally move `envsubst` back into `/usr/local/bin`, e.g.
#:
#:     ```
#:     $ mv /usr/bin/envsubst /tmp
#:     $ apk del .gettext
#:     $ mv /tmp/envsubst /usr/local/bin/
#:     ```
#:
RUN apk update && apk upgrade \
 && apk add --no-cache --virtual .build-deps \
            ca-certificates \
            curl \
            gcc \
            gd-dev \
            geoip-dev \
            gnupg \
            libc-dev \
            libressl \
            libressl-dev \
            libxslt-dev \
            linux-headers \
            make \
            pcre-dev \
            zlib-dev \
            perl-dev \
 && apk add --no-cache --virtual .gettext gettext

#: NGINX
#: =====
#:   The `nginx` user is the (default) user given access to the nginx
#:   processes. This will almost always be overridden to be `www-data`,
#:   but we build and configure using this user.
#:
#:   We secure the `nginx` user by preventing logins. This is done by
#:   directing logins to the `/sbin/nologin` shell.
RUN set -x \
 && addgroup -g 101 -S nginx \
 && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

RUN CONFIG="\
        --prefix=/etc/nginx \
        --sbin-path=/usr/sbin/nginx \
        --modules-path=/usr/lib/nginx/modules \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --pid-path=/var/run/nginx.pid \
        --lock-path=/var/run/nginx.lock \
        --http-client-body-temp-path=/var/cache/nginx/client_temp \
        --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
        --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
        --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
        --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
        --user=nginx \
        --group=nginx \
        --with-debug \
        --with-http_ssl_module \
        --with-http_realip_module \
        --with-http_addition_module \
        --with-http_sub_module \
        --with-http_dav_module \
        --with-http_flv_module \
        --with-http_mp4_module \
        --with-http_gunzip_module \
        --with-http_gzip_static_module \
        --with-http_random_index_module \
        --with-http_secure_link_module \
        --with-http_stub_status_module \
        --with-http_auth_request_module \
        --with-http_xslt_module=dynamic \
        --with-http_image_filter_module=dynamic \
        --with-http_geoip_module=dynamic \
        --with-http_perl_module=dynamic \
        --with-threads \
        --with-stream \
        --with-stream_ssl_module \
        --with-stream_ssl_preread_module \
        --with-stream_realip_module \
        --with-stream_geoip_module=dynamic \
        --with-http_slice_module \
        --with-mail \
        --with-mail_ssl_module \
        --with-compat \
        --with-file-aio \
        --with-http_v2_module \
        " \
 && wget -O nginx.tar.gz http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz \
 && wget -O nginx.tar.gz.asc http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz.asc \
 && mkdir -p /tmp/gnupg \
 && export GNUPGHOME="$(mktemp -d -p /tmp/gnupg)" \
# TODO: Add key signing
 && rm -rf "$GNUPGHOME" nginx.tar.gz.asc \
 && mkdir -p /usr/src \
 && tar -zxC /usr/src -f nginx.tar.gz \
 && rm nginx.tar.gz \
 && cd /usr/src/nginx-$NGINX_VERSION \
 && ./configure $CONFIG --with-debug \
 && make -j$(getconf _NPROCESSORS_ONLN) \
 && mv objs/nginx objs/nginx-debug \
 && mv objs/ngx_http_xslt_filter_module.so objs/ngx_http_xslt_filter_module-debug.so \
 && mv objs/ngx_http_image_filter_module.so objs/ngx_http_image_filter_module-debug.so \
 && mv objs/ngx_http_geoip_module.so objs/ngx_http_geoip_module-debug.so \
 && mv objs/ngx_http_perl_module.so objs/ngx_http_perl_module-debug.so \
 && mv objs/ngx_stream_geoip_module.so objs/ngx_stream_geoip_module-debug.so \
 && ./configure $CONFIG \
 && make -j$(getconf _NPROCESSORS_ONLN) \
 && make install \
 && rm -rf /etc/nginx/html/ \
 && mkdir -p /etc/nginx/conf.d/ \
 && mkdir -p /etc/nginx/sites/ \
 && mkdir -p /etc/nginx/sites-available/ \
 && mkdir -p /etc/nginx/sites-enabled/ \
 && mkdir -p /usr/share/nginx/html/ \
 && install -m644 html/index.html /usr/share/nginx/html/ \
 && install -m644 html/50x.html /usr/share/nginx/html/ \
 && install -m755 objs/nginx-debug /usr/sbin/nginx-debug \
 && install -m755 objs/ngx_http_xslt_filter_module-debug.so /usr/lib/nginx/modules/ngx_http_xslt_filter_module-debug.so \
 && install -m755 objs/ngx_http_image_filter_module-debug.so /usr/lib/nginx/modules/ngx_http_image_filter_module-debug.so \
 && install -m755 objs/ngx_http_geoip_module-debug.so /usr/lib/nginx/modules/ngx_http_geoip_module-debug.so \
 && install -m755 objs/ngx_http_perl_module-debug.so /usr/lib/nginx/modules/ngx_http_perl_module-debug.so \
 && install -m755 objs/ngx_stream_geoip_module-debug.so /usr/lib/nginx/modules/ngx_stream_geoip_module-debug.so \
 && ln -s ../../usr/lib/nginx/modules /etc/nginx/modules \
 && strip /usr/sbin/nginx* \
 && strip /usr/lib/nginx/modules/*.so


#: RUN-TIME DEPENDENCIES
#: =====================
#:   The runtime dependencies are determined by investigating the libraries
#:   and modules installed for nginx.
#:
RUN runDeps="$( \
    scanelf --needed --nobanner /usr/sbin/nginx /usr/lib/nginx/modules/*.so /usr/bin/envsubst \
      | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
      | sort -u \
      | xargs -r apk info --installed \
      | sort -u \
    )" \
 && apk add --no-cache --virtual .nginx-rundeps $runDeps


#: CLEAN UP
#: ========
#:   Clean up the image by removing APK packages (e.g. .build-deps, .gettext,
#:   etc.), removing source files, and moving
#:
RUN rm -rf /usr/src/nginx-$NGINX_VERSION \
 && apk del .build-deps \
 && mv /usr/bin/envsubst /tmp/ \
 && apk del .gettext \
 && mv /tmp/envsubst /usr/local/bin/


#: LOGGING
#: =======
#:   Forward request and error logs to the docker log collector.
#:
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log


#: ADD NGINX CONFIGURATION
#: =======================
COPY files/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY files/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /etc/nginx/conf.d/default.conf \
 && mkdir -p /var/lib/nginx \
 && chown -R www-data:www-data /var/lib/nginx

#: MODIFY SUPERVISOR CONFIGURATION
#: ===============================
RUN sed -i 's/^loglevel=info/loglevel=debug/' /etc/supervisord.conf
COPY files/etc/supervisor/conf.d/nginx.conf /etc/supervisor/conf.d/nginx.conf
COPY files/etc/supervisor/conf.d/php-fpm.conf /etc/supervisor/conf.d/php-fpm.conf

#: MOUNT POINTS
#: ============
#:   Defines the various volumes that can be mounted
#:
#:     /srv/www::
#:       The WWW server directory; place web application files, SaaS apps,
#:       etc. here.
#:
#:     /etc/nginx/sites::
#:       The site data that can be made available to nginx. If you have a
#:       multiple websites, but not all are available you might create the
#:       necessary directory structure for their configuration here, e.g.:
#:
#:         /etc/nginx/sites/acme.com
#:         /etc/nginx/sites/example.com
#:         ...
#:
#:       You can then symlink the ones that should be available (but not
#:       necessarily enabled) to /etc/nginx/sites-available.
#:
#:     /etc/nginx/sites-available::
#:       The sites that should be (automatically) enabled.
#:
VOLUME /srv/www
VOLUME /etc/nginx/sites
VOLUME /etc/nginx/sites-available
EXPOSE 80 443

STOPSIGNAL SIGTERM

#: DOCKER ENTRYPOINT
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["-c", "/etc/supervisord.conf"]