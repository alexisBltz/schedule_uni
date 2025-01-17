const TableTd: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <td className={`px-2 lg:px-6 py-2 lg:py-4 whitespace-normal text-slate-600 group-hover:text-indigo-800 ${className}`}>
      {children}
    </td>
  );
};

export default TableTd;