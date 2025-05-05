'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiCheckLine, RiCheckDoubleLine } from 'react-icons/ri';

interface AcknowledgeButtonProps {
  articleId: string;
  userId: string;
  isAcknowledged?: boolean;
}

const AcknowledgeButton: React.FC<AcknowledgeButtonProps> = ({ 
  articleId, 
  userId,
  isAcknowledged = false
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acknowledged, setAcknowledged] = useState(isAcknowledged);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleAcknowledge = async () => {
    if (acknowledged) {
      return; // Если уже ознакомлен, ничего не делаем
    }
    
    setIsSubmitting(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = apiUrl ? `${apiUrl}/api/articles/acknowledge` : '/api/articles/acknowledge';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          articleId,
          userId 
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при подтверждении ознакомления');
      }

      // Обновляем состояние
      setAcknowledged(true);
      setShowSuccess(true);
      
      // Обновляем данные на странице
      router.refresh();
      
      // Скрываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отметке ознакомления:', error);
      alert('Не удалось отметить ознакомление. Попробуйте еще раз позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {showSuccess && (
        <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-lg mb-4">
          Вы успешно отметили ознакомление с этой статьей.
        </div>
      )}
      
      <button 
        onClick={handleAcknowledge}
        className={`btn-primary flex items-center ${acknowledged ? 'bg-green-600 hover:bg-green-700' : ''}`}
        disabled={isSubmitting || acknowledged}
      >
        {acknowledged ? (
          <>
            <RiCheckDoubleLine className="mr-2" size={20} />
            Вы ознакомились с регламентом
          </>
        ) : (
          <>
            <RiCheckLine className="mr-2" size={20} />
            {isSubmitting ? 'Сохранение...' : 'Ознакомлен с регламентом'}
          </>
        )}
      </button>
    </div>
  );
};

export default AcknowledgeButton; 