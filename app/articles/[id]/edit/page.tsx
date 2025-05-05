import React from 'react';
import Navigation from '../../../components/Navigation';
import ArticleForm from '../../../components/ArticleForm';

// Серверный компонент для загрузки данных статьи
async function getArticle(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/articles?id=${id}`, { 
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

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  
  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {article ? (
            <ArticleForm isEditing initialData={article} />
          ) : (
            <div className="card p-6">
              <p className="text-red-500">Не удалось загрузить статью. Проверьте ID и попробуйте еще раз.</p>
              <a href="/articles" className="text-primary hover:underline mt-4 inline-block">
                Вернуться к списку статей
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 