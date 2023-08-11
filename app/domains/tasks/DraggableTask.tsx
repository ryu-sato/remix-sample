import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { SortableItem } from "~/components/SortableItem";

export function DraggableTask(task: SerializeFrom<Task>) {
  if (task == null) {
    return <></>
  }

  return (
    <SortableItem id={ String(task.id) }>
      <button style={{ width: "100px", height: "100px" }}>
        { task.title }
      </button>
    </SortableItem>
  )
}
