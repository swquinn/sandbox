FROM sandbox/fastapi:python-3.8
LABEL maintainer="Sean Quinn"

#: The version of nginx to install
ENV NGINX_VERSION=1.19.1 \
    NGINX_GPG_KEYS=573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
    NGINX_SHA512="de7031fdac1354096d3388d6f711a508328ce66c168967ee0658c294226d6e7a161ce7f2628d577d56f8b63ff6892cc576af6f7ef2a6aa2e17c62ff7b6bf0d98 *stdin" \
    NJS_VERSION=0.4.2 \
    PKG_RELEASE=1~buster \
    WWW_DIR=/srv/www


#: SUPERVISIOR
#: ===========

RUN pip install supervisor \
 && mkdir -p /etc/supervisor/conf.d \
 && ln -s /usr/local/bin/supervisord /usr/bin/supervisord
COPY ./files/etc/supervisord.conf /etc/supervisord.conf


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
RUN apt-get update \
 && apt-get install --no-install-recommends --no-install-suggests -y \
        ca-certificates \
        curl \
        # gd-dev \
        # geoip-dev \
        gettext \
        gnupg1 
        # libc-dev \
        # libressl \
        # libressl-dev \
        # libxslt-dev \
        # linux-headers \
        # make \
        # pcre-dev \
        # zlib-dev \
        # perl-dev \


#: NGINX
#: =====
#:   The `nginx` user is the (default) user given access to the nginx
#:   processes. This will almost always be overridden to be `www-data`,
#:   but we build and configure using this user.
#:
#:   We secure the `nginx` user by preventing logins. This is done by
#:   directing logins to the `/sbin/nologin` shell.
RUN set -x \
 && addgroup --system --gid 101 nginx \
 && adduser --system --disabled-login --ingroup nginx --no-create-home --home /nonexistent --gecos "nginx user" --shell /bin/false --uid 101 nginx

RUN found=''; \
    for server in \
        ha.pool.sks-keyservers.net \
        hkp://keyserver.ubuntu.com:80 \
        hkp://p80.pool.sks-keyservers.net:80 \
        pgp.mit.edu \
    ; do \
        echo "Fetching GPG key $NGINX_GPG_KEYS from $server"; \
        apt-key adv --keyserver "$server" --keyserver-options timeout=10 --recv-keys "$NGINX_GPG_KEYS" && found=yes && break; \
    done; \
    test -z "$found" && echo >&2 "error: failed to fetch GPG key $NGINX_GPG_KEYS" && exit 1; \
    apt-get remove --purge --auto-remove -y gnupg1 && rm -rf /var/lib/apt/lists/* \
 && dpkgArch="$(dpkg --print-architecture)" \
 && nginxPackages=" \
        nginx=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-xslt=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-geoip=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-image-filter=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-njs=${NGINX_VERSION}.${NJS_VERSION}-${PKG_RELEASE} \
    " \
 && case "$dpkgArch" in \
      amd64|i386) \
        # arches officialy built by upstream
        echo "deb https://nginx.org/packages/mainline/debian/ buster nginx" >> /etc/apt/sources.list.d/nginx.list \
        && apt-get update \
        ;; \
        *) \
        # we're on an architecture upstream doesn't officially build for
        # let's build binaries from the published source packages
        echo "deb-src https://nginx.org/packages/mainline/debian/ buster nginx" >> /etc/apt/sources.list.d/nginx.list \
        \
        # new directory for storing sources and .deb files
        && tempDir="$(mktemp -d)" \
        && chmod 777 "$tempDir" \
        # (777 to ensure APT's "_apt" user can access it too)
        \
        # save list of currently-installed packages so build dependencies can be cleanly removed later
        && savedAptMark="$(apt-mark showmanual)" \
        \
        # build .deb files from upstream's source packages (which are verified by apt-get)
        && apt-get update \
        && apt-get build-dep -y $nginxPackages \
        && ( \
        cd "$tempDir" \
        && DEB_BUILD_OPTIONS="nocheck parallel=$(nproc)" \
        apt-get source --compile $nginxPackages \
        ) \
        # we don't remove APT lists here because they get re-downloaded and removed later
        \
        # reset apt-mark's "manual" list so that "purge --auto-remove" will remove all build dependencies
        # (which is done after we install the built packages so we don't have to redownload any overlapping dependencies)
        && apt-mark showmanual | xargs apt-mark auto > /dev/null \
        && { [ -z "$savedAptMark" ] || apt-mark manual $savedAptMark; } \
        \
        # create a temporary local APT repo to install from (so that dependency resolution can be handled by APT, as it should be)
        && ls -lAFh "$tempDir" \
        && ( cd "$tempDir" && dpkg-scanpackages . > Packages ) \
        && grep '^Package: ' "$tempDir/Packages" \
        && echo "deb [ trusted=yes ] file://$tempDir ./" > /etc/apt/sources.list.d/temp.list \
        # work around the following APT issue by using "Acquire::GzipIndexes=false" (overriding "/etc/apt/apt.conf.d/docker-gzip-indexes")
        #   Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
        #   ...
        #   E: Failed to fetch store:/var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages  Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
        && apt-get -o Acquire::GzipIndexes=false update \
        ;; \
    esac \
    \
 && apt-get install --no-install-recommends --no-install-suggests -y $nginxPackages \
 && apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx.list \
    \
 ## if we have leftovers from building, let's purge them (including extra, unnecessary build deps)
 && if [ -n "$tempDir" ]; then \
        apt-get purge -y --auto-remove \
        && rm -rf "$tempDir" /etc/apt/sources.list.d/temp.list; \
    fi


#: LOGGING
#: =======
#:   Forward request and error logs to the docker log collector.
#:
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log


#: ADD NGINX CONFIGURATION
#: =======================
RUN rm -rf /etc/nginx/conf.d/default.conf \
 && mkdir -p /etc/nginx/conf.d/ \
 && mkdir -p /etc/nginx/sites/ \
 && mkdir -p /etc/nginx/sites-available/ \
 && mkdir -p /etc/nginx/sites-enabled/ \
 && mkdir -p /usr/share/nginx/html/ \
 && mkdir -p /var/lib/nginx \
 && chown -R www-data:www-data /var/lib/nginx

COPY files/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY files/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf


#: MODIFY SUPERVISOR CONFIGURATION
#: ===============================
RUN sed -i 's/^loglevel=info/loglevel=debug/' /etc/supervisord.conf
COPY files/etc/supervisor/conf.d/nginx.conf /etc/supervisor/conf.d/nginx.conf


#: DOCKER ENTRYPOINTS
#: ==================
RUN mkdir /docker-entrypoint.d
COPY files/docker-entrypoint.d/10-listen-on-ipv6-by-default.sh /docker-entrypoint.d
COPY files/docker-entrypoint.d/20-envsubst-on-templates.sh /docker-entrypoint.d

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
 && chmod +x /docker-entrypoint.d/*


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

ENTRYPOINT ["/entrypoint.sh"]
CMD ["-c", "/etc/supervisord.conf"]