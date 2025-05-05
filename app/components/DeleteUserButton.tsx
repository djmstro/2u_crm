'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface DeleteUserButtonProps {
  userId: string;
  buttonText?: string;
  className?: string;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ 
  userId, 
  buttonText = 'Удалить', 
  className = 'p-2 rounded hover:bg-white/10 transition text-white/70 hover:text-red-400'
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
      const url = apiUrl ? `${apiUrl}/api/users?id=${userId}` : `/api/users?id=${userId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя');
      }

      // Обновляем список пользователей
      router.refresh();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      alert('Не удалось удалить пользователя. Попробуйте еще раз позже.');
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
      {buttonText === 'Удалить' ? <RiDeleteBin6Line size={18} /> : buttonText}
    </button>
  );
};

export default DeleteUserButton; 