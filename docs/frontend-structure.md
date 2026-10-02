# Структура Frontend (human-draft)

## 1. Стек технологий

* **Framework:** Next.js 16 (App Router, Turbopack)
* **Библиотека интерфейса:** React 19
* **Стилизация:** Tailwind CSS v4, `@tailwindcss/postcss`
* **Анимации:** Motion (`motion` v12, `LazyMotion`, `domAnimation`)
* **Иконки:** Lucide React (`lucide-react`)
* **Управление состоянием:** Zustand v5
* **Формы и валидация:** React Hook Form v7, Zod v4, `@hookform/resolvers`
* **GraphQL & API:** Apollo Client v3, `apollo-upload-client`, GraphQL Code Generator (`@graphql-codegen/cli`, `typescript-react-apollo`)
* **Редактор контента:** Milkdown v7 (`@milkdown/core`, `@milkdown/crepe`, `@milkdown/react`), ProseMirror (`prosemirror-model`, `prosemirror-schema-basic`, `prosemirror-schema-list`)
* **Интернационализация:** `next-intl` v4 (ru / en через куки и JSON-словари в `public/languages/`)
* **Темизация:** `next-themes` (светлая/тёмная тема, атрибут `class`)
* **Уведомления:** Sonner (`sonner`)
* **Кадрирование изображений:** `react-easy-crop`
* **Линтинг и форматирование:** ESLint 9, Prettier + `@trivago/prettier-plugin-sort-imports`

---

## 2. Структура каталогов (`frontend/src/`)

