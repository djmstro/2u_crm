// Скрипт для исправления типов данных в коллекциях MongoDB
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Подключение к MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ Пожалуйста, установите переменную среды MONGODB_URI');
  process.exit(1);
}

// Схемы и модели
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: String,
  section: Number,
  acknowledged: [String],
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
});

const sectionSchema = new mongoose.Schema({
  name: String,
  priority: Number,
  parentId: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date
});

async function fixDatabaseTypes() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Подключено к MongoDB');
    
    // Создание моделей
    const Article = mongoose.model('Article', articleSchema);
    const Section = mongoose.model('Section', sectionSchema);
    
    // Получаем все статьи
    const articles = await Article.find({});
    console.log(`📊 Найдено ${articles.length} статей`);
    
    // Исправляем типы данных для поля section
    let fixedArticles = 0;
    for (const article of articles) {
      const originalType = typeof article.section;
      
      // Если section не число, конвертируем его в число
      if (originalType !== 'number') {
        console.log(`🔄 Исправление типа для статьи "${article.title}": ${article.section} (${originalType}) -> ${Number(article.section)}`);
        
        article.section = Number(article.section);
        await article.save();
        fixedArticles++;
      }
    }
    
    // Получаем все разделы
    const sections = await Section.find({});
    console.log(`📊 Найдено ${sections.length} разделов`);
    
    // Исправляем типы данных для поля priority
    let fixedSections = 0;
    for (const section of sections) {
      const originalType = typeof section.priority;
      
      // Если priority не число, конвертируем его в число
      if (originalType !== 'number') {
        console.log(`🔄 Исправление типа для раздела "${section.name}": ${section.priority} (${originalType}) -> ${Number(section.priority)}`);
        
        section.priority = Number(section.priority);
        await section.save();
        fixedSections++;
      }
    }
    
    console.log(`✅ Исправлено ${fixedArticles} статей и ${fixedSections} разделов`);
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении типов данных:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Отключено от MongoDB');
  }
}

// Запуск функции
fixDatabaseTypes(); 