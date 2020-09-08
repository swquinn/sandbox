FROM extesla/php:7.4
LABEL maintainer="Sean Quinn"

#: Whether or not XDebug should be enabled; this should be handled by the
#: docker-entrypoint.sh file.
ENV ENABLE_XDEBUG="false"

WORKDIR /

RUN apk add --no-cache --upgrade --virtual .symfony-deps acl git


#: ==========================================================================
#: Install Extensions
#: ==========================================================================

#: Install XDebug
RUN pecl install xdebug
COPY files/etc/php/mods-available/xdebug.ini /etc/php/mods-available/xdebug.ini
RUN ln -s /etc/php/mods-available/xdebug.ini /etc/php/conf.d/20-xdebug.ini

#: Configure PHP-FPM pools
COPY files/etc/php/php-fpm.d/www.conf /etc/php/php-fpm.d/www.conf


#: ==========================================================================
#: Composer
#: ==========================================================================

RUN curl -sS https://getcomposer.org/installer | php \
 && chmod +x composer.phar \
 && mv composer.phar /usr/local/bin/composer \
 && composer self-update


#: ==========================================================================
#: Symfony CLI
#: ==========================================================================

RUN curl -sS https://get.symfony.com/cli/installer | bash \
 && mv /root/.symfony/bin/symfony /usr/local/bin/symfony


#: ==========================================================================
#: Adjust PHP Settings
#: ==========================================================================

RUN sed -i "s/^memory_limit = 128M$/memory_limit = 2048M/" /etc/php/php.ini \
 && sed -i "s/^;realpath_cache_size = 16k$/realpath_cache_size = 4096k/" /etc/php/php.ini \
 && sed -i "s/^;realpath_cache_ttl = 120$/realpath_cache_ttl = 600/" /etc/php/php.ini \
 && sed -i "s/^;date.timezone =\s*$/date.timezone = UTC/" /etc/php/php.ini \
 && sed -i "s/^(\[global\])$/$1\npid=\/var\/run\/php-fpm.pid/" /etc/php/php-fpm.conf

CMD ["php", "/var/www/bin/console"]