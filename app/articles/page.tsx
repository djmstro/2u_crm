import React from 'react';
import Link from 'next/link';
import { RiAddLine, RiFilePaperLine, RiFolder3Line, RiSearchLine } from 'react-icons/ri';
import Navigation from '../components/Navigation';

export default function ArticlesPage() {
  // Mock data for sections and articles
  const sections = [
    { 
      id: 1, 
      name: 'Общая информация', 
      articles: [
        { id: 1, title: 'Основы работы с базой знаний', date: '15.05.2023', author: 'Елена Иванова' },
        { id: 2, title: 'Руководство для новых сотрудников', date: '20.05.2023', author: 'Елена Иванова' },
      ] 
    },
    { 
      id: 2, 
      name: 'Разработка', 
      articles: [
        { id: 3, title: 'Стандарты кодирования 2U Studio', date: '05.06.2023', author: 'Александр Петров' },
        { id: 4, title: 'Настройка рабочего окружения', date: '10.06.2023', author: 'Александр Петров' },
        { id: 5, title: 'Git Flow в нашей команде', date: '15.06.2023', author: 'Александр Петров' },
      ] 
    },
    { 
      id: 3, 
      name: 'Дизайн', 
      articles: [
        { id: 6, title: 'Руководство по стилю 2U Studio', date: '01.07.2023', author: 'Мария Сидорова' },
        { id: 7, title: 'Процесс создания UI/UX', date: '15.07.2023', author: 'Мария Сидорова' },
      ] 
    },
  ];

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">База знаний</h1>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Поиск..." 
                  className="pl-10 input-field w-64"
                />
              </div>
              
              <Link 
                href="/articles/new" 
                className="btn-primary flex items-center"
              >
                <RiAddLine className="mr-2" size={20} />
                Новая статья
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.id} className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <RiFolder3Line size={24} className="text-primary mr-3" />
                    <h2 className="text-xl font-semibold">{section.name}</h2>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="text-sm text-white/70 hover:text-white transition">
                      Редактировать
                    </button>
                    <Link 
                      href={`/sections/new?parent=${section.id}`}
                      className="text-sm text-primary hover:text-primary/80 transition"
                    >
                      + Добавить подраздел
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {section.articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10">
                        <div className="flex items-center">
                          <RiFilePaperLine size={20} className="text-primary mr-3" />
                          <div>
                            <h3 className="font-medium">{article.title}</h3>
                            <p className="text-sm text-white/50">
                              {article.author} • {article.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button className="text-sm text-white/70 hover:text-white transition">
                            Редактировать
                          </button>
                          <button className="text-sm text-white/70 hover:text-white transition">
                            Удалить
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Link 
                    href={`/articles/new?section=${section.id}`}
                    className="text-sm text-primary hover:text-primary/80 transition inline-flex items-center"
                  >
                    <RiAddLine className="mr-1" />
                    Добавить статью в раздел
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Link 
              href="/sections/new" 
              className="btn-outline inline-flex items-center"
            >
              <RiAddLine className="mr-2" size={20} />
              Создать новый раздел
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 