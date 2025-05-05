#!/bin/bash
echo "🚀 Запуск pre-deploy скрипта"

# Проверка наличия переменных окружения
if [ -z "$MONGODB_URI" ]; then
  echo "❌ Ошибка: MONGODB_URI не установлен"
  exit 1
fi

# Выполняем скрипт исправления типов данных
echo "🔧 Запускаем скрипт исправления типов данных в базе..."
node scripts/fix-section-types.js

# Запускаем скрипт заполнения базы данных
echo "📊 Запускаем скрипт заполнения базы данных..."
node scripts/seed-db.js

echo "✅ Pre-deploy скрипт завершен успешно"
