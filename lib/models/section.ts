import mongoose, { Schema, models, model } from 'mongoose';

// Интерфейс для объекта раздела
export interface ISection {
  _id?: string;
  name: string;
  priority: number;
  parentId?: string | null; // для подразделов
  createdAt?: Date;
  updatedAt?: Date;
}

// Схема для раздела
const sectionSchema = new Schema<ISection>(
  {
    name: {
      type: String,
      required: [true, 'Название раздела обязательно'],
      trim: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true, // Автоматически добавить createdAt и updatedAt
  }
);

// Экспорт модели (если модель уже существует, используем ее, иначе создаем новую)
export const Section = models.Section || model<ISection>('Section', sectionSchema);

export default Section; 