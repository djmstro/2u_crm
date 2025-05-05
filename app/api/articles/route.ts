import { NextResponse } from 'next/server';
import { Article, IArticle } from '../../../lib/models/article';
import connectToDatabase from '../../../lib/mongodb';

export async function GET(request: Request) {
  try {
    console.log('📌 API /articles: Начало обработки GET запроса');
    console.log('🌐 API /articles: NEXT_PUBLIC_API_URL =', process.env.NEXT_PUBLIC_API_URL);
    console.log('🔌 API /articles: MONGODB_URI =', process.env.MONGODB_URI ? 'Настроен (скрыт)' : 'Не настроен');
    
    await connectToDatabase();
    console.log('✅ API /articles: Подключение к MongoDB успешно');
    
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section');
    const articleId = searchParams.get('id');
    
    console.log('🔍 API /articles: Параметры запроса:', { articleId, sectionId });
    
    // Вернуть конкретную статью, если указан ID
    if (articleId) {
      console.log(`🔍 API /articles: Поиск статьи по ID: ${articleId}`);
      // Найти статью и увеличить счетчик просмотров
      const article = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { viewCount: 1 } }, // Увеличиваем счетчик на 1
        { new: true } // Вернуть обновленный документ
      );
      
      if (article) {
        console.log(`✅ API /articles: Найдена статья: ${article.title}`);
        return NextResponse.json(article);
      } else {
        console.log(`❌ API /articles: Статья с ID ${articleId} не найдена`);
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
      }
    }
    
    // Фильтровать по разделу, если указан ID раздела
    if (sectionId) {
      console.log(`🔍 API /articles: Поиск статей по разделу: ${sectionId}`);
      const articles = await Article.find({ section: parseInt(sectionId) });
      console.log(`✅ API /articles: Найдено ${articles.length} статей в разделе ${sectionId}`);
      return NextResponse.json(articles);
    }
    
    // Вернуть все статьи
    console.log('🔍 API /articles: Получение всех статей');
    const articles = await Article.find({});
    console.log(`✅ API /articles: Найдено всего ${articles.length} статей`);
    
    // Логируем типы данных для отладки
    if (articles.length > 0) {
      articles.forEach(article => {
        console.log(`📊 API /articles: Статья "${article.title}", section:`, article.section, `(тип: ${typeof article.section})`);
      });
    }
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('❌ API /articles: Ошибка при получении статей:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении статей' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
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
    await connectToDatabase();
    
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
    await connectToDatabase();
    
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