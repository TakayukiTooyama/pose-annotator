import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { MarkerDndListItem } from '@/components/Marker';
import { useMarkerSetting } from '@/store';
import type { MarkerOption } from '@/types';

type Props = {
  options: MarkerOption[];
};

export const MarkerDndList: FC<Props> = ({ options }) => {
  const [dndOptions, setDndOptions] = useState(options);
  const { updateMarkerOptions } = useMarkerSetting();

  useEffect(() => {
    setDndOptions(options);
  }, [options]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = dndOptions.findIndex((marker) => marker.id === active.id);
      const newIndex = dndOptions.findIndex((marker) => marker.id === over.id);
      setDndOptions((prev) => arrayMove([...prev], oldIndex, newIndex));
      updateMarkerOptions(arrayMove([...dndOptions], oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={dndOptions} strategy={verticalListSortingStrategy}>
        <div className='grid gap-2'>
          {dndOptions.map((marker) => (
            <MarkerDndListItem key={marker.id} marker={marker} markers={options} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
