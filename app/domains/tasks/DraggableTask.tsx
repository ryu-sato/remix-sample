import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
// import { useDrag } from "react-dnd";

export default function DraggableTask(task: SerializeFrom<Task>) {
  // const [{ opacity }, dragRef] = useDrag(
  //   () => ({
  //     type: 'TASK',
  //     item: { id: task.id },
  //     collect: (monitor) => ({
  //       opacity: monitor.isDragging() ? 0.5 : 1
  //     })
  //   }),
  //   []
  // )

  if (task == null) {
    return <></>
  }

  return (
    // <div key={ task.id } ref={ dragRef } style={{ opacity }}>
    <div>
      { task.title }
    </div>
  )
}
