# Справочник кандидатов — CRUD-таблица

CRUD-приложение для управления сущностью **Applicant** (кандидат) с таблицей, пагинацией, поиском, фильтрацией, сортировкой и имитацией real-time обновлений.

## Стек технологий

- **Vue 3** — Composition API, `<script setup lang="ts">`
- **TypeScript** — строгая типизация
- **Vuetify 3** — UI-компоненты
- **Pinia** — управление состоянием
- **Vue Router** — маршрутизация
- **MSW (Mock Service Worker)** — fake API
- **Vite** — сборка

## Как запустить

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера (автоматически открывает браузер, MSW включён)
npm run dev

# Сборка (type-check + build)
npm run build

# Только проверка типов
npm run type-check
```

После `npm run dev` автоматически откроется `http://localhost:5173`.

## Скрипты

| Команда              | Описание                            |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Dev-сервер с автооткрытием браузера |
| `npm run build`      | Проверка типов + production-сборка  |
| `npm run type-check` | Только проверка типов               |
| `npm run preview`    | Просмотр production-сборки          |

## Архитектура

Проект использует **гибридную архитектуру**: общие/глобальные сущности организованы по типам (core/shared), а бизнес-фичи — по модулям (modules).

```
src/
├── core/                                   # Ядро приложения
│   ├── components/
│   │   ├── App.vue                         # Корневой компонент приложения
│   │   ├── AppLayout.vue                   # Layout с шапкой и сайдбаром
│   │   └── AppSnackbar.vue                 # Глобальный snackbar
│   ├── pages/
│   │   └── NotFoundPage.vue                # Страница ошибки 404
│   └── stores/
│       ├── globalStore.ts                  # Глобальный store (тема, сайдбар)
│       └── snackbarStore.ts                # Pinia store для уведомлений
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
│   └── index.ts                            # Vue Router + 404 handler
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

## Принятые решения

### Пагинация — серверная

Используется `v-data-table-server` с обработкой на стороне MSW. Это позволяет:

- Загружать только данные текущей страницы
- Легко перейти на реальный API без изменений в компонентах
- Масштабироваться на любое количество записей

### Store — нормализованные данные + разделение ответственности

**Store** хранит только данные (`entities: Record<number, Applicant>` + `ids: number[]`) и CRUD-операции. **Composable** `useApplicants()` управляет параметрами запроса (`pagination`, `search`, `filters`, `sortBy`) и автоматической перезагрузкой через `watch`.

Преимущества нормализации:

- Исключает дубликаты
- Упрощает обновление отдельных записей
- Позволяет быстро находить по ID

Преимущества разделения:

- Store переиспользуем без composable
- Composable легко тестируется
- Чёткая граница ответственности

### Единый API-клиент

Все HTTP-запросы проходят через `apiClient` (`src/shared/api/client.ts`):

- Централизованная обработка ошибок (`ApiError` с status code)
- Единый `Content-Type: application/json`
- Автоматический парсинг JSON
- Поддержка 204 No Content

### Real-time обновления (DEV only)

`useRealtimeMock` имитирует live-обновления:

- Каждые 5 секунд случайно меняется статус кандидата
- Работает только при `import.meta.env.DEV`

### Поиск с debounce

Кастомный composable `useDebounce`:

- Задержка 300мс
- Автоматическая очистка таймера при размонтировании (`onUnmounted`)
- Метод `flush()` для принудительного сброса

### Обработка ошибок маршрутизации

- Страница 404 (`NotFoundPage.vue`) для несуществующих URL
- Заголовок страницы формируется как `«Название» — Справочники`

## Что можно улучшить

1. **Синхронизация с URL** — параметры `page`, `search`, `status`, `sortBy` в query string для возможности поделиться ссылкой
2. **Zod** — runtime-валидация DTO с автогенерацией TypeScript типов
3. **Тесты** — Vitest для store/actions, Vue Test Utils для компонентов
4. **Code splitting** — разделение чанков Vuetify для уменьшения размера bundle (сейчас >500KB)
5. **Фильтрация по статусу** — UI для фильтра уже есть в store, осталось добавить в таблицу
