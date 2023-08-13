import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

type SortableItemProps = {
  id: string,
  children: React.ReactNode,
}

export function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={ setNodeRef }
      style={{
        ...style,
        cursor: "move",
      }}
      { ...attributes }
      { ...listeners }
    >
      { props.children }
    </button>
  );
}
