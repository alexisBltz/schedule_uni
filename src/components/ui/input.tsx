interface CustomInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const Input = ({ 
  id, 
  label, 
  value, 
  onChange, 
  required = false,
  placeholder,
  disabled = false 
}: CustomInputProps) => {
  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 transition-all duration-200 peer placeholder-transparent"
      />
      <label 
        htmlFor={id}
        className="absolute left-2 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600
                 transition-all duration-200 peer-placeholder-shown:top-3 
                 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-400
                 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-blue-500
                 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;