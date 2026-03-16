import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Pencil, ShieldPlus, Settings, Trash2, MoreVertical } from 'lucide-react';

const ActionMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* КНОПКА ТРИ ТОЧКИ */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
      >
        <MoreVertical size={20} />
      </button>

      {/* ВЫПАДАЮЩЕЕ МЕНЮ */}
      {isOpen && (
        <MenuContainer className="absolute right-0 top-full z-50 mt-2">
          <div className="card">
            <ul className="list">
              {/* РЕДАКТИРОВАТЬ */}
              <li className="element" onClick={() => handleAction(onEdit)}>
                <Pencil size={16} />
                <p className="label">Изменить</p>
              </li>
            </ul>
            <div className="separator" />
            <ul className="list">
              {/* УДАЛИТЬ */}
              <li className="element delete" onClick={() => handleAction(onDelete)}>
                <Trash2 size={16} />
                <p className="label">Удалить</p>
              </li>
            </ul>
          </div>
        </MenuContainer>
      )}
    </div>
  );
};

// ТВОЙ STYLED COMPONENT (с небольшими правками позиционирования)
const MenuContainer = styled.div`
  .card {
    width: 180px;
    background-color: rgba(36, 40, 50, 1);
    background-image: linear-gradient(139deg, rgba(36, 40, 50, 1) 0%, rgba(36, 40, 50, 1) 0%, rgba(37, 28, 40, 1) 100%);
    border-radius: 10px;
    padding: 10px 0px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .card .separator {
    border-top: 1px solid #42434a;
    margin: 4px 0;
  }

  .card .list {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0px 8px;
  }

  .card .list .element {
    display: flex;
    align-items: center;
    color: #9ca3af;
    gap: 10px;
    transition: all 0.2s ease-out;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
  }

  .card .list .element .label {
    font-weight: 500;
    font-size: 13px;
    line-height: 1;
  }

  .card .list .element:hover {
    background-color: var(--accent-color, #5353ff);
    color: #ffffff;
    transform: translateX(2px);
  }

  .card .list .delete:hover {
    background-color: #ef4444; /* Красный tailwind */
    color: white;
  }

  .card .list .element:active {
    transform: scale(0.98);
  }
`;

export default ActionMenu;