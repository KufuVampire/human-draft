# HUMAN DRAFT — Работа с Git

Практическое руководство по работе с Git в проекте **human-draft**: пошаговый цикл задачи, ветвление, правила коммитов, синхронизация и решение нештатных ситуаций.

Смежные регламенты:
* [Task Workflow & Регламент разработки](task-workflow.md)
* [PR Workflow & Code Review](pr-workflow.md)

---

## 🌳 Ветки репозитория

* **`dev`** — **основная рабочая ветка**. От неё создаются все рабочие ветки задач, и в неё направляются все Pull Request.
* **`main`** — **стабильный релизный код**. Прямая разработка в `main` запрещена. Ветка обновляется исключительно отдельным релизным PR из `dev`, когда фича или спринт полностью стабилизированы.

> ⚠️ **Важно:** При создании PR через GitHub CLI (`gh pr create`) или веб-интерфейс всегда явно указывайте базовую ветку `--base dev`.

---

## 1. Разовая настройка репозитория

```bash
git clone https://github.com/KufuVampire/human-draft.git
cd human-draft
git switch dev
```

### Настройки Git для предотвращения типовых проблем:

```bash
# Подтягивание изменений без создания лишних merge-коммитов
git config pull.rebase true

# Автоматическая настройка upstream при первом push новой ветки
git config push.autoSetupRemote true

# Запоминание и автоматическое применение разрешений конфликтов
git config rerere.enabled true

# Единый формат окончаний строк LF (критично для Windows)
git config core.autocrlf input
```

---

## 2. Цикл работы над задачей

```text
[dev] ──► [ветка задачи] ──► commits ──► rebase dev ──► PR в dev ──► Squash & Merge ──► [dev]
```

### 2.1. Взять задачу в работу

1. Выберите Issue со статусом **`Ready`** в GitHub Project.
2. Проверьте наличие критериев приёмки (Acceptance Criteria) и обязательных 4 лейблов (`stack:*`, `type:*`, `feature:*`, `module:*`).
3. Назначьте себя **Assignee** и переведите статус задачи в **`In Progress`**.

---

### 2.2. Создать ветку

Ветка создается **строго от актуальной ветки `dev`**. Создавать ветки от других незамерженных веток запрещено.

```bash
git switch dev
git pull
git switch -c <branch-name>
git push -u origin <branch-name>
```

#### Формат имени ветки:

`<prefix>/<issue-number>-<short-description>`

| Префикс | Назначение | Пример |
| ------- | ---------- | ------ |
| `feature/` | Новая функциональность | `feature/12-blog-pin-post` |
| `bugfix/` | Исправление дефекта | `bugfix/45-comment-reply-crash` |
| `refactor/` | Рефакторинг кода | `refactor/67-s3-upload-pipeline` |
| `test/` | Добавление / обновление тестов | `test/89-account-service-spec` |
| `docs/` | Обновление документации | `docs/101-git-workflow` |
| `perf/` | Оптимизация производительности | `perf/115-comments-dataloader` |
| `chore/` | Технические изменения, конфиги | `chore/120-update-dependencies` |

---

### 2.3. Создание коммитов

Делайте коммиты логически целостными шагами, соблюдая формат **Conventional Commits**:

```bash
git add <файлы>
git commit -m "<type>(<module>): <description> (#<issue-number>)"
git push
```

#### Формат сообщения:

`<type>(<module>): <description> (#<issue-number>)`

Примеры:
```text
feat(blog): add pinPostToBlog mutation (#12)
fix(comment): prevent duplicate reply creation (#45)
refactor(storage): separate sharp resizing logic (#67)
docs(workflow): add git and pr guides (#101)
```

#### Доступные типы (`type`):
`feat`, `fix`, `refactor`, `test`, `docs`, `perf`, `build`, `ci`, `chore`.

#### Допустимые модули (`module`):
`auth`, `user`, `post`, `blog`, `comment`, `tag`, `subscription`, `storage`, `ui`, `editor`, `feed`, `search`, `i18n`, `theme`, `state`, `api`, `db`, `redis`, `repo`, `infra`, `chore`.

> 💡 **Правило:** Добавляйте файлы точечно (`git add path/to/file.ts`), а не `git add .` — это исключает случайный коммит секретов, временных файлов или `.env`.

---

### 2.4. Синхронизация с `dev`

Регулярно (минимум раз в день) подтягивайте свежие изменения из `dev`:

```bash
git fetch origin
git rebase origin/dev
git push --force-with-lease
```

> **Важно:** Используйте строго `--force-with-lease`, а не `--force` — это защищает от перезаписи коммитов при совместной работе.

---

### 2.5. Открытие Pull Request

Целевая ветка PR — **всегда `dev`**.

```bash
gh pr create --base dev --title "[STACK-MODULE-ID] Краткое описание (#<issue-number>)"
```

1. Заполните все разделы шаблона из `.github/pull_request_template.md`.
2. Обязательно укажите `Closes #<issue-number>`, чтобы закрыть задачу после мержа.
3. Переведите задачу в GitHub Project: **`In Progress → In Review`**.

---

### 2.6. Внесение правок по Code Review

