# 📚 TextbookManager

Мобильное приложение для скачивания и удобного управления учебниками на планшетах и телефонах.

## Возможности

- **Библиотека** — все учебники в одном месте, поиск по названию, автору, предмету
- **Скачивание по URL** — вставь ссылку на PDF/EPUB и скачай прямо в приложение
- **Импорт с устройства** — подхвати файл из памяти телефона
- **Встроенная читалка PDF** — листать прямо в приложении, прогресс сохраняется
- **Информация о книге** — класс, предмет, год, размер файла, дата добавления
- **Поделиться** — отправить файл в другое приложение
- **Настройки** — тема (светлая / тёмная / системная), размер шрифта, не гасить экран

## Стек

| Слой | Технология |
|------|-----------|
| Фреймворк | React Native + Expo |
| Навигация | React Navigation 6 (Stack + BottomTabs) |
| Хранилище | Redux Toolkit + redux-persist + AsyncStorage |
| Файловая система | expo-file-system |
| Читалка PDF | react-native-pdf |
| Импорт файлов | expo-document-picker |
| Sharing | expo-sharing |
| Язык | TypeScript |

## Структура проекта

```
textbook-manager/
├── App.tsx                   # точка входа
├── app.json                  # конфиг Expo
├── src/
│   ├── types.ts              # глобальные типы
│   ├── store/
│   │   ├── index.ts          # Redux store + persist
│   │   ├── librarySlice.ts   # список учебников
│   │   ├── downloadsSlice.ts # прогресс загрузок
│   │   └── settingsSlice.ts  # настройки
│   ├── navigation/
│   │   ├── RootNavigator.tsx # Stack: Tabs / Reader / BookDetail / AddBook
│   │   └── TabNavigator.tsx  # Bottom tabs
│   └── screens/
│       ├── LibraryScreen.tsx    # список + поиск
│       ├── AddBookScreen.tsx    # добавить файл / скачать по URL
│       ├── BookDetailScreen.tsx # детали + удалить + поделиться
│       ├── ReaderScreen.tsx     # читалка PDF
│       ├── DownloadsScreen.tsx  # прогресс загрузок
│       └── SettingsScreen.tsx   # настройки
```

## Запуск

```bash
npm install
npx expo start
```

Открыть на устройстве через приложение **Expo Go**, или:
```bash
npx expo start --android
npx expo start --ios
```

## Roadmap

- [ ] Поддержка EPUB (WebView-ридер)
- [ ] Категории и теги для фильтрации
- [ ] Облачная синхронизация (Google Drive / Яндекс.Диск)
- [ ] Закладки и заметки
- [ ] Оффлайн-режим с кешем обложек
- [ ] Поиск по каталогу открытых учебников (ЭФУ, ЛитРес и др.)
