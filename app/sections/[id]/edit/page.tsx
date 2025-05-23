import React from 'react';
import { Suspense } from 'react';
import Navigation from '../../../components/Navigation';
import SectionForm from '../../../components/SectionForm';

// Серверный компонент для загрузки данных раздела
async function getSection(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiUrl ? `${apiUrl}/api/sections?id=${id}` : `/api/sections?id=${id}`;
    
    const res = await fetch(url, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Не удалось загрузить раздел');
    }
    
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке раздела:', error);
    return null;
  }
}

export default async function EditSectionPage({ params }: { params: { id: string } }) {
  const section = await getSection(params.id);
  
  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Редактирование раздела</h1>
          {section ? (
            <Suspense fallback={<div>Загрузка...</div>}>
              <SectionForm isEditing initialData={section} />
            </Suspense>
          ) : (
            <div className="card p-6">
              <p className="text-red-500">Не удалось загрузить раздел. Проверьте ID и попробуйте еще раз.</p>
              <a href="/articles" className="text-primary hover:underline mt-4 inline-block">
                Вернуться к списку разделов
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 