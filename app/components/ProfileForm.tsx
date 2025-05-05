'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiSaveLine, RiLockLine } from 'react-icons/ri';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  acknowledgedArticles?: string[];
}

interface ProfileFormProps {
  userData: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userData }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = apiUrl ? `${apiUrl}/api/users` : '/api/users';
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData._id,
          name: formData.name,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Произошла ошибка');
      }

      setSuccess('Профиль успешно обновлен');
      router.refresh();
    } catch (err: any) {
      console.error('Ошибка при обновлении профиля:', err);
      setError(err.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 font-medium">Имя</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите ваше имя" 
            className="input-field"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 font-medium">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите ваш email" 
            className="input-field"
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="block font-medium">Роль</label>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 mt-2">
            <span className="inline-block rounded-full px-3 py-1 text-sm bg-primary/20 text-primary">
              {userData.role === 'admin' ? 'Администратор' : 
               userData.role === 'editor' ? 'Редактор' : 'Читатель'}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="block font-medium">Пароль</label>
            <button 
              type="button"
              className="text-sm text-primary hover:text-primary/80"
              onClick={() => alert('Функция изменения пароля в разработке')}
            >
              <RiLockLine className="inline-block mr-1" />
              Изменить пароль
            </button>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 mt-2">
            <span className="text-white/50">••••••••</span>
          </div>
        </div>

        <div className="mt-8">
          <button 
            type="submit" 
            className="btn-primary flex items-center"
            disabled={isSubmitting}
          >
            <RiSaveLine className="mr-2" size={20} />
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm; 