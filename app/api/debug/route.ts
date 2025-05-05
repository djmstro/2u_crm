import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Article } from '../../../lib/models/article';
import { Section } from '../../../lib/models/section';

export async function GET() {
  try {
    console.log('📌 API /debug: Начало отладочной проверки');
    
    // Подключаемся к MongoDB напрямую
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 API /debug: Подключение к MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
    
    // Получаем все статьи и разделы
    const articles = await Article.find({}).lean();
    const sections = await Section.find({}).lean();
    
    console.log(`📊 API /debug: Найдено ${articles.length} статей и ${sections.length} разделов`);
    
    // Проверяем соответствие статей и разделов
    const sectionMap = new Map();
    sections.forEach(section => {
      sectionMap.set(section.priority, {
        id: section._id.toString(),
        name: section.name,
        priority: section.priority,
        type: typeof section.priority,
        articles: []
      });
    });
    
    // Проверяем каждую статью
    articles.forEach(article => {
      const sectionKey = article.section;
      const sectionInfo = sectionMap.get(sectionKey);
      
      if (sectionInfo) {
        sectionInfo.articles.push({
          id: article._id.toString(),
          title: article.title,
          section: article.section,
          type: typeof article.section
        });
      } else {
        console.log(`❌ API /debug: Статья "${article.title}" ссылается на несуществующий раздел: ${sectionKey} (тип: ${typeof sectionKey})`);
      }
    });
    
    // Преобразуем Map в массив для ответа
    const result = Array.from(sectionMap.values());
    
    // Формируем отчет
    const report = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodbStatus: mongoose.connection.readyState,
      articleCount: articles.length,
      sectionCount: sections.length,
      sections: result,
      orphanedArticles: articles.filter(a => !sectionMap.has(a.section)).map(a => ({
        id: a._id.toString(),
        title: a.title,
        section: a.section,
        type: typeof a.section
      }))
    };
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('❌ API /debug: Ошибка при отладке:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Ошибка при выполнении отладки',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 