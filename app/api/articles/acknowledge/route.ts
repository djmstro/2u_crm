import { NextResponse } from 'next/server';
import { Article } from '../../../../lib/models/article';
import { User } from '../../../../lib/models/user';
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

export async function POST(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { articleId, userId } = body;
    
    // Проверка наличия необходимых параметров
    if (!articleId || !userId) {
      return NextResponse.json(
        { error: 'ID статьи и ID пользователя обязательны' },
        { status: 400 }
      );
    }
    
    // Проверка существования статьи и пользователя
    const [article, user] = await Promise.all([
      Article.findById(articleId),
      User.findById(userId)
    ]);
    
    if (!article) {
      return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }
    
    // Добавляем пользователя в список ознакомленных, если его еще нет
    if (!article.acknowledged?.includes(userId)) {
      await Article.findByIdAndUpdate(
        articleId,
        { $addToSet: { acknowledged: userId } }
      );
    }
    
    // Добавляем статью в список ознакомленных статей пользователя
    if (!user.acknowledgedArticles?.includes(articleId)) {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { acknowledgedArticles: articleId } }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Ознакомление успешно отмечено'
    });
  } catch (error) {
    console.error('Ошибка при отметке ознакомления:', error);
    return NextResponse.json(
      { error: 'Ошибка при отметке ознакомления' },
      { status: 500 }
    );
  }
} 