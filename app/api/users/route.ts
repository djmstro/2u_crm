import { NextResponse } from 'next/server';
import { User, IUser } from '../../../lib/models/user';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    const userId = searchParams.get('id');
    
    // Вернуть конкретного пользователя, если указан ID
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        return NextResponse.json(user);
      } else {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }
    }
    
    // Вернуть всех пользователей
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении пользователей' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { name, email, password, role } = body;
    
    // Простая валидация
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Имя, email и пароль обязательны' },
        { status: 400 }
      );
    }
    
    // Проверка на дублирование email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }
    
    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Создание нового пользователя
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'reader',
      acknowledgedArticles: []
    });
    
    // Сохранение пользователя в базе данных
    await newUser.save();
    
    // Не возвращаем пароль в ответе
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      acknowledgedArticles: newUser.acknowledgedArticles,
      createdAt: newUser.createdAt
    };
    
    // Возврат нового пользователя
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await mongoConnect();
    
    const body = await request.json();
    const { id, name, email, password, role } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID пользователя обязателен' },
        { status: 400 }
      );
    }
    
    // Подготовка объекта для обновления
    let updateData: Partial<IUser> = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role as any;
    
    // Хеширование пароля, если он был предоставлен
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    
    // Обновление пользователя
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Возвращает обновленный документ
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
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
        { error: 'ID пользователя обязателен' },
        { status: 400 }
      );
    }
    
    // Удаление пользователя
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Пользователь успешно удален',
      id 
    });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении пользователя' },
      { status: 500 }
    );
  }
} 