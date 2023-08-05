import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Draggable } from "~/components/Draggable";

export default function DraggableTask(task: SerializeFrom<Task>) {
  if (task == null) {
    return <></>
  }

  return (
    <Draggable id={ String(task.id) }>
      <div style={{ width: "100px", height: "100px" }}>
        { task.title }
      </div>
    </Draggable>
  )
}
