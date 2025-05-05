import React from 'react';
import Link from 'next/link';
import { RiAddLine, RiFilePaperLine, RiFolder3Line, RiSearchLine, RiEdit2Line } from 'react-icons/ri';
import Navigation from '../components/Navigation';
import DeleteArticleButton from '../components/DeleteArticleButton';
import DeleteSectionButton from '../components/DeleteSectionButton';

// Интерфейсы для типизации данных
interface Article {
  _id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  section: number;
}

interface Section {
  _id: string;
  name: string;
  priority: number;
  articles?: Article[];
}

// Функция для загрузки разделов
async function getSections() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/sections`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Не удалось загрузить разделы');
    }
    
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке разделов:', error);
    return [];
  }
}

// Функция для загрузки статей
async function getArticles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/articles`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Не удалось загрузить статьи');
    }
    
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке статей:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  // Загружаем данные
  const [sectionsData, articlesData] = await Promise.all([
    getSections(),
    getArticles(),
  ]);

  // Группируем статьи по разделам
  const sections: Section[] = sectionsData.map((section: Section) => {
    const sectionArticles = articlesData.filter((article: Article) => 
      article.section === section.priority
    );
    return {
      ...section,
      articles: sectionArticles,
    };
  });

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

          {sections.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-lg mb-4">База знаний пуста</p>
              <Link 
                href="/sections/new" 
                className="btn-primary inline-flex items-center mr-4"
              >
                <RiAddLine className="mr-2" size={20} />
                Создать раздел
              </Link>
              <Link 
                href="/articles/new" 
                className="btn-outline inline-flex items-center"
              >
                <RiAddLine className="mr-2" size={20} />
                Создать статью
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section._id} className="card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <RiFolder3Line size={24} className="text-primary mr-3" />
                      <h2 className="text-xl font-semibold">{section.name}</h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/sections/${section._id}/edit`}
                        className="flex items-center text-sm text-white/70 hover:text-white transition"
                      >
                        <RiEdit2Line className="mr-1" size={16} />
                        Редактировать
                      </Link>
                      <DeleteSectionButton 
                        sectionId={section._id} 
                        buttonText="Удалить раздел"
                      />
                      <Link 
                        href={`/sections/new?parent=${section._id}`}
                        className="text-sm text-primary hover:text-primary/80 transition"
                      >
                        + Добавить подраздел
                      </Link>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {section.articles && section.articles.length > 0 ? (
                      section.articles.map((article) => (
                        <div key={article._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10">
                          <Link href={`/articles/${article._id}`} className="flex-1">
                            <div className="flex items-center">
                              <RiFilePaperLine size={20} className="text-primary mr-3" />
                              <div>
                                <h3 className="font-medium">{article.title}</h3>
                                <p className="text-sm text-white/50">
                                  {article.author} • {article.date}
                                </p>
                              </div>
                            </div>
                          </Link>
                          
                          <div className="flex items-center gap-3">
                            <Link 
                              href={`/articles/${article._id}/edit`}
                              className="text-sm text-white/70 hover:text-white transition"
                            >
                              Редактировать
                            </Link>
                            <DeleteArticleButton articleId={article._id} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/50 italic p-4">
                        В этом разделе пока нет статей
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Link 
                      href={`/articles/new?section=${section.priority}`}
                      className="text-sm text-primary hover:text-primary/80 transition inline-flex items-center"
                    >
                      <RiAddLine className="mr-1" />
                      Добавить статью в раздел
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
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