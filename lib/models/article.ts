import mongoose, { Schema, models, model } from 'mongoose';

// Интерфейс для объекта статьи
export interface IArticle {
  _id?: string;
  title: string;
  content: string;
  author: string;
  date: string;
  section: number;
  acknowledged?: string[]; // массив ID пользователей, ознакомленных со статьей
  createdAt?: Date;
  updatedAt?: Date;
}

// Схема для статьи
const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Заголовок обязателен'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Содержание обязательно'],
    },
    author: {
      type: String,
      required: [true, 'Автор обязателен'],
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('ru-RU'),
    },
    section: {
      type: Number,
      required: [true, 'Раздел обязателен'],
    },
    acknowledged: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Автоматически добавить createdAt и updatedAt
  }
);

// Экспорт модели (если модель уже существует, используем ее, иначе создаем новую)
export const Article = models.Article || model<IArticle>('Article', articleSchema);

export default Article; 