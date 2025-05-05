import React from 'react';
import Link from 'next/link';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiLockLine, RiUser3Line } from 'react-icons/ri';
import Navigation from '../components/Navigation';
import DeleteUserButton from '../components/DeleteUserButton';

// Типы данных для пользователей и статистики
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  acknowledgedArticles: string[];
}

interface TopArticle {
  _id: string;
  title: string;
  viewCount: number;
}

interface Statistics {
  articlesCount: number;
  sectionsCount: number;
  usersCount: number;
  actionsCount: number;
  topArticles: TopArticle[];
}

// Серверные функции для получения данных
async function getUsers() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiUrl ? `${apiUrl}/api/users` : '/api/users';
    
    const res = await fetch(url, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Не удалось загрузить пользователей');
    }
    
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
    return [];
  }
}

async function getStatistics() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = apiUrl ? `${apiUrl}/api/statistics` : '/api/statistics';
    
    const res = await fetch(url, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Не удалось загрузить статистику');
    }
    
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке статистики:', error);
    return {
      articlesCount: 0,
      sectionsCount: 0,
      usersCount: 0,
      actionsCount: 0,
      topArticles: []
    };
  }
}

// Преобразование роли из БД в читаемую строку
function mapRole(role: string): string {
  switch (role) {
    case 'admin': return 'Администратор';
    case 'editor': return 'Редактор';
    case 'reader': return 'Читатель';
    default: return role;
  }
}

// Получение класса для стиля бейджа роли
function getRoleBadgeClass(role: string): string {
  switch (role) {
    case 'admin': return 'bg-primary/20 text-primary';
    case 'editor': return 'bg-blue-500/20 text-blue-500';
    case 'reader': return 'bg-green-500/20 text-green-500';
    default: return 'bg-gray-500/20 text-gray-500';
  }
}

export default async function AdminPage() {
  // Загружаем данные
  const [usersData, statistics] = await Promise.all([
    getUsers(),
    getStatistics()
  ]);

  const users: User[] = usersData || [];

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Админ панель</h1>
            
            <Link
              href="/admin/users/new"
              className="btn-primary flex items-center"
            >
              <RiAddLine className="mr-2" size={20} />
              Добавить пользователя
            </Link>
          </div>

          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-6">Управление пользователями</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium">Имя</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Роль</th>
                    <th className="text-left py-3 px-4 font-medium">Ознакомлен</th>
                    <th className="text-right py-3 px-4 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-white mr-3">
                              <RiUser3Line size={16} />
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/70">{user.email}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className={`
                              inline-block rounded-full px-2 py-1 text-xs 
                              ${getRoleBadgeClass(user.role)}
                            `}>
                              {mapRole(user.role)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-white/70">
                              {user.acknowledgedArticles?.length || 0} статей
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/users/${user._id}/edit`}
                              className="p-2 rounded hover:bg-white/10 transition text-white/70 hover:text-white"
                            >
                              <RiEdit2Line size={18} />
                            </Link>
                            <Link
                              href={`/admin/users/${user._id}/password`}
                              className="p-2 rounded hover:bg-white/10 transition text-white/70 hover:text-white"
                            >
                              <RiLockLine size={18} />
                            </Link>
                            <DeleteUserButton userId={user._id} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center text-white/50">
                        Нет пользователей
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Права доступа</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Роли и разрешения</h3>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Администратор</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Полный доступ ко всем разделам
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Создание и удаление пользователей
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Управление правами доступа
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Редактор</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Добавление и редактирование статей
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Создание и редактирование разделов
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Управление пользователями
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Статистика</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm text-white/50 mb-1">Всего статей</h4>
                    <p className="text-2xl font-bold">{statistics.articlesCount || 0}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm text-white/50 mb-1">Всего разделов</h4>
                    <p className="text-2xl font-bold">{statistics.sectionsCount || 0}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm text-white/50 mb-1">Всего пользователей</h4>
                    <p className="text-2xl font-bold">{statistics.usersCount || 0}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm text-white/50 mb-1">Действий за неделю</h4>
                    <p className="text-2xl font-bold">{statistics.actionsCount || 0}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="font-medium mb-4">Топ статей по просмотрам</h4>
                  <ul className="space-y-3">
                    {statistics.topArticles && statistics.topArticles.length > 0 ? (
                      statistics.topArticles.map((article: TopArticle) => (
                        <li key={article._id} className="flex items-center justify-between">
                          <Link href={`/articles/${article._id}`} className="text-sm text-white/70 hover:text-white">
                            {article.title}
                          </Link>
                          <span className="text-sm font-medium">{article.viewCount || 0}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-white/50">Нет данных о просмотрах</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}