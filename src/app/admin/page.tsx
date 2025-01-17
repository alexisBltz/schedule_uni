'use client'

import { useState, useRef } from 'react';
import { TabGroup, TabList, Tab } from '@headlessui/react';
import { BookOpen, Beaker } from 'lucide-react';

import Search from '@/components/dashboard/Search';
import FloatingActionButton from '@/components/ui/floatingButton';
import TablaCursos from '@/components/dashboard/TablaCursos';
import FormCourse from '@/components/dashboard/form/formCourse';
import Modal from '@/components/ui/modal';
import  HomeIcon from '@/components/ui/homeIcon';

import { Course } from '@/types/course';
import { createCourse } from '@/util/api';

const CourseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const refreshTableRef = useRef<() => void>(() => {});

  const handleCreateCourse = async (data: Course) => {
    try {
      await createCourse({
        nombre: data.nombre,
        color: data.color,
        tipo: selectedTab === 0 ? 'TEORIA' : 'LABORATORIO'
      });
      setIsModalOpen(false);
      refreshTableRef.current();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const setRefreshFunction = (refreshFn: () => void) => {
    refreshTableRef.current = refreshFn;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 md:mb-8">
          <div className="flex items-center gap-2">
            <HomeIcon />
            <h1 className="text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Cursos
            </h1>
          </div>
          <div className="w-full sm:w-72">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-2 md:p-6">
          <TabGroup onChange={setSelectedTab}>
            <TabList className="flex space-x-4 border-b border-gray-200">
              {[
                { name: 'Teoría', icon: BookOpen },
                { name: 'Laboratorio', icon: Beaker }
              ].map(({ name, icon: Icon }) => (
                <Tab
                  key={name}
                  className={({ selected }) =>
                    `flex items-center gap-2 px-6 py-3 font-medium md:text-base text-sm outline-none transition-all duration-300 ease-in-out 
                    ${
                      selected
                        ? 'text-indigo-600 border-indigo-600 bg-indigo-100 shadow-md rounded-lg '
                        : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Tab>
              ))}
            </TabList>

            <TablaCursos onSetRefresh={setRefreshFunction} searchQuery={searchQuery}/>
          </TabGroup>
        </div>

        {/* Floating Button */}
        <FloatingActionButton 
          onClick={() => setIsModalOpen(true)} 
        />
        
        {/* Modal for Creating/Editing Course */}
        {isModalOpen && (
          <Modal 
            onClose={() => setIsModalOpen(false)}
            title={'Agregar Nuevo Curso'} 
            description={`Ingrese los detalles del nuevo curso de ${selectedTab === 0 ? 'Teoría' : 'Laboratorio'}`}
          >
            <FormCourse
              type={selectedTab === 0 ? 'theory' : 'lab'}
              onSubmit={handleCreateCourse}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CourseDashboard;