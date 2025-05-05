import { NextResponse } from 'next/server';
import { Section, ISection } from '../../../lib/models/section';
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
    const sectionId = searchParams.get('id');
    
    // Вернуть конкретный раздел, если указан ID
    if (sectionId) {
      const section = await Section.findById(sectionId);
      if (section) {
        return NextResponse.json(section);
      } else {
        return NextResponse.json({ error: 'Раздел не найден' }, { status: 404 });
      }
    }
    
    // Вернуть все разделы
    const sections = await Section.find({}).sort({ priority: 1 });
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Ошибка при получении разделов:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении разделов' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { name, priority, parentId } = body;
    
    // Простая валидация
    if (!name) {
      return NextResponse.json(
        { error: 'Название раздела обязательно' },
        { status: 400 }
      );
    }
    
    // Создание нового раздела
    const newSection = new Section({
      name,
      priority: priority || 0,
      ...(parentId && { parentId }),
    });
    
    // Сохранение раздела в базе данных
    await newSection.save();
    
    // Возврат нового раздела
    return NextResponse.json(newSection);
  } catch (error) {
    console.error('Ошибка при создании раздела:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании раздела' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { id, name, priority, parentId } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID раздела обязателен' },
        { status: 400 }
      );
    }
    
    // Обновление раздела
    const updatedSection = await Section.findByIdAndUpdate(
      id,
      { 
        ...(name && { name }),
        ...(priority !== undefined && { priority }),
        ...(parentId !== undefined && { parentId }),
      },
      { new: true } // Возвращает обновленный документ
    );
    
    if (!updatedSection) {
      return NextResponse.json(
        { error: 'Раздел не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error('Ошибка при обновлении раздела:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении раздела' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await mongoConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID раздела обязателен' },
        { status: 400 }
      );
    }
    
    // Удаление раздела
    const deletedSection = await Section.findByIdAndDelete(id);
    
    if (!deletedSection) {
      return NextResponse.json(
        { error: 'Раздел не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Раздел успешно удален',
      id 
    });
  } catch (error) {
    console.error('Ошибка при удалении раздела:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении раздела' },
      { status: 500 }
    );
  }
} 