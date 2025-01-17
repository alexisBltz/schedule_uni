import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ 
  title, 
  children, 
  rightContent,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between pr-0 xl:pr-8 2xl:pr-12 rounded-lg p-0 xl:p-1">
        {typeof title === 'string' ? (
          <p>{title}</p>
        ) : (
          title
        )}
        <div className="flex items-center gap-4">
          {rightContent}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-50 rounded-full transition-all duration-300 ease-in-out"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;