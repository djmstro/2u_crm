import { NextResponse } from 'next/server';
import { Article } from '../../../../lib/models/article';
import mongoose from 'mongoose';

// Подключение к MongoDB при первом запросе
const mongoConnect = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
  } catch (error) {
    console.error('Ошибка при подключении к MongoDB:', error);
    throw error;
  }
};

export async function GET(request: Request) {
  try {
    await mongoConnect();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    // Поиск по заголовку и содержимому с использованием регулярного выражения
    const articles = await Article.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Ошибка при поиске статей:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске статей' },
      { status: 500 }
    );
  }
} 