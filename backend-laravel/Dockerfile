#FROM php:8.2-cli
FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=3000"]
