# Структура Backend (human-draft)

## 1. Стек технологий

* **Framework:** NestJS 11 (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`)
* **API Layer:** GraphQL (Code-First), `@nestjs/graphql`, `@nestjs/apollo`, Apollo Server 5 (`@apollo/server`, `@as-integrations/express5`)
* **Загрузка файлов в GraphQL:** `graphql-upload-ts`, `graphqlUploadExpress`
* **База данных и ORM:** PostgreSQL, Prisma ORM 7 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`)
* **Кэширование и сессии:** Redis (`redis` v5), `connect-redis`, `express-session`, `cookie-parser`
* **Хранилище объектов:** AWS S3 SDK v3 (`@aws-sdk/client-s3`), обработка изображений `sharp`
* **Безопасность и хеширование:** `argon2` (хеширование паролей пользователей)
* **Валидация данных:** `class-validator`, `class-transformer`, глобальный `ValidationPipe`
* **Оптимизация N+1:** `dataloader` (`CommentsLoader`)
* **Сборка и компиляция:** SWC (`@swc/cli`, `@swc/core`), TypeScript 5.7+
* **Тестирование:** Jest, Supertest, ts-jest

---

## 2. Архитектура приложения

Приложение построено по модульной структуре NestJS с Code-First подходом для GraphQL.
Авторизация реализована на основе HTTP-only cookie-сессий, которые сохраняются в Redis через `connect-redis` и связываются с GraphQL контекстом (`IGQLContext`).

```text
HTTP Request (GraphQL Query / Mutation / File Upload)
  │
  ▼
cookieParser & session middleware (Redis Store)
  │
  ▼
ValidationPipe (class-validator) & FileValidationPipe
  │
  ▼
NestJS Resolvers / Guards (@Auth, @Authorized)
  │
  ▼
Domain Services (Account, User, Post, Blog, Comment, Tag, etc.)
  │
  ├──► PrismaService (PostgreSQL via @prisma/adapter-pg)
  ├──► RedisService (Кэш / Сессии)
  ├──► AwsStorageService (S3 Bucket + Sharp Optimization)
  └──► DataLoader (CommentsLoader batching)
```

---

## 3. Структура каталогов (`backend/`)

