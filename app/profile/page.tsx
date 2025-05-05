import React from 'react';
import { Suspense } from 'react';
import Navigation from '../components/Navigation';
import ProfileForm from '../components/ProfileForm';

// В реальном приложении мы бы получали ID пользователя из аутентификации
// Здесь для примера используем константу
const MOCK_USER_ID = '6543210fedcba9876543210';

// Серверный компонент для загрузки данных пользователя
async function getUser(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiUrl ? `${apiUrl}/api/users?id=${id}` : `/api/users?id=${id}`;
    
    const res = await fetch(url, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      // Если пользователь не найден, вернем null
      if (res.status === 404) {
        return null;
      }
      throw new Error('Не удалось загрузить данные пользователя');
    }
    
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователя:', error);
    return null;
  }
}

export default async function ProfilePage() {
  // Здесь в реальном приложении мы бы получали ID авторизованного пользователя
  const userData = await getUser(MOCK_USER_ID);
  
  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Профиль пользователя</h1>
          
          <Suspense fallback={<div>Загрузка данных...</div>}>
            {userData ? (
              <ProfileForm userData={userData} />
            ) : (
              <div className="card p-6">
                <p className="text-red-500">Не удалось загрузить данные пользователя.</p>
              </div>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  );
} 