'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';

interface Section {
  _id: string;
  name: string;
  priority: number;
  parentId?: string;
}

interface SectionFormProps {
  isEditing?: boolean;
  initialData?: {
    _id?: string;
    name: string;
    priority: number;
    parentId?: string;
  };
}

const SectionForm: React.FC<SectionFormProps> = ({ isEditing = false, initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentParam = searchParams.get('parent');

  const [sections, setSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    priority: initialData?.priority || 0,
    parentId: initialData?.parentId || parentParam || '',
  });

  // Загружаем список разделов для выбора родительского раздела
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
        // Исключаем текущий раздел из списка доступных родительских, если это режим редактирования
        const filteredSections = isEditing && initialData?._id 
          ? data.filter((section: Section) => section._id !== initialData._id)
          : data;
        setSections(filteredSections);
      } catch (err) {
        console.error('Ошибка при загрузке разделов:', err);
        setError('Не удалось загрузить разделы');
      }
    };

    fetchSections();
  }, [isEditing, initialData]);

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
      const url = apiUrl ? `${apiUrl}/api/sections` : '/api/sections';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        ...(isEditing && initialData?._id && { id: initialData._id }),
        name: formData.name,
        priority: parseInt(formData.priority.toString()),
        ...(formData.parentId && { parentId: formData.parentId }),
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

      router.push('/articles'); // Перенаправляем на страницу со всеми разделами и статьями
      router.refresh();
    } catch (err: any) {
      console.error('Ошибка при сохранении раздела:', err);
      setError(err.message || 'Произошла ошибка при сохранении раздела');
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
          {isSubmitting ? 'Сохранение...' : 'Сохранить раздел'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="card mb-6">
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 font-medium">Название раздела</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название раздела..." 
            className="input-field text-xl"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="priority" className="block mb-2 font-medium">Приоритет (порядок сортировки)</label>
          <input 
            type="number" 
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            placeholder="Порядковый номер..." 
            className="input-field"
            min="0"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="parentId" className="block mb-2 font-medium">Родительский раздел (опционально)</label>
          <select 
            id="parentId"
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Без родительского раздела</option>
            {sections.map(section => (
              <option key={section._id} value={section._id}>
                {section.name}
              </option>
            ))}
          </select>
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
          {isSubmitting ? 'Сохранение...' : 'Сохранить раздел'}
        </button>
      </div>
    </form>
  );
};

export default SectionForm; 