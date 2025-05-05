'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import dynamic from 'next/dynamic';

// Динамический импорт React Quill, чтобы избежать ошибок SSR
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="min-h-[400px] flex items-center justify-center bg-white/5 border border-white/10 rounded-lg">
    Загрузка редактора...
  </div>
});

// Импорт стилей Quill
import 'react-quill/dist/quill.snow.css';

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

// Модули и форматы для редактора Quill
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'blockquote', 'code-block'],
    [{ color: [] }, { background: [] }],
    ['clean'],
    ['table'],
  ]
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'image', 'blockquote', 'code-block',
  'align', 'color', 'background',
  'table'
];

const ArticleForm: React.FC<ArticleFormProps> = ({ isEditing = false, initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');

  const [sections, setSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    section: initialData?.section || sectionParam || '',
  });

  // Загружаем список разделов при монтировании компонента
  useEffect(() => {
    const fetchSections = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const url = apiUrl ? `${apiUrl}/api/sections` : '/api/sections';
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error('Не удалось загрузить разделы');
        }
        const data = await response.json();
        setSections(data);
      } catch (err) {
        console.error('Ошибка при загрузке разделов:', err);
        setError('Не удалось загрузить разделы');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
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

      // Перенаправляем и обновляем страницу
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
          {isLoading ? (
            <div className="p-2">Загрузка разделов...</div>
          ) : sections.length > 0 ? (
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
          ) : (
            <div className="p-2 text-red-400">
              Нет доступных разделов. 
              <Link href="/sections/new" className="text-primary ml-2 hover:underline">
                Создать раздел
              </Link>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block mb-2 font-medium">Содержание</label>
          
          <div className="quill-wrapper">
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Введите содержание статьи..."
              theme="snow"
              className="rounded-lg overflow-hidden bg-white text-black"
            />
          </div>
          
          <style jsx global>{`
            .quill-wrapper .ql-toolbar {
              background-color: #f3f4f6;
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
              border-color: #e5e7eb;
            }
            
            .quill-wrapper .ql-container {
              border-bottom-left-radius: 0.5rem;
              border-bottom-right-radius: 0.5rem;
              border-color: #e5e7eb;
              min-height: 300px;
            }
            
            .quill-wrapper .ql-editor {
              min-height: 300px;
              font-size: 1rem;
            }
          `}</style>
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