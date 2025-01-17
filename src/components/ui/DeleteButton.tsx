import React from 'react';
import { Trash2 } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}


const DeleteButton: React.FC<ActionButtonProps> = ({ onClick, disabled = false, label = "Delete" }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onClick();
        }}
        disabled={disabled}
        className="relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 
          text-red-600 hover:text-white hover:bg-red-600 
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95 hover:scale-105
          isolate overflow-hidden"
        title={label}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    );
    };

export default DeleteButton;