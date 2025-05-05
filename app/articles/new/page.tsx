import React from 'react';
import { Suspense } from 'react';
import Navigation from '../../components/Navigation';
import ArticleForm from '../../components/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Новая статья</h1>
          <Suspense fallback={<div>Загрузка...</div>}>
            <ArticleForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
} 