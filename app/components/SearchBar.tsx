'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

interface Article {
  _id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Обработчик клика вне компонента поиска
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функция для поиска статей
  const searchArticles = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = apiUrl 
        ? `${apiUrl}/api/articles/search?q=${encodeURIComponent(searchQuery)}` 
        : `/api/articles/search?q=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Ошибка при поиске');
      }
      
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce функция для предотвращения лишних запросов
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchArticles(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Обработчик изменения поискового запроса
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) {
      setShowResults(true);
    }
  };

  // Очистка поискового запроса
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
        <input 
          type="text" 
          placeholder="Поиск..." 
          className="pl-10 pr-10 input-field w-64"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setShowResults(true);
            }
          }}
        />
        {query && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
            onClick={clearSearch}
          >
            <RiCloseLine size={18} />
          </button>
        )}
      </div>
      
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-white/10 rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-white/70">Поиск...</div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((article) => (
                <Link 
                  key={article._id} 
                  href={`/articles/${article._id}`}
                  className="block p-3 hover:bg-white/5 border-b border-white/10 last:border-b-0"
                  onClick={() => setShowResults(false)}
                >
                  <div className="font-medium">{article.title}</div>
                  <div className="text-sm text-white/50 mt-1">
                    {article.author} • {article.date}
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-white/70">Ничего не найдено</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 