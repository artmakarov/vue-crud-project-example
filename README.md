# Справочник кандидатов

CRUD-приложение на Vue 3 для управления сущностью **Applicant**: таблица, серверная пагинация, поиск, фильтрация, сортировка, CRUD-операции и имитация real-time обновлений в DEV.

## Стек технологий

- **Vue 3** — Composition API, `<script setup lang="ts">`
- **TypeScript** — строгая типизация
- **Vuetify 3** — UI-компоненты
- **Pinia** — управление состоянием
- **Vue Router** — маршрутизация
- **MSW (Mock Service Worker)** — fake API
- **Vite** — сборка

## Быстрый старт

```bash
npm install
npm run dev
```

Приложение автоматически откроется на `http://localhost:5173`.

## Скрипты

| Команда | Описание |
| --- | --- |
| `npm run dev` | Запуск dev-сервера (`vite --open`) |
| `npm run build` | Type-check + production-сборка |
| `npm run preview` | Локальный просмотр production-сборки |
| `npm run type-check` | Только проверка типов |
| `npm run lint:check` | Проверка ESLint без исправлений |
| `npm run lint` | ESLint с автоисправлением |
| `npm run format:check` | Проверка форматирования Prettier |
| `npm run format` | Форматирование Prettier |

## Архитектура

Проект использует **гибридную архитектуру**: общие/глобальные сущности организованы по типам (core/shared), а бизнес-фичи — по модулям (modules):

- модули автоматически обнаруживаются через `import.meta.glob('@/modules/*/index.ts')`
- каждый модуль реализует контракт `IModule`:
  - `id`
  - `getRoutes()`
  - `getNavItems()`
  - `install?(app)`
- `modulesStore` загружает модули, вызывает `install`, собирает маршруты и пункты меню
- роутер регистрирует маршруты динамически через `registerRoutes(...)`
- маршрут `/` редиректит на первый доступный модульный route, либо на `Forbidden`

## Текущая структура проекта

```text
src/
├── core/                                   # Ядро приложения
│   ├── components/
│   │   ├── App.vue                         # Корневой компонент приложения
│   │   ├── AppLayout.vue                   # Layout с шапкой и сайдбаром
│   │   └── AppSnackbar.vue                 # Глобальный snackbar
│   ├── pages/
│   │   ├── ForbiddenPage.vue               # Страница ошибки 403
│   │   └── NotFoundPage.vue                # Страница ошибки 404
│   ├── stores/
│   │   ├── globalStore.ts                  # Глобальный store (тема, сайдбар)
│   │   ├── modulesStore.ts                 # Pinia store для модулей приложения
│   │   └── snackbarStore.ts                # Pinia store для уведомлений
│   └── types/
│       └── module.ts                       # Модель модуля приложения
│
├── modules/                                # Бизнес-фичи
│   └── applicants/                         # Модуль «Справочник кандидатов»
│       ├── api/
│       │   └── applicants/
│       │       ├── getApplicants.ts        # Получить список с пагинацией
│       │       ├── createApplicant.ts      # Создать кандидата
│       │       ├── updateApplicant.ts      # Обновить кандидата
│       │       └── deleteApplicant.ts      # Удалить кандидата
│       ├── components/
│       │   ├── ApplicantTable.vue          # Таблица с пагинацией/поиском
│       │   ├── ApplicantFormDialog.vue     # Диалог создания/редактирования
│       │   └── ApplicantStatusChip.vue     # Чип статуса
│       ├── composables/
│       │   ├── useApplicants.ts            # Параметры запроса + CRUD-обёртки
│       │   └── useRealtimeMock.ts          # Real-time имитация (setInterval)
│       ├── constants/
│       │   └── statusLabels.ts             # Опции статусов
│       ├── pages/
│       │   └── ApplicantsPage.vue          # Страница с диалогами
│       ├── routes/
│       │   └── index.ts                    # Маршруты модуля
│       ├── stores/
│       │   └── applicantsStore.ts          # Pinia store (нормализованные данные)
│       ├── types/
│       │   └── applicant.ts                # Типы модуля кандидатов
│       ├── utils/
│       │   └── formatters.ts               # Форматирование данных модуля
│       └── index.ts                        # Публичный API модуля
│
├── shared/                                 # Общие ресурсы
│   ├── api/
│   │   └── client.ts                       # Единый API-клиент с обработкой ошибок
│   ├── components/
│   │   ├── ConfirmDialog.vue               # Универсальный диалог подтверждения
│   │   └── EmptyState.vue                  # Универсальное пустое состояние
│   ├── composables/
│   │   └── useDebounce.ts                  # Debounce composable
│   ├── types/
│   │   ├── responses.ts                    # TypeScript типы (DTO, API responses)
│   │   └── sorting.ts                      # Типы сортировки
│   └── utils/
│       ├── validators.ts                   # Правила валидации
│       └── formatters.ts                   # Форматирование дат/статусов
│
├── mocks/                                  # MSW mock-сервис (только DEV)
│   ├── db/
│   │   └── applicants.ts                   # In-memory база данных кандидатов
│   ├── handlers/
│   │   ├── applicants.ts                   # Обработчики API кандидатов
│   │   └── index.ts                        # Агрегатор handlers
│   └── browser.ts                          # Инициализация Service Worker
│
├── plugins/                                # Плагины
│   └── vuetify.ts                          # Конфигурация Vuetify
│
├── router/                                 # Маршрутизация
│   └── index.ts                            # Vue Router + Error handlers + registerRoutes(...)
│
└── main.ts                                 # Точка входа приложения
```

**Правило зависимостей:**

- `modules/` → `shared/` ✅
- `modules/` → `core/` ✅
- `core/` → `shared/` ✅
- `core/` → `modules/` ❌ (ядро не знает о фичах)
- `shared/` → `core/` ❌ (общее не зависит от ядра)
- `shared/` → `modules/` ❌ (общее не зависит от фич)

## Данные и API

- В DEV включается MSW (`src/main.ts`) и поднимается in-memory база кандидатов
- Все HTTP-запросы идут через `apiClient` (`src/shared/api/client.ts`)
- Серверная пагинация (`v-data-table-server` + API параметризация)
- Real-time имитация обновления данных (`useRealtimeMock`) работает только в DEV

## Контроль качества

- `husky` + `lint-staged` на `pre-commit`
- Для `*.{ts,tsx,vue}` запускаются:
  - `npm run lint`
  - `npm run format`

## Дальнейшие улучшения

1. **Синхронизация с URL** — параметры `page`, `search`, `status`, `sortBy` в query string для возможности поделиться ссылкой
2. **Zod** — runtime-валидация DTO с автогенерацией TypeScript типов
3. **Тесты** — Vitest для store/actions, Vue Test Utils для компонентов
4. **Code splitting** — разделение чанков Vuetify для уменьшения размера bundle (сейчас >500KB)
