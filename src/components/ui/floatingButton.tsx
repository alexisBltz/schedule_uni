import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon = <Plus size={24} />,
  position = 'bottom-right',
  className = '',
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6 lg:bottom-14 lg:right-14 xl:bottom-18 xl:right-18 2xl:bottom-24 2xl:right-24',
    'bottom-left': 'bottom-6 left-6 lg:bottom-14 lg:left-14 xl:bottom-18 xl:left-18 2xl:bottom-24 2xl:left-24',
    'top-right': 'top-6 right-6 lg:top-14 lg:right-14 xl:top-18 xl:right-18 2xl:top-24 2xl:right-24',
    'top-left': 'top-6 left-6 lg:top-14 lg:left-14 xl:top-18 xl:left-18 2xl:top-24 2xl:left-24',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed 
        ${positionClasses[position]}
        w-12 lg:w-14 xl:w-16
        h-12 lg:h-14 xl:h-16
        bg-blue-500 
        text-white 
        rounded-full 
        shadow-lg 
        flex 
        items-center 
        justify-center 
        hover:bg-blue-600 
        transition-colors
        hover:scale-105
        active:scale-95
        transform
        duration-200
        ${className}
      `}
      aria-label="Add new item"
    >
      {icon}
    </button>
  );
};

export default FloatingActionButton;

