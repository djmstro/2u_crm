import React from 'react';
import Link from 'next/link';
import { RiArrowLeftLine, RiEdit2Line, RiCheckLine } from 'react-icons/ri';
import Navigation from '../../components/Navigation';

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  // Mock article data
  const article = {
    id: parseInt(params.id),
    title: 'Стандарты кодирования 2U Studio',
    date: '05.06.2023',
    author: 'Александр Петров',
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
    `
  };

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/articles" 
              className="flex items-center text-white/70 hover:text-white transition"
            >
              <RiArrowLeftLine className="mr-2" size={20} />
              Назад к базе знаний
            </Link>
            
            <Link 
              href={`/articles/${article.id}/edit`} 
              className="flex items-center text-primary hover:text-primary/80 transition"
            >
              <RiEdit2Line className="mr-2" size={20} />
              Редактировать
            </Link>
          </div>

          <div className="card mb-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center text-white/50 text-sm">
                <span>Автор: {article.author}</span>
                <span className="mx-2">•</span>
                <span>Дата: {article.date}</span>
              </div>
            </div>
            
            <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
          </div>
          
          <div className="mt-8">
            <button className="btn-primary flex items-center">
              <RiCheckLine className="mr-2" size={20} />
              Ознакомлен с регламентом
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 