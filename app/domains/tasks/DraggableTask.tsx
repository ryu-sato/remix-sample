import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

export default function DraggableTask(task: SerializeFrom<Task>) {
  if (task == null) {
    return <></>
  }

  return (
    <div>
      { task.title }
    </div>
  )
}
