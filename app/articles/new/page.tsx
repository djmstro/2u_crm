import React from 'react';
import Navigation from '../../components/Navigation';
import ArticleForm from '../../components/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <ArticleForm />
        </div>
      </main>
    </div>
  );
} 