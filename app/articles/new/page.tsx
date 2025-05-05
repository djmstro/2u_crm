import React from 'react';
import Link from 'next/link';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import Navigation from '../../components/Navigation';

export default function NewArticlePage() {
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
            
            <button className="btn-primary flex items-center">
              <RiSaveLine className="mr-2" size={20} />
              Сохранить статью
            </button>
          </div>

          <div className="card mb-6">
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 font-medium">Заголовок статьи</label>
              <input 
                type="text" 
                id="title" 
                placeholder="Введите заголовок..." 
                className="input-field text-xl"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="section" className="block mb-2 font-medium">Раздел</label>
              <select id="section" className="input-field">
                <option value="">Выберите раздел</option>
                <option value="1">Общая информация</option>
                <option value="2">Разработка</option>
                <option value="3">Дизайн</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="content" className="block mb-2 font-medium">Содержание</label>
              
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                {/* Editor toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10">
                  <button className="p-2 rounded hover:bg-white/10 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 4h8v5h-8z" fill="white" />
                      <path d="M6 15h12v5h-12z" fill="white" />
                      <path d="M16 4h2v5h-2zM6 10h12v4h-12z" fill="white" />
                    </svg>
                  </button>
                  <button className="p-2 rounded hover:bg-white/10 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 7h16v2h-16z" fill="white" />
                      <path d="M4 11h16v2h-16z" fill="white" />
                      <path d="M4 15h16v2h-16z" fill="white" />
                    </svg>
                  </button>
                  <div className="h-6 w-px bg-white/10 mx-1"></div>
                  <button className="p-2 rounded hover:bg-white/10 transition font-bold">
                    B
                  </button>
                  <button className="p-2 rounded hover:bg-white/10 transition italic">
                    I
                  </button>
                  <button className="p-2 rounded hover:bg-white/10 transition underline">
                    U
                  </button>
                  <div className="h-6 w-px bg-white/10 mx-1"></div>
                  <button className="p-2 rounded hover:bg-white/10 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4h2v16h-2z" fill="white" />
                      <path d="M4 11h16v2h-16z" fill="white" />
                    </svg>
                  </button>
                  <button className="p-2 rounded hover:bg-white/10 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M7 8h10v2h-10z" fill="white" />
                      <path d="M7 12h10v2h-10z" fill="white" />
                      <path d="M7 16h10v2h-10z" fill="white" />
                      <path d="M3 8h2v2h-2zM3 12h2v2h-2zM3 16h2v2h-2z" fill="white" />
                    </svg>
                  </button>
                  <div className="h-6 w-px bg-white/10 mx-1"></div>
                  <button className="p-2 rounded hover:bg-white/10 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 5h14v3h-14zM5 10h14v3h-14zM5 15h14v3h-14z" fill="white" />
                    </svg>
                  </button>
                  <button className="p-2 rounded hover:bg-white/10 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3h18v18h-18z" stroke="white" strokeWidth="2" fill="none" />
                      <path d="M9 3v18M3 9h18" stroke="white" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
                
                {/* Editor content */}
                <div className="min-h-[400px] p-4">
                  <textarea 
                    id="content"
                    className="bg-transparent w-full h-full min-h-[400px] resize-none outline-none"
                    placeholder="Введите содержание статьи..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 mt-8">
            <Link 
              href="/articles" 
              className="btn-outline"
            >
              Отмена
            </Link>
            <button className="btn-primary flex items-center">
              <RiSaveLine className="mr-2" size={20} />
              Сохранить статью
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 