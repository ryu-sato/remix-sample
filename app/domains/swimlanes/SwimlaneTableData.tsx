import type { Task } from "@prisma/client";
import DraggableTask from "../tasks/DraggableTask";
import type { SerializeFrom } from "@remix-run/node";
import { Droppable } from "~/components/Droppable";
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";

type SwimlaneTableDataProps = {
  id: string,
  tasks: SerializeFrom<Task[]>,
}

export default function SwimlaneTableData(props: SwimlaneTableDataProps) {
  const [orderedTasks, setOrderedTasks] = useState(props.tasks);

  if (props.tasks == null) {
    return <></>
  }

  return (
    <td>
      <DndContext
        onDragEnd={ handleDragEnd }
      >
        <SortableContext
          items={ orderedTasks.map(it => String(it.id)) }
          strategy={ rectSortingStrategy }
        >
          <Droppable id={ props.id }>
            <div style={{ width: "300px", height: "300px" }}>
              { orderedTasks.map((task) => <DraggableTask key={ String(task.id) } { ...task } />) }
            </div>
          </Droppable>
        </SortableContext>
      </DndContext>
    </td>
  )

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setOrderedTasks((orderedTasks) => {
        const oldIndex = orderedTasks.findIndex(task => String(task.id) === active.id);
        const newIndex = orderedTasks.findIndex(task => String(task.id) === over.id);

        return arrayMove(orderedTasks, oldIndex, newIndex);
      });
    }
  }
}
