import React from 'react';
import Link from 'next/link';
import { RiAddLine, RiFilePaperLine, RiFolder3Line, RiSearchLine, RiEdit2Line } from 'react-icons/ri';
import Navigation from '../components/Navigation';
import DeleteArticleButton from '../components/DeleteArticleButton';
import DeleteSectionButton from '../components/DeleteSectionButton';
import SearchBar from '../components/SearchBar';

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiUrl ? `${apiUrl}/api/sections` : '/api/sections';
    
    console.log('🔍 Запрос разделов:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }
    });
    
    if (!res.ok) {
      console.error('❌ Ошибка при загрузке разделов:', res.status, res.statusText);
      throw new Error('Не удалось загрузить разделы');
    }
    
    const data = await res.json();
    console.log('✅ Загружено разделов:', data.length);
    console.log('📊 Данные разделов:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Ошибка при загрузке разделов:', error);
    return [];
  }
}

// Функция для загрузки статей
async function getArticles() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiUrl ? `${apiUrl}/api/articles` : '/api/articles';
    
    console.log('🔍 Запрос статей:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }
    });
    
    if (!res.ok) {
      console.error('❌ Ошибка при загрузке статей:', res.status, res.statusText);
      throw new Error('Не удалось загрузить статьи');
    }
    
    const data = await res.json();
    console.log('✅ Загружено статей:', data.length);
    console.log('📊 Данные статей:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Ошибка при загрузке статей:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  // Загружаем данные
  const [sectionsData, articlesData] = await Promise.all([
    getSections(),
    getArticles(),
  ]);

  console.log('📦 Получено разделов:', sectionsData.length);
  console.log('📦 Получено статей:', articlesData.length);
  console.log('🌐 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

  // Группируем статьи по разделам
  const sections: Section[] = sectionsData.map((section: Section) => {
    // Проверяем тип данных приоритета
    console.log(`🔢 Проверяем раздел: "${section.name}", priority:`, section.priority, `(тип: ${typeof section.priority})`);
    
    const sectionArticles = articlesData.filter((article: Article) => {
      // Проверяем тип данных номера раздела в статье
      console.log(`🔢 Проверяем статью: "${article.title}", section:`, article.section, `(тип: ${typeof article.section})`);
      
      // Используем строковое сравнение для надежного сопоставления независимо от типов
      const sectionMatch = String(article.section) === String(section.priority);
      
      if (sectionMatch) {
        console.log(`   ✅ Статья "${article.title}" соответствует разделу "${section.name}"`);
      }
      
      // Возвращаем результат строкового сравнения
      return sectionMatch;
    });
    
    console.log(`📊 Раздел "${section.name}" содержит ${sectionArticles.length} статей`);
    
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
              <SearchBar />
              
              <div className="flex items-center gap-3">
                <Link 
                  href="/sections/new" 
                  className="btn-outline inline-flex items-center"
                >
                  <RiAddLine className="mr-2" size={20} />
                  Новый раздел
                </Link>
                <Link 
                  href="/articles/new" 
                  className="btn-primary flex items-center"
                >
                  <RiAddLine className="mr-2" size={20} />
                  Новая статья
                </Link>
              </div>
            </div>
          </div>

          {sections.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-lg mb-4">База знаний пуста</p>
              <Link 
                href="/articles/new" 
                className="btn-primary inline-flex items-center"
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
        </div>
      </main>
    </div>
  );
} 