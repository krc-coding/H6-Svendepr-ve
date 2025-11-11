FROM ubuntu:22.04

ARG WWWGROUP=1000
ARG WWWUSER=1000

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND noninteractive
ENV TZ=UTC

# Setup time-zone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install basic tools
RUN apt-get update
RUN apt-get install -y gnupg gosu curl wget tree ca-certificates zip unzip git supervisor sqlite3 libcap2-bin libpng-dev python2 ffmpeg nano inetutils-ping
RUN apt-get install software-properties-common -y

RUN mkdir -p ~/.gnupg
RUN chmod 600 ~/.gnupg
RUN add-apt-repository ppa:ondrej/php -y
RUN apt-get update

# Install PHP
RUN apt-get install -y php-pear php8.3-cli php8.3-fpm php8.3-dev \
    php8.3-pgsql php8.3-sqlite3 php8.3-gd \
    php8.3-curl php8.3-memcached \
    php8.3-imap php8.3-mysql php8.3-mbstring \
    php8.3-xml php8.3-zip php8.3-bcmath php8.3-soap \
    php8.3-intl php8.3-readline php8.3-pcov \
    php8.3-msgpack php8.3-igbinary php8.3-ldap \
    php8.3-swoole php8.3-xdebug

RUN php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer

# Install nginx & database clients
RUN apt-get install -y nginx mysql-client postgresql-client

# Install nodejs
RUN wget http://pear.php.net/go-pear.phar
RUN php go-pear.phar
RUN pecl channel-update pecl.php.net
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
#RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
#RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
#RUN apt-get update
#RUN apt-get install -y yarn

# Install clean up
RUN apt-get -y autoremove
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp

# Setup www-user and group.
RUN groupadd --force -g $WWWGROUP www-user
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u $WWWUSER www-user

# Install setup config and script files.
COPY files/php.ini /etc/php/8.3/fpm/php.ini
COPY files/www.conf /etc/php/8.3/fpm/pool.d/www.conf
COPY files/nginx.conf /etc/nginx/nginx.conf
COPY files/nginx-vhost.conf /etc/nginx/sites-available/default
COPY files/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY files/start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

# Install setup runtime and log files.
RUN mkdir /run/php
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stdout /var/log/nginx/error.log

EXPOSE 80

ENTRYPOINT ["start-container"]
