import React from 'react';
import { Group, TimeSlot } from '@/types/course';
import DeleteButton from '@/components/ui/DeleteButton';

interface GroupCardProps {
  group: Group;
  onDeleteGroup: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onDeleteGroup }) => {
  const formatTimeSlot = (slot: TimeSlot) => {
    return `${slot.hora_ini} - ${slot.hora_fin}`;
  };

  return (
    <div className="bg-white rounded-lg px-2 py-2 md:px-3 md:py-3 shadow-sm border border-gray-200">
      <div className="md:space-y-1">
        {/* Header con título y botones */}
        <div className="flex justify-between items-center">
          <h4 className="text-[14px] md:text-[15px] font-bold text-gray-700">
            Grupo {group.grupo}
          </h4>
          <DeleteButton onClick={() => onDeleteGroup(group)} />
        </div>

        {/* Horarios */}
        <div className="my-0 md:space-y-1">
          {group.horarios?.map((slot, index) => (
            <div key={index} className="flex flex-col -space-y-0.5">
              <span className="text-[13px] text-blue-500 font-medium">
                {slot.dia} {formatTimeSlot(slot)}
              </span>
              {/*<span className="text-[12px] text-gray-600">
                {formatTimeSlot(slot)}
              </span>*/}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;