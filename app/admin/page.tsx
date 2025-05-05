import React from 'react';
import Link from 'next/link';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiLockLine, RiUser3Line } from 'react-icons/ri';
import Navigation from '../components/Navigation';

export default function AdminPage() {
  // Mock users data
  const users = [
    { 
      id: 1, 
      name: 'Александр Петров', 
      email: 'a.petrov@2ustudio.com', 
      role: 'Администратор', 
      acknowledged: 7 
    },
    { 
      id: 2, 
      name: 'Елена Иванова', 
      email: 'e.ivanova@2ustudio.com', 
      role: 'Редактор', 
      acknowledged: 12 
    },
    { 
      id: 3, 
      name: 'Мария Сидорова', 
      email: 'm.sidorova@2ustudio.com', 
      role: 'Редактор', 
      acknowledged: 9 
    },
    { 
      id: 4, 
      name: 'Дмитрий Козлов', 
      email: 'd.kozlov@2ustudio.com', 
      role: 'Читатель', 
      acknowledged: 5 
    },
    { 
      id: 5, 
      name: 'Алексей Смирнов', 
      email: 'a.smirnov@2ustudio.com', 
      role: 'Читатель', 
      acknowledged: 3 
    },
  ];

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Админ панель</h1>
            
            <button className="btn-primary flex items-center">
              <RiAddLine className="mr-2" size={20} />
              Добавить пользователя
            </button>
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
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
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
                            ${user.role === 'Администратор' ? 'bg-primary/20 text-primary' : 
                              user.role === 'Редактор' ? 'bg-blue-500/20 text-blue-500' : 
                              'bg-green-500/20 text-green-500'}
                          `}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-white/70">{user.acknowledged} статей</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded hover:bg-white/10 transition text-white/70 hover:text-white">
                            <RiEdit2Line size={18} />
                          </button>
                          <button className="p-2 rounded hover:bg-white/10 transition text-white/70 hover:text-white">
                            <RiLockLine size={18} />
                          </button>
                          <button className="p-2 rounded hover:bg-white/10 transition text-white/70 hover:text-red-400">
                            <RiDeleteBin6Line size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                    <p className="text-2xl font-bold">26</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm text-white/50 mb-1">Всего разделов</h4>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm text-white/50 mb-1">Всего пользователей</h4>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm text-white/50 mb-1">Действий за неделю</h4>
                    <p className="text-2xl font-bold">87</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="font-medium mb-4">Топ статей по просмотрам</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Стандарты кодирования 2U Studio</span>
                      <span className="text-sm font-medium">126</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Руководство для новых сотрудников</span>
                      <span className="text-sm font-medium">93</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Git Flow в нашей команде</span>
                      <span className="text-sm font-medium">85</span>
                    </li>
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