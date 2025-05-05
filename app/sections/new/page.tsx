import React from 'react';
import { Suspense } from 'react';
import Navigation from '../../components/Navigation';
import SectionForm from '../../components/SectionForm';

export default function NewSectionPage() {
  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Новый раздел</h1>
          <Suspense fallback={<div>Загрузка...</div>}>
            <SectionForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
} 