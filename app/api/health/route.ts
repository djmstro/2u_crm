import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Проверяем доступность базы данных, используем переменные окружения напрямую
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        status: 'error',
        message: 'MONGODB_URI не задан',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    // Проверяем подключение к MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Простая проверка подключения
    const isConnected = mongoose.connection.readyState === 1;
    
    // Закрываем соединение
    await mongoose.disconnect();
    
    if (!isConnected) {
      throw new Error('База данных не подключена');
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'API работает корректно',
      database: 'подключена',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка в health check:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Ошибка при подключении к базе данных',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 