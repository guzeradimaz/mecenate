# Mecenate — Feed Screen

Тестовое задание: лента публикаций для платформы Mecenate (аналог Patreon/Boosty).

## Стек

- **React Native + Expo** (SDK 54)
- **TypeScript**
- **MobX** — оптимистичное управление лайками
- **React Query** — загрузка и кэширование ленты
- **React Navigation (Native Stack)** — навигация между экранами
- **Axios** — HTTP-клиент

## Функциональность

- Список постов: аватар автора, имя, обложка, превью текста, счётчики лайков и комментариев
- Курсорная пагинация — подгрузка при скролле вниз
- Pull-to-refresh
- Скелетон при первой загрузке
- Закрытые посты (`tier: "paid"`) — заглушка вместо текста + кнопка поддержки
- Оптимистичный тоггл лайка (MobX + мутация, с откатом при ошибке)
- Экран ошибки с кнопкой повтора
- Детальный экран поста (открывается по тапу на карточку)

## Запуск

### Требования

- Node.js 18+
- Приложение **Expo Go** на телефоне (iOS/Android)

### Установка

```bash
git clone <repo-url>
cd mecenate
npm install
```

### Запуск через Expo Go

```bash
npx expo start
```

Отсканируйте QR-код в терминале приложением **Expo Go**.

### Запуск на эмуляторе / устройстве (dev build)

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Переменные окружения

Приложение не требует `.env` — конфигурация API хранится в `src/api/client.ts`.

```
BASE_URL: https://k8s.mectest.ru/test-app
AUTH:     Bearer 550e8400-e29b-41d4-a716-446655440000
```

> Любой валидный UUID принимается как токен авторизации согласно документации API.

## Структура проекта

```
src/
├── api/
│   ├── client.ts          # Axios instance + base URL
│   └── posts.ts           # fetchFeed, fetchPost, toggleLike
├── components/
│   ├── Avatar.tsx          # Аватар с fallback на инициалы
│   ├── PostCard.tsx        # Карточка поста (мемоизирована)
│   └── PostCardSkeleton.tsx # Скелетон-заглушка при загрузке
├── hooks/
│   └── useFeed.ts          # React Query infinite query
├── navigation/
│   └── types.ts            # Типы навигации (RootStackParamList)
├── screens/
│   ├── FeedScreen.tsx      # Лента публикаций
│   └── PostDetailScreen.tsx # Детальный экран поста
├── store/
│   └── FeedStore.ts        # MobX store для лайков
├── tokens/
│   └── index.ts            # Дизайн-токены (цвета, отступы, типографика)
└── types/
    └── index.ts            # TypeScript типы (Post, Author, FeedResponse…)
```
