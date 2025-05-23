import React from 'react';
import Link from 'next/link';
import { RiArrowLeftLine, RiEdit2Line, RiCheckLine } from 'react-icons/ri';
import Navigation from '../../components/Navigation';
import DeleteArticleButton from '../../components/DeleteArticleButton';
import AcknowledgeButton from '../../components/AcknowledgeButton';

// Серверный компонент для загрузки данных статьи
async function getArticle(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiUrl ? `${apiUrl}/api/articles?id=${id}` : `/api/articles?id=${id}`;
    
    const res = await fetch(url, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Не удалось загрузить статью');
    }
    
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке статьи:', error);
    return null;
  }
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  
  if (!article) {
    return (
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 text-center">
              <h2 className="text-xl font-bold mb-4 text-red-500">Статья не найдена</h2>
              <p className="mb-6">Запрашиваемая статья не существует или была удалена</p>
              <Link 
                href="/articles" 
                className="btn-primary inline-flex items-center justify-center"
              >
                <RiArrowLeftLine className="mr-2" size={20} />
                Вернуться к базе знаний
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // В реальном приложении мы бы получали ID авторизованного пользователя
  const MOCK_USER_ID = '6543210fedcba9876543210';
  
  // Проверка, ознакомлен ли пользователь с этой статьей
  const isAcknowledged = article.acknowledged?.includes(MOCK_USER_ID);

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
            
            <div className="flex items-center gap-4">
              <Link 
                href={`/articles/${article._id}/edit`} 
                className="flex items-center text-primary hover:text-primary/80 transition"
              >
                <RiEdit2Line className="mr-2" size={20} />
                Редактировать
              </Link>
              <DeleteArticleButton 
                articleId={article._id} 
                buttonText="Удалить статью"
                className="text-white/70 hover:text-red-500 transition"
              />
            </div>
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
            <AcknowledgeButton 
              articleId={article._id} 
              userId={MOCK_USER_ID}
              isAcknowledged={isAcknowledged}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 