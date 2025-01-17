import React, { useState } from 'react';
import TableTh from './TableTh';
import TableRow from './TableRow';
import Modal from '@/components/ui/modal';
import FormCourse from '@/components/dashboard/form/formCourse';
import FormGroup from '../form/formGroup';
import type { Course, Group } from '@/types/course';
import DeleteDialog from '@/components/ui/deleteDialog';
import { deleteCourse, updateCourse, deleteGroup, createGroupSchedules } from '@/util/api';

export interface DataRowProps {
  course: Course;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
  onAddGroup: (course: Course) => void;
  onDeleteGroup: (group: Group) => void;
}

type DeleteItem = {
  type: 'course' | 'group';
  item: Course | Group;
  name: string;
};

const DataTable: React.FC<{ data: Course[]; onRefresh: () => void }> = ({ data, onRefresh }) => {
  const [selectedItem, setSelectedItem] = useState<{ 
    course?: Course, 
    group?: Group,
    parentCourse?: Course 
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<DeleteItem | null>(null);

  const handleEditCourse = async (course: Course) => {
    setSelectedItem({ course });
    setIsModalOpen(true);
  };
  
  const handleSubmitEdit = async (updatedCourse: Course) => {
    try {
      await updateCourse({
        id: updatedCourse.id,
        nombre: updatedCourse.nombre,
        color: updatedCourse.color,
        tipo: updatedCourse.tipo
      });
      setIsModalOpen(false);
      onRefresh(); 
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = (course: Course) => {
    setDeleteItem({ type: 'course', item: course, name: course.nombre });
  };

  const handleAddGroup = (course: Course) => {
    console.log('Adding group to course:', course.nombre);
    setSelectedItem({ parentCourse: course });  
    setIsModalOpen(true);
  };

  const handleSubmitGroup = async (groupData: Group) => {
    try {
      if (selectedItem?.parentCourse) {
        await createGroupSchedules({
          curso_id: selectedItem.parentCourse.id,
          grupo: groupData.grupo,
          horarios: groupData.horarios
        });
        setIsModalOpen(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleDeleteGroup = (group: Group) => {
    setDeleteItem({ type: 'group', item: group, name: `Grupo ${group.grupo}` });
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      if (deleteItem.type === 'course') {
        await deleteCourse({
          id: deleteItem.item.id,
        });
      } else if (deleteItem.type === 'group') {
        await deleteGroup({
          id: deleteItem.item.id,
        });
      }
      setDeleteItem(null);
      onRefresh();
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  if (!data || data.length === 0) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-lg">
        <div className="relative overflow-x-auto rounded-md md:rounded-xl">
          <div className="w-full border border-slate-200 rounded-xl">
            <table className="w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <TableTh text="ID" width="w-12 hidden md:table-cell"/>
                  <TableTh text="Color" width="w-16" />
                  <TableTh text="Nombre" width="w-[260px] lg:w-[360px] min-w-52"/>
                  <TableTh text="Grupos" />
                  <TableTh text="Ed/El" width="w-8"/>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.map((course) => (
                  <TableRow 
                    key={course.id} 
                    course={course}
                    onEditCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onAddGroup={() => handleAddGroup(course)}
                    onDeleteGroup={handleDeleteGroup}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && selectedItem && (
        <Modal 
          onClose={() => setIsModalOpen(false)} 
          title={selectedItem.course ? "Editar Curso" : "Agregar Nuevo Grupo"}
          description={selectedItem.course 
            ? "Modifique los detalles del curso" 
            : `Ingrese los detalles del nuevo grupo de "${selectedItem.parentCourse?.nombre}"`}
          width='lg:max-w-lg'
        >
          {selectedItem.course ? (
            <FormCourse 
              type={selectedItem.course.tipo === 'TEORIA' ? 'theory' : 'lab'}
              initialData={selectedItem.course}
              onSubmit={handleSubmitEdit}
            />
          ) : (
            <FormGroup 
              initialData={null}
              parentCourse={selectedItem.parentCourse}  // Pasar el curso completo
              onSubmit={handleSubmitGroup}
            />
          )}
        </Modal>
      )}

      {deleteItem && (
        <DeleteDialog 
          onConfirm={handleDelete}
          isOpen={!!deleteItem} 
          onClose={() => setDeleteItem(null)}
          title="Confirmar eliminación"
          description={`¿Estás seguro de que deseas eliminar ${deleteItem.type === 'course' ? 'este curso' : 'este grupo'}?`}
          itemName={deleteItem.name}
        />
      )}
    </>
  );
};

export default DataTable;