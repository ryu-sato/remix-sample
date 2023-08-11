import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Droppable } from "~/components/Droppable";
import { DraggableTask } from "~/domains/tasks/DraggableTask";

type SwimlaneTableDataProps = {
  id: string,
  tasks: SerializeFrom<Task[]>,
}

export function SwimlaneTableData(props: SwimlaneTableDataProps) {
  return (
    <td>
      <Droppable id={ props.id }>
        <SortableContext
          items={ props.tasks.map(it => String(it.id)) }
          strategy={ rectSortingStrategy }
        >
          <div style={{ width: "300px", height: "300px" }}>
            { props.tasks.map((task) => <DraggableTask key={ String(task.id) } { ...task } />) }
          </div>
        </SortableContext>
      </Droppable>
    </td>
  )
}
