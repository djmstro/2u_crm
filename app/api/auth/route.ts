import { NextResponse } from 'next/server';
import { User, IUser } from '../../../lib/models/user';
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
    const { email, password } = body;

    // Простая валидация
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Найти пользователя (в реальном приложении нужно использовать хеширование паролей)
    // Явно включаем поле password, так как оно по умолчанию не возвращается
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Создаем объект пользователя без пароля
    const userWithoutPassword: IUser = user.toJSON();

    // В реальном приложении здесь бы установили cookies/сессию
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Вход выполнен успешно',
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    return NextResponse.json(
      { error: 'Ошибка авторизации' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await mongoConnect();
    
    // Получение списка пользователей (только для тестирования, в реальном приложении не нужно)
    const users = await User.find({}).limit(10);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении пользователей' },
      { status: 500 }
    );
  }
} 