# HUMAN DRAFT

**HUMAN DRAFT** — современная веб-платформа для авторов и читателей, ориентированная на удобное написание, публикацию и чтение лонгридов, статей и тематических блогов.

Проект включает в себя WYSIWYG/Markdown редактор на базе Milkdown, древовидные обсуждения, систему подписок на авторов, тегирование публикаций, закрепление статей за авторскими блогами, сессионную аутентификацию в Redis и GraphQL API.

---

## 🛠 Технологический стек

### Frontend (`/frontend`)
* **Фреймворк:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
* **Стилизация:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Анимации:** [Motion](https://motion.dev/) (Framer Motion v12)
* **Редактор контента:** [Milkdown v7](https://milkdown.dev/) (Crepe, ProseMirror)
* **Клиент данных:** [Apollo Client v3](https://www.apollographql.com/) + [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
* **Управление состоянием:** [Zustand v5](https://zustand.docs.pmnd.rs/)
* **Формы и валидация:** React Hook Form v7, [Zod v4](https://zod.dev/)
* **Интернационализация:** [next-intl v4](https://next-intl-docs.vercel.app/) (Русский / Английский)
* **Темизация:** [next-themes](https://github.com/pacocoursey/next-themes) (Dark / Light)
* **Уведомления:** [Sonner](https://sonner.emilkowal.ski/)
* **Обработка медиа:** `react-easy-crop`

### Backend (`/backend`)
* **Фреймворк:** [NestJS 11](https://nestjs.com/) (Express платформа)
* **API Layer:** [Apollo Server 5](https://www.apollographql.com/) / NestJS GraphQL (Code-First подход)
* **База данных и ORM:** PostgreSQL + [Prisma ORM 7](https://www.prisma.io/) (`@prisma/adapter-pg`)
* **Кэширование и сессии:** [Redis v5](https://redis.io/) (`connect-redis`, `express-session`, `cookie-parser`)
* **Хранилище медиафайлов:** AWS S3 SDK v3 (`@aws-sdk/client-s3`) + [Sharp](https://sharp.pixelplumbing.com/) (оптимизация и сжатие изображений)
* **Безопасность:** [Argon2](https://github.com/ranisalt/node-argon2) (хеширование паролей)
* **Оптимизация N+1:** [DataLoader](https://github.com/graphql/dataloader) (батчинг вложенных комментариев)
* **Валидация данных:** `class-validator`, `class-transformer`

---

## 📂 Структура репозитория

```text
human-draft/
├── .github/                    # CI/CD (GitHub Actions), шаблоны задач и PR, CODEOWNERS
│   ├── workflows/ci.yml        # Автоматическая проверка линтера, типов, тестов и сборки
│   ├── ISSUE_TEMPLATE/task.yml # Форма создания задач и Sub-issues
│   ├── pull_request_template.md# Шаблон оформления Pull Request
│   └── CODEOWNERS              # Владелец репозитория (@KufuVampire)
│
├── docs/                       # Техническая документация и регламенты
│   ├── frontend-structure.md   # Детальная архитектура и структура каталогов фронтенда
│   ├── backend-structure.md    # Детальная архитектура и сервисы бэкенда
│   └── workflow/
│       └── task-workflow.md    # Регламент ведения задач, веток, коммитов и система лейблов
│
├── frontend/                   # Клиентская часть (Next.js 16)
│   ├── public/                 # Статика и словари локализации (ru.json, en.json)
│   └── src/                    # Исходный код (app, modules, shared, hooks, graphql, store)
│
└── backend/                    # Серверная часть (NestJS 11 + Prisma)
    ├── prisma/                 # Схема БД, миграции и сиды
    └── src/                    # Исходный код (modules, models, inputs, configs)
```

---

## 📋 Предварительные требования (Prerequisites)

Перед запуском убедитесь, что на компьютере установлены:
* **Node.js:** версия `20.x` или `22.x`
* **npm** (или `pnpm` / `yarn`)
* **PostgreSQL:** версия `15` или выше
* **Redis:** версия `7` или выше
* **AWS S3 бакет** (или совместимое S3-хранилище, например MinIO)

---

## 🚀 Пошаговое руководство по локальному запуску

### 1. Клонирование репозитория

```bash
git clone https://github.com/KufuVampire/human-draft.git
cd human-draft
```

---

### 2. Запуск Backend

1. Перейдите в каталог `backend`:
   ```bash
   cd backend
   ```

2. Создайте файл `.env` в папке `backend`:
   ```env
   NODE_ENV='development'

   # Настройки сервера
   APPLICATION_PORT=4000
   APPLICATION_URL='http://localhost:4000'
   ALLOWED_ORIGINS='http://localhost:3000'
   GRAPHQL_PREFIX='/graphql'

   # Секреты кук и сессий
   COOKIE_SECRET='your_super_secret_cookie_key'
   SESSION_SECRET='your_super_secret_session_key'
   SESSION_NAME='h_draft_sid'
   SESSION_DOMAIN='localhost'
   SESSION_MAX_AGE='30d'
   SESSION_HTTP_ONLY=true
   SESSION_SECURE=false
   SESSION_FOLDER='sessions:'

   # База данных PostgreSQL
   DATABASE_CLIENT='postgresql'
   DATABASE_HOST='localhost'
   DATABASE_PORT='5432'
   DATABASE_NAME='human_draft'
   DATABASE_USERNAME='postgres'
   DATABASE_PASSWORD='your_postgres_password'
   DATABASE_URL='postgresql://postgres:your_postgres_password@localhost:5432/human_draft?schema=public'

   # Redis
   REDIS_USER='default'
   REDIS_PASSWORD='your_redis_password'
   REDIS_HOST='localhost'
   REDIS_PORT='6379'

   # AWS S3 Storage
   S3_REGION='eu-north-1'
   S3_ACCESS_KEY_ID='your_s3_access_key'
   S3_SECRET_ACCESS_KEY='your_s3_secret_key'
   S3_BUCKET_NAME='human-draft-s3-bucket'
   ```

3. Установите зависимости:
   ```bash
   npm install
   ```

4. Сгенерируйте клиент Prisma и примените схему к базе данных:
   ```bash
   npm run db:gen
   npm run db:push
   ```

5. (Опционально) Наполните базу тестовыми данными (пользователи `user1`–`user10`, дефолтные теги):
   ```bash
   npm run db:seed
   ```

6. Запустите бэкенд в режиме разработки:
   ```bash
   npm run start:dev
   ```

Сервер запустится по адресу: **`http://localhost:4000`**  
GraphQL Playground / Эндпоинт: **`http://localhost:4000/graphql`**

---

### 3. Запуск Frontend

1. В отдельном терминале перейдите в каталог `frontend`:
   ```bash
   cd frontend
   ```

2. Создайте файл `.env` в папке `frontend`:
   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:4000/graphql
   NEXT_PUBLIC_SESSION_NAME=h_draft_sid
   ```

3. Установите зависимости:
   ```bash
   npm install
   ```

4. (При изменении схемы) Запустите генерацию GraphQL-типов и Apollo-хуков:
   ```bash
   npm run gql
   ```

5. Запустите фронтенд в режиме разработки:
   ```bash
   npm run dev
   ```

Клиентское приложение запустится по адресу: **`http://localhost:3000`**

---

## 📜 Основные команды (Scripts)

### Backend (`/backend`)

| Команда | Описание |
| ------- | -------- |
| `npm run start:dev` | Запуск сервера в watch-режиме (перезапуск при изменениях) |
| `npm run build` | Компиляция проекта через SWC в папку `dist` |
| `npm run start:prod` | Запуск скомпилированного продакшн-сервера |
| `npm run lint` | Проверка и автоисправление кода через ESLint |
| `npm run test` | Запуск Unit-тестов Jest |
| `npm run test:e2e` | Запуск сквозных E2E-тестов |
| `npm run db:gen` | Генерация Prisma Client (`prisma generate`) |
| `npm run db:push` | Синхронизация схемы Prisma с базой данных без миграций |
| `npm run db:seed` | Наполнение базы тестовыми данными |
| `npm run studio` | Запуск веб-интерфейса Prisma Studio для просмотра данных |

### Frontend (`/frontend`)

| Команда | Описание |
| ------- | -------- |
| `npm run dev` | Запуск Next.js в режиме разработки с Turbopack |
| `npm run build` | Продакшн-сборка приложения Next.js |
| `npm run start` | Запуск собранного продакшн-приложения |
| `npm run lint` | Проверка стилей и ошибок через ESLint |
| `npm run gql` | Генерация TypeScript типов и хуков Apollo по схеме GraphQL |

---

## 📚 Документация и регламенты

* [Архитектура Frontend](docs/frontend-structure.md) — обзор слоёв, компонентов, модулей и сторов.
* [Архитектура Backend](docs/backend-structure.md) — доменные модули NestJS, Prisma, сессии Redis, обработка медиа.
* [Task Workflow & Регламент разработки](docs/workflow/task-workflow.md) — формат задач `[STACK-MODULE-ID]`, карта эпиков, система обязательных лейблов, именование веток, Conventional Commits и Definition of Done.
* [Git Guide & Работа с ветками](docs/workflow/git-guide.md) — пошаговый цикл задачи, ветвление от `dev`, rebase, разрешение конфликтов и шпаргалка команд.
* [PR Workflow & Code Review](docs/workflow/pr-workflow.md) — оформление Pull Request, классификация комментариев (`blocking:`, `question:`, `suggestion:`, `nit:`) и критерии мержа.

---

## 👤 Автор и владелец репозитория

* **KufuVampire** ([@KufuVampire](https://github.com/KufuVampire)) — sole developer & repository owner.
