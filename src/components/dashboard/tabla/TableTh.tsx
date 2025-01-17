const TableTh: React.FC<{ text: string; width?: string }> = ({ text, width }) => {
  return (
    <th
      className={`px-4 lg:px-6 py-3 lg:py-4  text-left text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-indigo-700 to-indigo-500 text-white ${
        width ? width : "" 
      }`}
    >
      <div className="flex items-center space-x-2">
        <span>{text}</span>
      </div>
    </th>
  );
};

export default TableTh;
