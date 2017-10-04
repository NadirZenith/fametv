#!/bin/sh

#chown -R www-data:www-data /var
#php bin/console cache:clear

composer install;

php-fpm;
