import {useDroppable} from '@dnd-kit/core';

type DroppableProps = {
  id: string,
  children?: React.ReactNode,
}

export function Droppable(props: DroppableProps) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    backgroundColor: isOver ? 'green' : undefined,
  };

  return (
    <div ref={ setNodeRef } style={ style }>
      { props.children }
    </div>
  );
}
