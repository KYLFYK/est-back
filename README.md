# Marketplace Back

## Пререквизиты

* *nix

## Запуск

* скачать скрипт для установки nodejs 12 версии
---
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
--

* добавить репозиторий nodejs и установить nodejs с последними обновлениями
---
nodesource_setup.sh
---

* возможно понадобится дополнительно активировать yarn
---
corepack enable
---

* установить зависимости
---
yarn install
---

* собрать проект
---
yarn run build
---

* запустить
---
yarn start dist/src/main.js
---

* если нужно запустить с production настройками
---
NODE_ENV=production yarn start dist/src/main.js
---
+
** настройки для подключения к базе должны лежать в корне репозитория в файле .prod.env
** ключ для SSL соединения базой CA.pem должен лежать в корне репозитория

## CI/CD

* логинимся на docker registry
* собираем проект
  ** скачиваем latest образ для переиспользования кеша
  ** собираем образ
  ** вешаем теги текущего хеша и latest
  ** пушим образы обратно в registry
* разворачиваем проект на dev стенде
  ** подключаемся к dev стенду
  ** запускаем скрипт deploy.sh

## Стенд

### Dev

Предполагается запуск контейнеров в виртуальной докер сети:

* proxy - nginx. перенаправляет запросы к серверу на фронт/бек. Слушает порты 80/443 (?)
* marketplace-front - фронтовая часть. наружу ничего не выставлено
  ** запросы к нему идут через proxy
  ** может отправлять запросы на бек в виртуальной сети
* marketplace-back - бек часть. наружу ничего не выставлено
  ** запросы к нему идут через прокси
  ** может отправлять запросы напрямую в базу на другой сервер
* healthcheck - возможен четвёртый контейнер для мониторинга состояния остальных контейнеров
и их рестарта, если состояние контейнера сменяется на unhealthy
