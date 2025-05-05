import { NextResponse } from 'next/server';
import { Article } from '../../../lib/models/article';
import { Section } from '../../../lib/models/section';
import { User } from '../../../lib/models/user';
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

export async function GET() {
  try {
    await mongoConnect();
    
    // Получаем статистику по всему сайту
    const [articlesCount, sectionsCount, usersCount] = await Promise.all([
      Article.countDocuments(),
      Section.countDocuments(),
      User.countDocuments()
    ]);
    
    // Получаем топ-3 статьи по просмотрам
    const topArticles = await Article.find({})
      .sort({ viewCount: -1 })
      .limit(3)
      .select('title viewCount');
    
    // Посчитаем количество действий за неделю (добавим фиктивное число, так как у нас нет реальной статистики действий)
    const actionsCount = Math.floor(Math.random() * 100) + 50; // Фиктивное число для примера
    
    return NextResponse.json({
      articlesCount,
      sectionsCount,
      usersCount,
      actionsCount,
      topArticles
    });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении статистики' },
      { status: 500 }
    );
  }
} 