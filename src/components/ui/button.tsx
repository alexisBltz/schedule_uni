interface CustomButtonProps {
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "outline" | "color";
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    disabled?: boolean;
  }
  
const Button = ({
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    children,
    style,
    disabled = false 
  }: CustomButtonProps) => {
    const baseStyles = "px-2 md:px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
      outline: "border-2 border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
      color: "w-8 h-8 rounded-full p-0 hover:ring-2 hover:ring-offset-2 hover:ring-sky-500"
    };
  
    return (
      <button
        onClick={onClick}
        type={type}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        style={style}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

export default Button;