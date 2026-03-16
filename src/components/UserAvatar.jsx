import React from 'react';
import { User } from 'lucide-react';

const UserAvatar = ({ user, className }) => {
  // 1. Если есть фото от Google — показываем его (круглое)
  if (user.picture) {
    return (
      <img 
        src={user.picture} 
        className={`${className} rounded-full object-cover border border-[var(--glass-border)]`} 
        alt={user.name} 
      />
    );
  }

  // 2. Если фото нет — показываем простую заглушку (как ты просил)
  return (
    <div className={`${className} rounded-full flex items-center justify-center bg-[var(--input-bg)] border border-[var(--glass-border)] overflow-hidden`}>
       {/* Иконка человека, залитая цветом (fill) */}
       <User 
         className="w-3/5 h-3/5 text-[var(--text-color)] opacity-40" 
         fill="currentColor" 
         strokeWidth={0} // Убираем обводку, оставляем только заливку для силуэта
       />
    </div>
  );
};

export default UserAvatar;