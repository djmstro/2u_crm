import { NextResponse } from 'next/server';
import { Article, IArticle } from '../../../lib/models/article';
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
    const sectionId = searchParams.get('section');
    const articleId = searchParams.get('id');
    
    console.log('GET articles API запрос:', { 
      articleId, 
      sectionId,
      connectStatus: mongoose.connection.readyState
    });
    
    // Вернуть конкретную статью, если указан ID
    if (articleId) {
      // Найти статью и увеличить счетчик просмотров
      const article = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { viewCount: 1 } }, // Увеличиваем счетчик на 1
        { new: true } // Вернуть обновленный документ
      );
      
      if (article) {
        return NextResponse.json(article);
      } else {
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
      }
    }
    
    // Фильтровать по разделу, если указан ID раздела
    if (sectionId) {
      const articles = await Article.find({ section: parseInt(sectionId) });
      console.log(`Найдено ${articles.length} статей в разделе ${sectionId}`);
      return NextResponse.json(articles);
    }
    
    // Вернуть все статьи
    const articles = await Article.find({});
    console.log(`Найдено всего ${articles.length} статей`);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Ошибка при получении статей:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении статей' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { title, content, section, author } = body;
    
    console.log('POST запрос на создание статьи:', { title, section });
    
    // Простая валидация
    if (!title || !content || !section) {
      return NextResponse.json(
        { error: 'Заголовок, содержание и раздел обязательны' },
        { status: 400 }
      );
    }
    
    // Создание новой статьи
    const newArticle = new Article({
      title,
      content,
      section: parseInt(section),
      author: author || 'Текущий пользователь', // В реальном приложении это будет текущий пользователь
      date: new Date().toLocaleDateString('ru-RU'),
    });
    
    // Сохранение статьи в базе данных
    await newArticle.save();
    
    console.log('Создана новая статья:', newArticle._id);
    
    // Возврат новой статьи
    return NextResponse.json(newArticle);
  } catch (error) {
    console.error('Ошибка при создании статьи:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании статьи' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { id, title, content, section } = body;
    
    console.log('PUT запрос на обновление статьи:', { id });
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID статьи обязателен' },
        { status: 400 }
      );
    }
    
    // Обновление статьи
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { 
        ...(title && { title }),
        ...(content && { content }),
        ...(section && { section: parseInt(section) }),
      },
      { new: true } // Возвращает обновленный документ
    );
    
    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Статья не найдена' },
        { status: 404 }
      );
    }
    
    console.log('Статья обновлена:', id);
    
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Ошибка при обновлении статьи:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении статьи' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await mongoConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('DELETE запрос на удаление статьи:', { id });
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID статьи обязателен' },
        { status: 400 }
      );
    }
    
    // Удаление статьи
    const deletedArticle = await Article.findByIdAndDelete(id);
    
    if (!deletedArticle) {
      return NextResponse.json(
        { error: 'Статья не найдена' },
        { status: 404 }
      );
    }
    
    console.log('Статья удалена:', id);
    
    return NextResponse.json({ 
      message: 'Статья успешно удалена',
      id 
    });
  } catch (error) {
    console.error('Ошибка при удалении статьи:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении статьи' },
      { status: 500 }
    );
  }
} 