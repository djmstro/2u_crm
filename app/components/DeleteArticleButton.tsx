'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteArticleButtonProps {
  articleId: string;
  buttonText?: string;
  className?: string;
}

const DeleteArticleButton: React.FC<DeleteArticleButtonProps> = ({ 
  articleId, 
  buttonText = 'Удалить', 
  className = 'text-sm text-white/70 hover:text-white transition'
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = apiUrl ? `${apiUrl}/api/articles?id=${articleId}` : `/api/articles?id=${articleId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении статьи');
      }

      // Обновляем список статей
      router.refresh();
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
      alert('Не удалось удалить статью. Попробуйте еще раз позже.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleCancel}
          className="text-sm text-white/70 hover:text-white transition"
          disabled={isDeleting}
        >
          Отмена
        </button>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-400 transition"
          disabled={isDeleting}
        >
          {isDeleting ? 'Удаление...' : 'Подтвердить'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className={className}
      disabled={isDeleting}
    >
      {isDeleting ? 'Удаление...' : buttonText}
    </button>
  );
};

export default DeleteArticleButton; 