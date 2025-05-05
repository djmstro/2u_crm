'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';

interface Section {
  _id: string;
  name: string;
  priority: number;
}

interface ArticleFormProps {
  isEditing?: boolean;
  initialData?: {
    _id?: string;
    title: string;
    content: string;
    section: number;
  };
}

const ArticleForm: React.FC<ArticleFormProps> = ({ isEditing = false, initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');

  const [sections, setSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    section: initialData?.section || sectionParam || '',
  });

  // Загружаем список разделов при монтировании компонента
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const url = apiUrl ? `${apiUrl}/api/sections` : '/api/sections';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Не удалось загрузить разделы');
        }
        const data = await response.json();
        setSections(data);
      } catch (err) {
        console.error('Ошибка при загрузке разделов:', err);
        setError('Не удалось загрузить разделы');
      }
    };

    fetchSections();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = apiUrl ? `${apiUrl}/api/articles` : '/api/articles';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        ...(isEditing && initialData?._id && { id: initialData._id }),
        title: formData.title,
        content: formData.content,
        section: parseInt(formData.section as string),
        author: 'Текущий пользователь', // В реальном приложении должен быть текущий пользователь
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Произошла ошибка');
      }

      router.push('/articles');
      router.refresh();
    } catch (err: any) {
      console.error('Ошибка при сохранении статьи:', err);
      setError(err.message || 'Произошла ошибка при сохранении статьи');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/articles" 
          className="flex items-center text-white/70 hover:text-white transition"
        >
          <RiArrowLeftLine className="mr-2" size={20} />
          Назад к базе знаний
        </Link>
        
        <button 
          type="submit" 
          className="btn-primary flex items-center"
          disabled={isSubmitting}
        >
          <RiSaveLine className="mr-2" size={20} />
          {isSubmitting ? 'Сохранение...' : 'Сохранить статью'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="card mb-6">
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-medium">Заголовок статьи</label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите заголовок..." 
            className="input-field text-xl"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="section" className="block mb-2 font-medium">Раздел</label>
          <select 
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Выберите раздел</option>
            {sections.map(section => (
              <option key={section._id} value={section.priority}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="content" className="block mb-2 font-medium">Содержание</label>
          
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            {/* Editor toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10">
              <button type="button" className="p-2 rounded hover:bg-white/10 transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 4h8v5h-8z" fill="white" />
                  <path d="M6 15h12v5h-12z" fill="white" />
                  <path d="M16 4h2v5h-2zM6 10h12v4h-12z" fill="white" />
                </svg>
              </button>
              {/* ... остальные кнопки форматирования ... */}
            </div>
            
            {/* Editor content */}
            <div className="min-h-[400px] p-4">
              <textarea 
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="bg-transparent w-full h-full min-h-[400px] resize-none outline-none"
                placeholder="Введите содержание статьи..."
                required
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
        <button 
          type="submit" 
          className="btn-primary flex items-center"
          disabled={isSubmitting}
        >
          <RiSaveLine className="mr-2" size={20} />
          {isSubmitting ? 'Сохранение...' : 'Сохранить статью'}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm; 