import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Draggable } from "~/components/Draggable";
import { SortableItem } from "~/components/SortableItem";

export default function DraggableTask(task: SerializeFrom<Task>) {
  if (task == null) {
    return <></>
  }

  return (
    <SortableItem
      id={ String(task.id) }
    >
      <Draggable id={ String(task.id) }>
        <div style={{ width: "100px", height: "100px" }}>
          { task.title }
        </div>
      </Draggable>
    </SortableItem>
  )
}
