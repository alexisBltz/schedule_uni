import React from 'react';
import { Pencil} from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

const EditButton: React.FC<ActionButtonProps> = ({ onClick, disabled = false, label = "Edit" }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onClick();
        }}
        disabled={disabled}
        className="relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 
          text-blue-600 hover:text-white hover:bg-blue-600 
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95 hover:scale-105
          isolate overflow-hidden"
        title={label}
      >
        <Pencil className="w-5 h-5" />
      </button>
    );
};

export default EditButton;