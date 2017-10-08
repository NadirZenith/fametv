#!/bin/sh

#su -c 'su git -c "git init"'

#su -c 'su dev -c "whoami > whoami3.txt"';
#su -c 'chmod dev:dev app/logs/';

#chown -R www-data:www-data /var
#php bin/console cache:clear

#mkdir app/logs;
#mkdir app/cache;

#whoami >> whoami.txt;

#su dev;

#whoami >> whoami2.txt;

#exit;
#composer install --ignore-platform-reqs;

#ls -la app/ > ls.txt;
#chown dev:dev app/logs;
#ls -la app/ > ls2.txt;

#su -c 'su dev -c "composer install --ignore-platform-reqs"';

composer install --ignore-platform-reqs;

php-fpm;