```text
frontend/
├── public/
│   ├── languages/              # Словари локализации (ru.json, en.json)
│   ├── duck.webp               # Статические ассеты (404 page duck)
│   └── ...
├── src/
│   ├── api/                    # Прямые fetch/серверные запросы
│   │   ├── fetchMe.ts          # Получение текущего профиля на SSR
│   │   ├── uploadPostImage.ts  # Загрузка изображений для контента
│   │   └── index.ts
│   │
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Группа маршрутов авторизации
│   │   │   ├── layout.tsx      # Центрированный контейнер с табами авторизации
│   │   │   ├── sign-in/        # Вход (/sign-in)
│   │   │   │   └── page.tsx
│   │   │   └── sign-up/        # Регистрация (/sign-up)
│   │   │       └── page.tsx
│   │   ├── globals.css         # Tailwind v4 импорты, CSS-переменные тем, стили Milkdown
│   │   ├── layout.tsx          # Корневой лэйаут (шрифты Ubuntu/Roboto, Apollo, i18n, Theme, Sonner)
│   │   └── not-found.tsx       # Страница 404 (кастомный UI с отладочной уточкой)
│   │
│   ├── config/                 # Конфигурационные файлы
│   │   ├── routesConfig.ts     # Централизованный маппинг путей приложения (RoutesConfig)
│   │   └── index.ts
│   │
│   ├── consts/                 # Глобальные константы
│   │   ├── api.ts              # URL бекенда/GraphQL endpoint
│   │   ├── searchParams.ts     # Ключи URL search-параметров
│   │   ├── seo.ts              # Метаданные (noIndexPage)
│   │   ├── unavailableRoutesIfNotAuth.ts # Закрытые для гостей маршруты
│   │   └── index.ts
│   │
│   ├── graphql/                # GraphQL запросы, мутации и сгенерированный клиент
│   │   ├── generated/
│   │   │   └── output.ts       # Сгенерированные типы, Apollo-хуки (useSignInMutation, etc.)
│   │   └── ...                 # .graphql / .gql исходные документы
│   │
│   ├── hooks/                  # Пользовательские React-хуки
│   │   ├── useActiveLink.ts    # Проверка активного пункта меню
│   │   ├── useBlog.ts          # Запрос и состояние отдельного блога
│   │   ├── useBlogs.ts         # Запрос списка блогов
│   │   ├── useClickOutside.ts  # Детектирование клика вне элемента (дропдауны, модалки)
│   │   ├── useCreatedAt.ts     # Форматирование даты создания
│   │   ├── useDebounce.ts      # Дебаунс значений (поиск)
│   │   ├── useInfiniteScroll.ts# Бесконечная пагинация списков
│   │   ├── useLocalStorage.ts  # Работа с localStorage
│   │   ├── usePost.ts          # Запрос и мутации конкретного поста
│   │   ├── usePosts.ts         # Запрос ленты постов с фильтрами
│   │   ├── usePostsAndBlogs.ts # Объединенная лента постов и блогов
│   │   ├── usePostsAndBlogsSearch.ts # Поиск по постам и блогам
│   │   ├── useProfile.ts       # Управление профилем пользователя
│   │   ├── useProfileAvatar.ts # Загрузка и смена аватара
│   │   ├── useProfilePoster.ts # Загрузка и смена обложки профиля
│   │   ├── useResizeObserver.ts# Наблюдение за габаритами элементов
│   │   ├── useResolvedHref.ts  # Резолв динамических ссылок
│   │   └── index.ts
│   │
│   ├── libs/                   # Интеграции сторонних сервисов
│   │   ├── apollo-client.ts    # Конфигурация Apollo Client (upload link, cache)
│   │   ├── i18n/               # Интеграция next-intl
│   │   │   ├── config.ts       # Список локалей, дефолтная локаль, имя куки
│   │   │   ├── locales.ts      # Серверные функции получения/установки локали в куках
│   │   │   └── request.ts      # getRequestConfig для next-intl
│   │   └── index.ts
│   │
│   ├── modules/                # Крупные функциональные блоки (фичи/виджеты)
│   │   ├── AuthTabLinks/       # Переключатель Sign In / Sign Up
│   │   ├── ConfirmationChangesModal/ # Модалка подтверждения несохраненных правок
│   │   ├── ConfirmationDeletionModal/# Модалка подтверждения удаления сущностей
│   │   ├── CropperModal/       # Модалка обрезки аватара/обложки (react-easy-crop)
│   │   ├── Dashboard/          # Боковая панель навигации (сворачиваемая)
│   │   ├── NeedAuthModal/      # Модалка требования авторизации для защищенных действий
│   │   ├── SignInForm/         # Форма авторизации с валидацией Zod
│   │   ├── SignUpForm/         # Форма регистрации
│   │   ├── SubscribeUnsubscribeButtons/ # Кнопки управления подпиской на автора
│   │   ├── ThemeSwitcher/      # Переключатель темы (Dark / Light)
│   │   ├── UserProfile/        # Виджет профиля пользователя в шапке (с дропдауном)
│   │   └── index.ts
│   │
│   ├── providers/              # React Context провайдеры
│   │   ├── ApolloClientProvider.tsx # Провайдер Apollo Client
│   │   ├── AuthProvider.tsx         # Синхронизация сессии пользователя со стором
│   │   ├── MilkdownProvider.tsx     # Контекст редактора Milkdown
│   │   └── index.ts
│   │
│   ├── schemas/                # Схемы валидации данных (Zod)
│   │   ├── auth.ts             # Валидация логина и регистрации
│   │   ├── blog.ts             # Создание и редактирование блога
│   │   ├── comment.ts          # Добавление/обновление комментариев
│   │   ├── homePageSearch.ts   # Фильтры главной страницы
│   │   ├── post.ts             # Создание и обновление поста
│   │   ├── search.ts           # Базовый поиск
│   │   ├── settings.ts         # Настройки профиля
│   │   ├── tags.ts             # Поиск и валидация тегов
│   │   ├── usersSearch.ts      # Поиск пользователей
│   │   └── index.ts
│   │
│   ├── shared/                 # Переиспользуемые атомарные и составные UI-компоненты
│   │   ├── BlogCard/           # Карточка блога
│   │   ├── BurgerMenu/         # Мобильное меню
│   │   ├── Button/             # Универсальная кнопка
│   │   ├── CommentItem/        # Элемент комментария с древовидными ответами
│   │   ├── CommentsList/       # Список комментариев к посту
│   │   ├── Container/          # Контейнер с адаптивными отступами
│   │   ├── CreateCommentField/ # Поле отправки комментария
│   │   ├── CreatePostBlogLinks/# Кнопки быстрого создания поста/блога
│   │   ├── CreatePostLink/     # Кнопка создания поста
│   │   ├── CustomLink/         # Стилизованная ссылка Next.js
│   │   ├── Dropdown/           # Универсальный выпадающий список
│   │   ├── DropdownList/       # Список опций дропдауна
│   │   ├── Footer/             # Подвал страницы
│   │   ├── FormField/          # Поле ввода формы с лейблом и ошибкой
│   │   ├── GoToHomeButton/     # Кнопка перехода на главную
│   │   ├── Header/             # Верхняя панель сайта
│   │   ├── LanguageSwitcher/   # Селектор языка интерфейса
│   │   ├── Loader/             # Спиннер загрузки
│   │   ├── Logo/               # Логотип HUMAN DRAFT
│   │   ├── LogoutButton/       # Кнопка выхода из системы
│   │   ├── Main/               # Семантический тег `<main>` с отступами под Header
│   │   ├── MilkdownContent/    # Рендерер скомпилированного HTML из Milkdown
│   │   ├── Modal/              # Базовый компонент модального окна
│   │   ├── Navigation/         # Меню навигации (Dashboard / Footer)
│   │   ├── PostCard/           # Карточка поста в ленте/блоге
│   │   ├── PostsAndBlogsList/  # Двухколоночный masonry-список постов и блогов
│   │   ├── Section/            # Семантическая секция
│   │   ├── Skeletons/          # Скелетоны экранов (BlogPage, ProfilePage, SettingsPage, UserAvatar)
│   │   ├── SubscribeButton/    # Кнопка «Подписаться»
│   │   ├── TagsList/           # Горизонтальный список тегов
│   │   ├── TagsPicker/         # Интерактивный компонент добавления тегов
│   │   ├── UnsubscribeButton/  # Кнопка «Отписаться»
│   │   ├── UserAvatar/         # Компонент аватара пользователя
│   │   ├── UserBadge/          # Бейдж пользователя с аватаром и никнеймом
│   │   ├── UserBadgeWithCreatedAt/ # Бейдж пользователя с датой публикации
│   │   └── index.ts
│   │
│   ├── store/                  # Клиентские хранилища состояния (Zustand)
│   │   ├── useComments.ts      # Состояние редактирования/ответов комментариев
│   │   ├── useConfirmationChangesModal.ts # Управление подтверждением изменений
│   │   ├── useConfirmationDeletionModal.ts# Управление модалкой удаления
│   │   ├── useCropperModal.ts  # Состояние модалки кадрирования аватара/обложки
│   │   ├── useNeedAuthModal.ts # Состояние модалки «Требуется авторизация»
│   │   ├── useProfile.ts       # Текущий авторизованный пользователь
│   │   ├── useSubscriptions.ts # Список подписок пользователя
│   │   └── index.ts
│   │
│   ├── types/                  # Глобальные интерфейсы и типы
│   │   ├── displayDropdownDirection.ts
│   │   ├── fields.ts
│   │   ├── linkAndButton.ts
│   │   ├── userBadgeLocation.ts
│   │   └── index.ts
│   │
│   └── utils/                  # Чистые утилитарные функции
│       ├── cn.ts               # Объединение классов clsx + tailwind-merge
│       ├── convertImageBlockToImage.ts
│       ├── convertImageToImageBlock.ts
│       ├── getCroppedImage.ts  # Canvas-генерация обрезанного изображения
│       ├── milkdownJsonToHtml.ts # Преобразование JSON схемы Milkdown в HTML
│       └── index.ts
```

---

## 3. Архитектурные соглашения

1. **Импорты через алиасы:** Все внутренние модули импортируются через алиас `@/...` (настроен в `tsconfig.json`).
2. **Barrel Exports (`index.ts`):** Каждая подпапка предоставляет единую точку входа через `index.ts`.
3. **Маршрутизация:** Все ссылки и переходы используют централизованный объект `routesConfig` из `@/config`.
4. **Связка с Backend:** Взаимодействие идет строго через GraphQL queries/mutations, сгенерированные GraphQL Codegen в `@/graphql/generated/output`.
5. **Стилизация:** Применяются утилитарные классы Tailwind CSS v4 с функцией `cn()` для слияния классов. Специфические CSS-переменные вынесены в `globals.css`.
