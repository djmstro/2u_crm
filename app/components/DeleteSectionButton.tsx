'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteSectionButtonProps {
  sectionId: string;
  buttonText?: string;
  className?: string;
}

const DeleteSectionButton: React.FC<DeleteSectionButtonProps> = ({ 
  sectionId, 
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
      const response = await fetch(`/api/sections?id=${sectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении раздела');
      }

      // Обновляем список разделов
      router.refresh();
    } catch (error) {
      console.error('Ошибка при удалении раздела:', error);
      alert('Не удалось удалить раздел. Возможно, он содержит статьи или подразделы.');
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

export default DeleteSectionButton; 