```text
backend/
├── prisma/
│   ├── generated/              # Сгенерированный Prisma Client
│   ├── migrations/             # SQL-миграции базы данных
│   ├── schema.prisma           # Конфигурация генератора и источника данных
│   └── seed.ts                 # Сиды для заполнения БД (пользователи user1-user10, дефолтные теги)
│
├── prisma.config.ts            # Конфигурация Prisma 7 (путь к схеме, миграциям, seed команде)
│
├── src/
│   ├── app.module.ts           # Корневой модуль приложения (подключение Config, GraphQL, доменных модулей)
│   ├── main.ts                 # Точка входа: инициализация NestFactory, CORS, cookies, сессий в Redis, pipes
│   │
│   ├── configs/                # Конфигураторы NestJS модулей
│   │   ├── graphql.config.ts   # Фабрика настроек GraphQL (ApolloDriver, playground, context, upload)
│   │   └── index.ts
│   │
│   ├── consts/                 # Глобальные константы
│   │   ├── file.ts             # Лимиты размера файлов (MAX_FILE_SIZE)
│   │   ├── searchParamsValues.ts # Дефолтные значения пагинации (PAGE, PER_PAGE)
│   │   └── index.ts
│   │
│   ├── decorators/             # Кастомные декораторы параметров и методов
│   │   ├── auth.decorator.ts   # @Auth() — защита эндпоинтов авторизацией
│   │   ├── authorized.decorator.ts # @Authorized('id') — извлечение текущего пользователя из сессии
│   │   └── index.ts
│   │
│   ├── guards/                 # Гарды авторизации
│   │   └── ...                 # Проверка валидности сессии в контексте
│   │
│   ├── inputs/                 # GraphQL Input DTO (валидация class-validator)
│   │   ├── createBlog.input.ts
│   │   ├── createPost.input.ts
│   │   ├── filtersInput.ts
│   │   ├── searchParams.input.ts
│   │   ├── signIn.input.ts
│   │   ├── signUp.input.ts
│   │   ├── updateBlog.input.ts
│   │   ├── updatePost.input.ts
│   │   ├── updatePostOrBlogTags.input.ts
│   │   ├── updateUser.input.ts
│   │   └── index.ts
│   │
│   ├── models/                 # GraphQL Object Types (схемы возвращаемых данных)
│   │   ├── blog.model.ts
│   │   ├── blogPagination.model.ts
│   │   ├── comment.model.ts
│   │   ├── post.model.ts
│   │   ├── postDeleteResponse.model.ts
│   │   ├── postPagination.model.ts
│   │   ├── subscription.model.ts
│   │   ├── subscriptionId.model.ts
│   │   ├── tag.model.ts
│   │   ├── unpinResponse.model.ts
│   │   ├── uploadPostImage.model.ts
│   │   ├── user.model.ts
│   │   ├── userPagination.model.ts
│   │   └── index.ts
│   │
│   ├── modules/                # Доменные модули системы
│   │   │
│   │   ├── auth/
│   │   │   ├── account/        # Управление аккаунтом
│   │   │   │   ├── account.module.ts
│   │   │   │   ├── account.resolver.ts # signUp, signIn, signOut, userProfile, change/remove avatar/poster
│   │   │   │   └── account.service.ts  # Логика регистрации, проверки пароля Argon2, работа с сессией
│   │   │   └── session/        # Сессии пользователей
│   │   │       ├── session.module.ts
│   │   │       └── session.service.ts  # Управление записями сессий
│   │   │
│   │   ├── aws-storage/        # Работа с хранилищем S3 и оптимизацией картинок
│   │   │   ├── aws-storage.module.ts
│   │   │   ├── aws-storage.resolver.ts # uploadImage mutation
│   │   │   └── aws-storage.service.ts  # Загрузка в S3 бакет, ресайз и сжатие через Sharp
│   │   │
│   │   ├── blog/               # Управление блогами
│   │   │   ├── blog.module.ts
│   │   │   ├── blog.resolver.ts        # CRUD блогов, пин/анпин постов, постеры, пагинация
│   │   │   └── blog.service.ts
│   │   │
│   │   ├── comment/            # Комментарии к публикациям
│   │   │   ├── dataloader/
│   │   │   │   └── CommentsLoader.ts   # Батчинг ответов на комментарии для исключения N+1
│   │   │   ├── comment.module.ts
│   │   │   ├── comment.resolver.ts     # create, update, delete, replies, allPostComments
│   │   │   └── comment.service.ts
│   │   │
│   │   ├── post/               # Публикации и статьи
│   │   │   ├── post.module.ts
│   │   │   ├── post.resolver.ts        # create, update, delete, pinPostToBlog, пагинация, поиск
│   │   │   └── post.service.ts
│   │   │
│   │   ├── prisma/             # Сервис доступа к БД
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts       # Наследование от PrismaClient с адаптером PrismaPg
│   │   │
│   │   ├── redis/              # Клиент Redis
│   │   │   ├── redis.module.ts
│   │   │   └── redis.service.ts        # Подключение и методы работы с Redis
│   │   │
│   │   ├── subscription/       # Подписки на пользователей
│   │   │   ├── subscription.module.ts
│   │   │   ├── subscription.resolver.ts# subscribeToUser, unsubscribeFromUser
│   │   │   └── subscription.service.ts
│   │   │
│   │   ├── tag/                # Тегирование постов и блогов
│   │   │   ├── tag.module.ts
│   │   │   ├── tag.resolver.ts         # create, delete, updateTags, findTagsBySearchString
│   │   │   └── tag.service.ts
│   │   │
│   │   ├── user/               # Пользователи системы
│   │   │   ├── user.module.ts
│   │   │   ├── user.resolver.ts
│   │   │   └── user.service.ts         # findByUsername, findById, findByFields, updateUser, getAllUsers
│   │   │
│   │   └── index.ts            # Реэкспорт публичных модулей и сервисов
│   │
│   ├── pipes/                  # NestJS Pipes
│   │   ├── fileValidation.pipe.ts # Валидация mime-типа и размера загружаемых файлов
│   │   └── index.ts
│   │
│   ├── types/                  # Внутренние типы и интерфейсы
│   │   ├── gqlContext.ts       # Интерфейс GraphQL-контекста с объектом Express Request/Response
│   │   ├── updateUserModel.ts
│   │   └── index.ts
│   │
│   └── utils/                  # Вспомогательные утилиты
│       ├── file.util.ts        # Валидация формата и размера файлов
│       ├── isDev.util.ts       # Проверка окружения разработки
│       ├── ms.ts               # Парсер интервалов времени в миллисекунды
│       ├── normalizeTagName.ts # Нормализация тегов
│       ├── parse-boolean.util.ts
│       └── index.ts
```

---

## 4. Соглашения по разработке

1. **Code-First GraphQL:** Схема генерируется на лету из декораторов `@Resolver`, `@Query`, `@Mutation`, `@Field`.
2. **DTO и валидация:** Все входящие аргументы типизируются с `@InputType()` и валидируются аннотациями `class-validator`.
3. **Безопасность сессий:** Сессии хранятся в Redis с префиксом из конфига, кука отдается с флагами `httpOnly`, `sameSite: 'lax'`, `secure` (в проде).
4. **Хранение медиа:** Файлы не сохраняются на локальный диск; загрузка и трансформация через Sharp выполняется в памяти стримами и направляется в AWS S3.
5. **Предотвращение N+1:** Вложенные резолверы со связями «один-ко-многим» (например, иерархия комментариев) используют `DataLoader`.
