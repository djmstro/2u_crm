import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 justify-center">
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
              <path d="M20 6.66669C12.6667 6.66669 6.66669 12.6667 6.66669 20C6.66669 27.3334 12.6667 33.3334 20 33.3334C27.3334 33.3334 33.3334 27.3334 33.3334 20C33.3334 12.6667 27.3334 6.66669 20 6.66669Z" stroke="#7642CB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 21.6667L18.3333 25L25 18.3334" stroke="#7642CB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl font-bold">2U Studio</h1>
          </div>

          <h2 className="text-3xl font-bold mb-2">Добро пожаловать!</h2>
          <p className="text-lg text-white/70 mb-8">Войдите в свой аккаунт для доступа к базе знаний.</p>
          <p className="text-sm text-white/70">Кредитная карта не требуется.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">Рабочий Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com" 
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">Пароль</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              className="input-field"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember" 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-500 accent-primary" 
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                Запомнить меня
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Забыли пароль?
            </Link>
          </div>

          <Link href="/articles" className="btn-primary w-full block text-center mt-6">
            Войти
          </Link>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-white/50 text-sm">ИЛИ</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <button className="w-full border border-white/20 rounded-lg py-3 px-6 flex items-center justify-center space-x-2 hover:bg-white/5 transition">
            <FcGoogle size={20} />
            <span>Войти через Google</span>
          </button>
        </div>

        <div className="mt-8 text-sm text-white/70">
          <p>Нет аккаунта? <Link href="/" className="text-primary hover:underline">Зарегистрироваться</Link></p>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-background relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-4 mb-16">
              <div className="bg-white/5 rounded-xl p-6 h-32 flex items-center justify-center border border-white/10 shadow-lg">
                <div className="w-14 h-14 bg-primary/20 rounded-md flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 7H7V17H9V7Z" fill="#7642CB"/>
                    <path d="M17 7H15V17H17V7Z" fill="#7642CB"/>
                    <path d="M13 7H11V17H13V7Z" fill="#7642CB"/>
                  </svg>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 h-32 flex items-center justify-center border border-white/10 shadow-lg">
                <div className="w-14 h-14 bg-primary/20 rounded-md flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9H9.01" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 9H15.01" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 h-32 flex items-center justify-center border border-white/10 shadow-lg">
                <div className="w-14 h-14 bg-primary/20 rounded-md flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 h-32 flex items-center justify-center border border-white/10 shadow-lg">
                <div className="w-14 h-14 bg-primary/20 rounded-md flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#7642CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Вы в хорошей компании.</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 12C40 5.373 34.627 0 28 0H12C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24H28C34.627 24 40 18.627 40 12Z" fill="white"/>
                  <path d="M80 12C80 5.373 74.627 0 68 0H52C45.373 0 40 5.373 40 12C40 18.627 45.373 24 52 24H68C74.627 24 80 18.627 80 12Z" fill="white"/>
                  <path d="M52 0H28C21.373 0 16 5.373 16 12C16 18.627 21.373 24 28 24H52C58.627 24 64 18.627 64 12C64 5.373 58.627 0 52 0Z" fill="white"/>
                </svg>
              </div>
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0H64C72.837 0 80 5.373 80 12C80 18.627 72.837 24 64 24H16C7.163 24 0 18.627 0 12C0 5.373 7.163 0 16 0Z" fill="white"/>
                  <path d="M28 6H52V18H28V6Z" fill="#171619"/>
                </svg>
              </div>
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0H68C74.627 0 80 5.373 80 12C80 18.627 74.627 24 68 24H12C5.373 24 0 18.627 0 12C0 5.373 5.373 0 12 0Z" fill="white"/>
                  <path d="M20 6L40 18L60 6" stroke="#171619" strokeWidth="4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 