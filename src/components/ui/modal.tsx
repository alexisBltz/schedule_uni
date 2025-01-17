import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  width?: string;
}

const Modal = ({ onClose, children, title, description, width }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
          <div
            className={`
              relative bg-white rounded-2xl
              w-full max-w-md ${width}
              shadow-2xl border border-gray-200
              transition-all duration-300 ease-out
              transform origin-center
              ${isOpen 
                ? 'scale-100 opacity-100 translate-y-0' 
                : 'scale-95 opacity-0 translate-y-4'
              }
            `}
          >
            {/* Header */}
            <div className="p-6 pb-0">
              {title && (
                <div className="flex justify-between items-center gap-4 ">
                  <h2 className="text-xl 2xl:text-2xl font-semibold text-gray-900">
                    {title}
                  </h2>
                  <button 
                    onClick={handleClose}
                    className="rounded-full p-2 text-gray-400 hover:text-gray-700 
                             hover:bg-gray-100
                             transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              {description && (
                <p className="text-sm 2xl:text-base text-gray-600 mb-2 md:mb-3">
                  {description}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;