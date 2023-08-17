import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { DraggableTask } from "~/domains/tasks/DraggableTask";

type SwimlaneTasksProps = {
  id: string,
  tasks: SerializeFrom<Task[]>,
}

export function SwimlaneTasks(props: SwimlaneTasksProps) {
  return (
    <SortableContext
      items={ props.tasks.map(it => String(it.id)) }
      strategy={ rectSortingStrategy }
    >
      { props.tasks.map((task) => <DraggableTask key={ String(task.id) } { ...task } />) }
    </SortableContext>
  )
}
