import React from 'react';
import Link from 'next/link';
import { RiBook2Line, RiSettings4Line, RiLogoutBoxLine, RiUser3Line } from 'react-icons/ri';

export default function Navigation() {
  return (
    <div className="bg-white/5 border-r border-white/10 h-screen p-6 flex flex-col">
      <div className="flex items-center mb-12">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
          <path d="M20 6.66669C12.6667 6.66669 6.66669 12.6667 6.66669 20C6.66669 27.3334 12.6667 33.3334 20 33.3334C27.3334 33.3334 33.3334 27.3334 33.3334 20C33.3334 12.6667 27.3334 6.66669 20 6.66669Z" stroke="#7642CB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 21.6667L18.3333 25L25 18.3334" stroke="#7642CB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-xl font-bold">2U Studio</h1>
      </div>

      <nav className="flex-1">
        <div className="space-y-2">
          <p className="text-white/50 text-xs font-medium uppercase px-3 mb-3">Навигация</p>
          <Link 
            href="/articles" 
            className="flex items-center py-2.5 px-3 rounded-lg text-white font-medium bg-primary hover:bg-primary/90 transition"
          >
            <RiBook2Line className="mr-3" size={20} />
            Статьи
          </Link>
          <Link 
            href="/admin" 
            className="flex items-center py-2.5 px-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <RiSettings4Line className="mr-3" size={20} />
            Админ панель
          </Link>
        </div>
      </nav>

      <div className="pt-6 mt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-white mr-3">
              <RiUser3Line size={20} />
            </div>
            <div>
              <p className="font-medium">Александр К.</p>
              <p className="text-xs text-white/50">Разработчик</p>
            </div>
          </div>
        </div>
        
        <Link 
          href="/logout" 
          className="flex items-center py-2.5 px-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition w-full"
        >
          <RiLogoutBoxLine className="mr-3" size={20} />
          Выйти
        </Link>
      </div>
    </div>
  );
} 