* Исправления вносятся в ту же ветку обычными коммитами.
* Сообщение коммита фиксирует суть правки: `fix(blog): check author permissions before pinning (#12)`.
* Запрещены бессодержательные сообщения (`fix review`, `upd`, `fixes`).
* Ответьте на все комментарии ревьюера в GitHub PR.

---

### 2.7. Merge и завершение задачи

* **Способ мержа:** **Squash and merge**. Все коммиты ветки склеиваются в один атомарный коммит в истории `dev`.
* **Формат итогового коммита:**
  ```text
  <type>(<module>): <description> (#<issue-number>)
  ```
* После мержа удалите ветку локально и на сервере:

```bash
git switch dev
git pull
git branch -d feature/12-blog-pin-post
git fetch --prune
```

---

## 3. Крупные задачи и Sub-issues

Крупные задачи не разрабатываются в долгоживущих интеграционных ветках. Они разбиваются на независимые **Sub-issues**:

```text
Feature: [EPIC-BLOG-01] Поддержка авторских пространств и закрепления статей
  ├── Sub-issue #12 [BACKEND-BLOG-01-1]: Мутация pinPostToBlog и права (ветка от dev -> dev)
  ├── Sub-issue #13 [FRONTEND-BLOG-01-2]: UI модалка выбора постов (ветка от dev -> dev)
  └── Sub-issue #14 [FRONTEND-BLOG-01-3]: Отображение постов в шапке блога (ветка от dev -> dev)
```

Каждая подзадача получает собственную короткоживущую ветку от `dev` и мержится в `dev` независимо.

---

## 4. Перемещение и переименование файлов

Переименование или перемещение файлов выполняется **строго отдельным коммитом без правок содержимого**:

```bash
git mv старый/путь.ts новый/путь.ts
git commit --no-verify -m "refactor(repo): move storage service to modules (#67)"
```

### Правила:
1. **Не смешивайте перемещение с правкой кода.** Иначе Git теряет историю и фиксирует удаление и создание нового файла.
2. **Используйте `--no-verify` только при перемещении.** Это отключает автоформатирование pre-commit хуков, способное сбить эвристику детекта переименования Git.
3. Проверьте корректность распознавания:
   ```bash
   git show --summary HEAD
   # Все строки должны начинаться с "rename ..."
   ```
4. Правку импортов и вызовов делайте **следующим отдельным коммитом**.

---

## 5. Типовые ситуации (Troubleshooting)

### Случайно закоммитил в `dev` вместо рабочей ветки (не запушено):
```bash
git branch feature/12-blog-pin-post
git reset --hard origin/dev
git switch feature/12-blog-pin-post
```

### Забыл добавить файл в последний коммит (не запушено):
```bash
git add forgotten-file.ts
git commit --amend --no-edit
```
*(Если коммит уже запушен в origin — сделайте новый коммит, не используйте amend).*

### Конфликт при выполнении `git rebase origin/dev`:
```bash
# 1. Откройте конфликтующие файлы, устраните маркеры <<<<<<< ======= >>>>>>>
# 2. Добавьте разрешенные файлы в индекс:
git add <разрешенные-файлы>

# 3. Продолжите rebase:
git rebase --continue

# Либо отмените rebase полностью при ошибке:
git rebase --abort
```

### Отложить незавершенную работу:
```bash
git stash push -u -m "WIP: blog poster upload"
# Восстановить позже:
git stash pop
```

### Случайно удалил нужные коммиты:
```bash
git reflog
# Найдите SHA коммита до удаления и восстановите:
git reset --hard <commit-sha>
```

### После переключения веток падает сборка Next.js или NestJS:
Очистите локальный кэш сборщиков и сгенерируйте клиент БД:
```bash
# Frontend (очистка кэша Turbopack / Next.js):
rm -rf frontend/.next

# Backend (перегенерация Prisma Client):
cd backend && npm run db:gen
```

---

## 6. Запреты (Чего делать нельзя)

* ❌ **Запрещено пушить напрямую в `dev` и `main`.**
* ❌ **Запрещено использовать `git push --force`** (только `--force-with-lease` и только в персональной ветке).
* ❌ **Запрещено создавать PR в `main` для рабочих задач** (только `--base dev`).
* ❌ **Запрещено коммитить `.env`, файлы секретов, сессионные данные, `dist/`, `.next/`.**
* ❌ **Запрещено объединять несколько не связанных задач в одну ветку или один PR.**
* ❌ **Запрещено держать ветку открытой дольше 3-4 дней без синхронизации с `dev`.**

---

## 7. Шпаргалка команд

```bash
# 1. Начать задачу
git switch dev && git pull
git switch -c feature/12-blog-pin-post
git push -u origin feature/12-blog-pin-post

# 2. Работа и коммиты
git add frontend/src/modules/blog/
git commit -m "feat(blog): implement pin modal (#12)"
git push

# 3. Синхронизация с dev
git fetch origin && git rebase origin/dev
git push --force-with-lease

# 4. Создание PR
gh pr create --base dev --title "[FRONTEND-BLOG-01-2] Реализовать модалку закрепления (#12)"

# 5. Очистка после merge
git switch dev && git pull
git branch -d feature/12-blog-pin-post
git fetch --prune
```
