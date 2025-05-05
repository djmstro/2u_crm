import { NextResponse } from 'next/server';
import { Article, IArticle } from '../../../lib/models/article';
import mongoose from 'mongoose';

// Подключение к MongoDB при первом запросе
const mongoConnect = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
  } catch (error) {
    console.error('Ошибка при подключении к MongoDB:', error);
    throw error;
  }
};

// Mock data for articles
const articles = [
  { 
    id: 1, 
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
    date: '15.05.2023', 
    author: 'Елена Иванова',
    section: 1
  },
  { 
    id: 2, 
    title: 'Руководство для новых сотрудников', 
    content: `
      <div class="prose prose-invert max-w-none">
        <h1>Руководство для новых сотрудников</h1>
        <p>Добро пожаловать в 2U Studio! Этот документ поможет вам быстрее адаптироваться в компании.</p>
        <h2>Первые шаги</h2>
        <p>В первый рабочий день вам необходимо:</p>
        <ol>
          <li>Получить доступ к корпоративной почте</li>
          <li>Познакомиться с командой</li>
          <li>Настроить рабочее окружение</li>
        </ol>
        <h2>Корпоративная культура</h2>
        <p>В 2U Studio мы ценим:</p>
        <ul>
          <li>Открытость и честность</li>
          <li>Взаимоуважение</li>
          <li>Профессиональное развитие</li>
          <li>Баланс работы и личной жизни</li>
        </ul>
        <h2>Рабочие процессы</h2>
        <p>Основные инструменты, которые мы используем в работе:</p>
        <ul>
          <li>Jira для управления задачами</li>
          <li>Slack для коммуникации</li>
          <li>Git для контроля версий</li>
          <li>Google Workspace для документов и таблиц</li>
        </ul>
      </div>
    `,
    date: '20.05.2023', 
    author: 'Елена Иванова',
    section: 1
  },
  { 
    id: 3, 
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
        
        <h2>Форматирование кода</h2>
        
        <ul>
          <li>Используйте 2 пробела для отступов.</li>
          <li>Максимальная длина строки: 100 символов.</li>
          <li>Используйте camelCase для переменных и функций.</li>
          <li>Используйте PascalCase для классов и компонентов.</li>
          <li>Используйте UPPER_CASE для констант.</li>
        </ul>
        
        <h2>Комментарии</h2>
        
        <ul>
          <li>Комментарии должны объяснять "почему", а не "что".</li>
          <li>Используйте JSDoc для документирования функций и классов.</li>
          <li>Поддерживайте комментарии актуальными при изменении кода.</li>
        </ul>
        
        <h2>Обработка ошибок</h2>
        
        <ul>
          <li>Всегда обрабатывайте возможные ошибки.</li>
          <li>Используйте try-catch блоки для обработки исключений.</li>
          <li>Логируйте ошибки с достаточным контекстом для отладки.</li>
        </ul>
        
        <h3>Пример правильного кода</h3>
        
        <pre><code>
// Хороший пример
function calculateTotal(items) {
  if (!items || !items.length) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}
        </code></pre>
        
        <h3>Пример неправильного кода</h3>
        
        <pre><code>
// Плохой пример
function calc(i) {
  let t = 0;
  for (let x = 0; x < i.length; x++) {
    t += i[x].p * i[x].q;
  }
  return t;
}
        </code></pre>
        
        <h2>Контроль версий</h2>
        
        <ul>
          <li>Используйте Git для контроля версий.</li>
          <li>Создавайте отдельные ветки для каждой задачи.</li>
          <li>Пишите осмысленные сообщения коммитов.</li>
          <li>Регулярно выполняйте pull из основной ветки.</li>
        </ul>
        
        <p>Следование этим стандартам поможет нам создавать качественное программное обеспечение и упростит совместную работу над проектами.</p>
      </div>
    `,
    date: '05.06.2023', 
    author: 'Александр Петров',
    section: 2
  },
];

// Mock data for sections
const sections = [
  { id: 1, name: 'Общая информация', priority: 1 },
  { id: 2, name: 'Разработка', priority: 2 },
  { id: 3, name: 'Дизайн', priority: 3 },
];

export async function GET(request: Request) {
  try {
    await mongoConnect();
    
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section');
    const articleId = searchParams.get('id');
    
    // Вернуть конкретную статью, если указан ID
    if (articleId) {
      const article = await Article.findById(articleId);
      if (article) {
        return NextResponse.json(article);
      } else {
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
      }
    }
    
    // Фильтровать по разделу, если указан ID раздела
    if (sectionId) {
      const articles = await Article.find({ section: parseInt(sectionId) });
      return NextResponse.json(articles);
    }
    
    // Вернуть все статьи
    const articles = await Article.find({});
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Ошибка при получении статей:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении статей' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { title, content, section, author } = body;
    
    // Простая валидация
    if (!title || !content || !section) {
      return NextResponse.json(
        { error: 'Заголовок, содержание и раздел обязательны' },
        { status: 400 }
      );
    }
    
    // Создание новой статьи
    const newArticle = new Article({
      title,
      content,
      section: parseInt(section),
      author: author || 'Текущий пользователь', // В реальном приложении это будет текущий пользователь
      date: new Date().toLocaleDateString('ru-RU'),
    });
    
    // Сохранение статьи в базе данных
    await newArticle.save();
    
    // Возврат новой статьи
    return NextResponse.json(newArticle);
  } catch (error) {
    console.error('Ошибка при создании статьи:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании статьи' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { id, title, content, section } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID статьи обязателен' },
        { status: 400 }
      );
    }
    
    // Обновление статьи
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { 
        ...(title && { title }),
        ...(content && { content }),
        ...(section && { section: parseInt(section) }),
      },
      { new: true } // Возвращает обновленный документ
    );
    
    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Статья не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Ошибка при обновлении статьи:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении статьи' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await mongoConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID статьи обязателен' },
        { status: 400 }
      );
    }
    
    // Удаление статьи
    const deletedArticle = await Article.findByIdAndDelete(id);
    
    if (!deletedArticle) {
      return NextResponse.json(
        { error: 'Статья не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Статья успешно удалена',
      id 
    });
  } catch (error) {
    console.error('Ошибка при удалении статьи:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении статьи' },
      { status: 500 }
    );
  }
} 