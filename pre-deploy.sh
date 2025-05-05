#!/bin/bash
echo "Запуск pre-deploy скрипта"
echo "Запускаем скрипт заполнения базы данных..."
node scripts/seed-db.js
echo "Pre-deploy скрипт завершен"
