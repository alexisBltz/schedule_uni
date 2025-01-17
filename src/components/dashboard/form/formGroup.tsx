import React, { useState, useMemo } from 'react';
import { X, Clock } from 'lucide-react';
import { DAYS, GROUPS, TIME_INI, TIME_FIN } from '@/data/data';
import { Group, TimeSlot, Course } from '@/types/course';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';

interface FormGroupProps {
  initialData?: Group | null;
  parentCourse?: Course;  // Cambiado a Course completo en lugar de solo ID
  onSubmit: (data: Group) => void;
}

const FormGroup = ({ initialData, parentCourse, onSubmit }: FormGroupProps) => {
  const [formData, setFormData] = useState<Group>({
    id: initialData?.id ?? 0,
    grupo: initialData?.grupo || '',
    horarios: initialData?.horarios || [{
      id: 0,
      dia: 'LUNES',
      hora_ini: '',
      hora_fin: ''
    }]
  });

  // Filtrar grupos ya utilizados
  const availableGroups = useMemo(() => {
    const usedGroups = new Set(parentCourse?.grupos?.map(g => g.grupo) || []);
    return GROUPS.filter(group => !usedGroups.has(group));
  }, [parentCourse?.grupos]);

  // Convertir grupos disponibles a options
  const groupOptions = availableGroups.map(group => ({
    value: group,
    label: `Grupo ${group}`
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      horarios: [...(prev.horarios || []), {
        id: Math.random(),
        dia: 'LUNES',
        hora_ini: '',
        hora_fin: ''
      }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      horarios: prev.horarios?.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    setFormData(prev => ({
      ...prev,
      horarios: prev.horarios?.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const isEmptyTimeSlot = (slot: TimeSlot) => {
    return !slot.hora_ini && !slot.hora_fin;
  };

  const dayOptions = DAYS.map(day => ({
    value: day,
    label: day
  }));

  const timeIniOptions = TIME_INI.map(time => ({
    value: time,
    label: time
  }));

  const timeFinOptions = TIME_FIN.map(time => ({
    value: time,
    label: time
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo para mostrar el nombre del curso */}
      <Input
        id="curso_nombre"
        label="Curso:"
        value={parentCourse?.nombre || ''}
        onChange = {() => {}}
        disabled={true}
      />

      <div>
        <Select
          id="group"
          label="Grupo"
          value={formData.grupo}
          onChange={(e) => setFormData(prev => ({ ...prev, grupo: e.target.value }))}
          options={groupOptions}
          placeholder="Seleccionar grupo"
          required
        />
        {groupOptions.length === 0 && (
          <p className="mt-2 text-sm text-red-500">
            No hay grupos disponibles para este curso
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            Horarios
          </label>
          {formData.horarios?.some(isEmptyTimeSlot) && (
            <span className="text-sm text-red-500">
              Completa todos los campos
            </span>
          )}
        </div>

        <div className="space-y-2 md:space-y-3">
          {formData.horarios?.map((slot, index) => (
            <div 
              key={slot.id} 
              className={`flex gap-1 md:gap-2 items-center px-1 md:px-2 py-3 pb-2 rounded-lg border transition-all duration-200
                ${isEmptyTimeSlot(slot) 
                  ? 'bg-gray-50 border-red-100/90' 
                  : 'bg-white border-gray-50'}`}
            >
              <div className="w-28 lg:w-36 text-sm lg:text-base">
                <Select
                  id={`day-${index}`}
                  label="Día"
                  value={slot.dia}
                  onChange={(e) => updateTimeSlot(index, 'dia', e.target.value)}
                  options={dayOptions}
                  required
                />
              </div>

              <div className="relative flex-1 text-[15px] lg:text-base">
                <Select
                  id={`time-ini-${index}`}
                  label="Inicio"
                  value={slot.hora_ini}
                  onChange={(e) => updateTimeSlot(index, 'hora_ini', e.target.value)}
                  options={timeIniOptions}
                  placeholder='-- : --'
                  required
                />
                <Clock className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 translate-x-14 w-4 h-4 text-gray-400 z-10" />
              </div>

              <div className="relative flex-1">
                <Clock className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 translate-x-14 w-4 h-4 text-gray-400 z-10" />
                <Select
                  id={`time-fin-${index}`}
                  label="Fin"
                  value={slot.hora_fin}
                  onChange={(e) => updateTimeSlot(index, 'hora_fin', e.target.value)}
                  options={timeFinOptions}
                  placeholder='-- : --'
                  required
                />
              </div>

              {index > 0 && (
                <Button
                  onClick={() => removeTimeSlot(index)}
                  variant="outline"
                  className="md:w-auto hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={addTimeSlot}
          type="button"
          variant="outline"
          className="mt-4 w-full border-dashed hover:border-solid hover:bg-gray-50 transition-all"
        >
          + Agregar Horario
        </Button>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors
                 disabled:bg-blue-300 disabled:cursor-not-allowed"
        disabled={!formData.grupo || formData.horarios?.some(isEmptyTimeSlot) || groupOptions.length === 0}
      >
        {initialData ? 'Guardar Cambios' : 'Crear Grupo'}
      </Button>
    </form>
  );
};

export default FormGroup;