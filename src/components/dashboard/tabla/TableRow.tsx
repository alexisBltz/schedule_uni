import TableTd from './TableTd';
import type { DataRowProps } from './DataTable';

import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';
import Accordion from '@/components/ui/acordion';
import GroupCard from '@/components/ui/groupCard';
import { Plus } from 'lucide-react';

const TableRow: React.FC<DataRowProps> = ({ course, onEditCourse, onDeleteCourse, onAddGroup, onDeleteGroup }) => {
  const numGrupos = course.grupos ? course.grupos.length : 0;
  const hasGroups = numGrupos > 0;

  return (
    <tr 
      className={`
        text-sm lg:text-base transition-all duration-200 
        ${hasGroups 
          ? 'hover:bg-indigo-50 odd:bg-white even:bg-slate-50/50' 
          : 'bg-red-100 hover:bg-red-200'
        } 
        cursor-pointer group
      `}
    >
      <TableTd className="hidden md:table-cell">{course.id}</TableTd>
      <TableTd><RowColor color={course.color} /></TableTd>
      <TableTd>{course.nombre}</TableTd>
      
      <TableTd>
        {hasGroups ? (
          <Accordion title={`${numGrupos} grupo(s)`} className="w-full">
            <div className="grid xl:grid-cols-2 gap-1 md:gap-2 min-w-48">
              {course.grupos?.map((grupo) => (
                <GroupCard 
                  key={grupo.id}
                  group={grupo}
                  onDeleteGroup={() => onDeleteGroup(grupo)}
                />
              ))}
            </div>
            <div className='p-0 m-0 pt-1 md:pt-2'>
              <AddGroupButton text='Agregar' 
                onClick={() => onAddGroup({id: 0, grupo: '', curso_id: course.id}) /* corregir a futuro*/} 
              />
            </div>
          </Accordion>
        ) : (
          <div className="flex flex-row items-center justify-between lg:px-2 md:gap-0 gap-4">
            <p>No hay grupos</p>
            <AddGroupButton text='Agregar' 
              onClick={() => onAddGroup({id: 0, grupo: '', curso_id: course.id}) /* corregir a futuro*/} 
            />
          </div>
        )}
      </TableTd>
      <TableTd>
        <div className="flex items-center gap-1">
          <EditButton onClick={() => onEditCourse(course)} />
          <DeleteButton onClick={() => onDeleteCourse(course)} />
        </div>
      </TableTd>
    </tr>
  );
};

const RowColor = ({ color }: { color: string }) => {
    return (
        <div className="flex items-center gap-2">
            <div
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
            />
            {color}
        </div>
    );
}

const AddGroupButton = ({ text, onClick }: { text: string; onClick: () => void }) => (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        className="w-full bg-white text-gray-500 border border-gray-200 rounded-lg p-1 xl:p-3  flex items-center justify-center space-x-2 hover:bg-indigo-100 transition-colors duration-300 shadow-sm hover:shadow-md"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium text-sm xl:text-base">{text}</span>
      </button>
    </div>
);

export default TableRow;