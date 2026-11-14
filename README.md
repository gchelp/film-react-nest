# FILM!

Приложение для покупки билетов в кино: фронтенд на React, бэкенд на NestJS, база данных PostgreSQL.

## Автор

Глеб, когорта 48, курс «Фулстек-разработчик»

## Ссылки

- Репозиторий: https://github.com/gchelp/film-react-nest
- Опубликованное приложение: http://84.201.146.132

## Запуск в Docker

Создайте файл `.env` в корне проекта из примера `.env.example` и задайте значения (пароли `POSTGRES_PASSWORD` и `DATABASE_PASSWORD` должны совпадать).

```bash
docker compose up -d --build
```

После запуска приложение доступно на порту 80, pgAdmin на порту 8080.

### Наполнение базы

1. Откройте pgAdmin и добавьте сервер: хост `database`, порт `5432`, база `prac`, пользователь и пароль из `.env`.
2. В Query Tool по очереди выполните файлы из `backend/test`: `prac.init.sql` (без строки `create database`, база уже создана контейнером), `prac.films.sql`, `prac.shedules.sql`.

## Локальная разработка бэкенда

```bash
cd backend
npm ci
cp .env.example .env
npm run start:dev
```

Нужна запущенная PostgreSQL. Переменные окружения описаны в `backend/.env.example`:

- `DATABASE_DRIVER` — `postgres`
- `DATABASE_URL` — адрес СУБД, например `postgres://localhost:5432/prac`
- `DATABASE_USERNAME`, `DATABASE_PASSWORD` — учётные данные
- `PORT` — порт бэкенда
- `LOGGER` — формат логов: `dev`, `json` или `tskv`

## Тесты и линтер

```bash
cd backend
npm test
npm run lint
```

## Деплой

Образы бэкенда, фронтенда и nginx собираются GitHub Actions при каждом коммите в `main` и публикуются в GitHub Container Registry (`ghcr.io/gchelp/film-react-nest-*`). На сервере проект запускается через `docker compose` из этих образов.
