import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('📌 API /reset-cache: Начало обработки');
    
    // Проверяем статус соединения с MongoDB
    const initialState = mongoose.connection.readyState;
    console.log('🔍 API /reset-cache: Текущий статус соединения:', initialState);
    
    if (global.mongoose && global.mongoose.conn) {
      console.log('🔄 API /reset-cache: Сброс кэшированного соединения MongoDB');
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    }
    
    // Закрываем текущее соединение
    if (mongoose.connection.readyState === 1) {
      console.log('🔄 API /reset-cache: Закрытие активного соединения с MongoDB');
      await mongoose.disconnect();
      console.log('✅ API /reset-cache: Соединение закрыто');
    }
    
    // Повторное подключение к базе данных
    console.log('🔄 API /reset-cache: Повторное подключение к MongoDB');
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ API /reset-cache: Повторное подключение успешно');
    
    return NextResponse.json({
      status: 'ok',
      message: 'Кэш соединения с MongoDB сброшен',
      initialState,
      currentState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ API /reset-cache: Ошибка при сбросе кэша:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Ошибка при сбросе кэша соединения',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 