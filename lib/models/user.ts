import mongoose, { Schema, models, model } from 'mongoose';

// Тип роли пользователя
export type UserRole = 'admin' | 'editor' | 'reader';

// Интерфейс для объекта пользователя
export interface IUser {
  _id?: string;
  email: string;
  name: string;
  password?: string; // Не будет возвращаться в ответах API
  role: UserRole;
  acknowledgedArticles?: string[]; // Массив ID статей, с которыми ознакомился пользователь
  createdAt?: Date;
  updatedAt?: Date;
}

// Схема для пользователя
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Пароль обязателен'],
      // Не включаем пароль при преобразовании документа в объект
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'editor', 'reader'],
        message: '{VALUE} не является допустимой ролью',
      },
      default: 'reader',
    },
    acknowledgedArticles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Автоматически добавить createdAt и updatedAt
  }
);

// Метод для удаления пароля из данных пользователя при преобразовании в JSON
userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    delete returnedObject.password;
    return returnedObject;
  },
});

// Экспорт модели (если модель уже существует, используем ее, иначе создаем новую)
export const User = models.User || model<IUser>('User', userSchema);

export default User; 