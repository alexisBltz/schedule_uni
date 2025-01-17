import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const Select = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  placeholder,
  disabled = false
}: CustomSelectProps) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white border border-gray-200 rounded-xl shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  transition-all duration-200 peer appearance-none"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default Select;