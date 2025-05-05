// Скрипт для первоначального заполнения базы данных
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Подключение к MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Пожалуйста, установите переменную среды MONGODB_URI');
  process.exit(1);
}

// Схемы и модели
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'reader'], default: 'reader' },
  acknowledgedArticles: { type: [String], default: [] },
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority: { type: Number, default: 0 },
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString('ru-RU') },
  section: { type: Number, required: true },
  acknowledged: { type: [String], default: [] },
});

// Данные для заполнения
const users = [
  { 
    email: 'admin@2ustudio.com', 
    password: 'admin123', 
    name: 'Александр Петров', 
    role: 'admin'
  },
  { 
    email: 'editor@2ustudio.com', 
    password: 'editor123', 
    name: 'Елена Иванова', 
    role: 'editor'
  },
  { 
    email: 'user@2ustudio.com', 
    password: 'user123', 
    name: 'Дмитрий Козлов', 
    role: 'reader'
  },
];

const sections = [
  { name: 'Общая информация', priority: 1 },
  { name: 'Разработка', priority: 2 },
  { name: 'Дизайн', priority: 3 },
];

const articles = [
  { 
    title: 'Основы работы с базой знаний', 
    content: `
      <div class="prose prose-invert max-w-none">
        <h1>Основы работы с базой знаний</h1>
        <p>В этой статье описаны основные принципы работы с базой знаний 2U Studio.</p>
        <h2>Структура базы знаний</h2>
        <p>База знаний структурирована по разделам, каждый из которых содержит статьи по определенной тематике. Разделы могут содержать подразделы для более детальной организации информации.</p>
        <h2>Поиск информации</h2>
        <p>Для поиска информации в базе знаний можно использовать:</p>
        <ul>
          <li>Навигацию по разделам</li>
          <li>Поисковую строку для поиска по ключевым словам</li>
          <li>Фильтры по тегам и авторам</li>
        </ul>
        <h2>Редактирование статей</h2>
        <p>Редактирование доступно пользователям с соответствующими правами. Для редактирования статьи нажмите на кнопку "Редактировать" на странице статьи.</p>
      </div>
    `,
    author: 'Елена Иванова',
    section: 1
  },
  { 
    title: 'Стандарты кодирования 2U Studio', 
    content: `
      <div class="prose prose-invert max-w-none">
        <h1>Стандарты кодирования 2U Studio</h1>
        
        <p>В 2U Studio мы придерживаемся определенных стандартов кодирования, чтобы обеспечить читаемость, поддерживаемость и качество нашего кода. Этот документ содержит основные правила и рекомендации для всех разработчиков.</p>
        
        <h2>Общие принципы</h2>
        
        <ul>
          <li>Код должен быть простым, понятным и хорошо документированным.</li>
          <li>Придерживайтесь принципа DRY (Don't Repeat Yourself).</li>
          <li>Следуйте принципам SOLID.</li>
          <li>Пишите автотесты для ключевой функциональности.</li>
        </ul>
      </div>
    `,
    author: 'Александр Петров',
    section: 2
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Подключено к MongoDB');
    
    // Очистка коллекций перед заполнением
    await mongoose.connection.dropCollection('users').catch(() => console.log('Коллекция users не существует'));
    await mongoose.connection.dropCollection('sections').catch(() => console.log('Коллекция sections не существует'));
    await mongoose.connection.dropCollection('articles').catch(() => console.log('Коллекция articles не существует'));
    
    // Создание моделей
    const User = mongoose.model('User', userSchema);
    const Section = mongoose.model('Section', sectionSchema);
    const Article = mongoose.model('Article', articleSchema);
    
    // Заполнение базы данных
    await User.insertMany(users);
    console.log('Пользователи добавлены');
    
    await Section.insertMany(sections);
    console.log('Разделы добавлены');
    
    await Article.insertMany(articles);
    console.log('Статьи добавлены');
    
    console.log('База данных успешно заполнена');
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Отключено от MongoDB');
  }
}

seedDatabase(); 