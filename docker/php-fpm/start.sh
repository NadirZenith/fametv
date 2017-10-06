#!/bin/sh

#chown -R www-data:www-data /var
#php bin/console cache:clear

composer install --ignore-platform-reqs;

php-fpm;
