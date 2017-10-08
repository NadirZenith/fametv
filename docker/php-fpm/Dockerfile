FROM php:7.1-fpm
#FROM php:7.1-fpm-alpine # missing gcc make etc (build-esentials ubuntu)

# enable repo for ffmpeg
RUN sed -i "s/jessie main/jessie main contrib non-free/" /etc/apt/sources.list
RUN echo "deb http://http.debian.net/debian jessie-backports main contrib non-free" >> /etc/apt/sources.list

RUN apt-get update && apt-get install -y \
    rlwrap \
    # for video resize
    ffmpeg \
    # for composer
    git \
    gcc \
    # for gd
    #freetype-dev \
    #  libjpeg-turbo-dev \
    libpng-dev libjpeg-dev \
    # for assets compilation with yuicompressor
    openjdk-7-jre \
    # clean up apt
    && rm -rf /var/lib/apt/lists/*

# install icu (i18n etc)
RUN curl -fsS -o /tmp/icu.tgz -L http://download.icu-project.org/files/icu4c/59.1/icu4c-59_1-src.tgz \
  && tar -zxf /tmp/icu.tgz -C /tmp \
  && cd /tmp/icu/source \
  && ./configure --prefix=/usr/local \
  && make \
  && make install \
# just to be certain things are cleaned up
  && rm -rf /tmp/icu*

# node for front end build
RUN curl https://deb.nodesource.com/node_6.x/pool/main/n/nodejs/nodejs_6.7.0-1nodesource1~jessie1_amd64.deb > node.deb \
 && dpkg -i node.deb \
 && rm node.deb

ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

# PHP_CPPFLAGS are used by the docker-php-ext-* scripts
ENV PHP_CPPFLAGS="$PHP_CPPFLAGS -std=c++11"

RUN docker-php-ext-configure intl --with-icu-dir=/usr/local && \
    docker-php-ext-configure gd \
        --with-gd \
    #    --with-freetype-dir=/usr/include/ \
        --with-png-dir=/usr/include/ \
        --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install intl pdo pdo_mysql opcache gd zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN useradd -ms /bin/bash dev
RUN usermod -u 1000 dev

USER dev

RUN echo 'alias sf="php app/console"' >> ~/.bashrc
RUN echo 'alias sf3="php bin/console"' >> ~/.bashrc

#RUN composer --version

ADD start.sh /start.sh

#RUN ls -l /application
#CMD ["php-fpm"]

WORKDIR  "/application"

#COPY run.sh /docker-php-entrypoint
#RUN echo "echo 'okapa';" >> ./web/index.php
#RUN ls -la /app
ENTRYPOINT ["/start.sh"]
