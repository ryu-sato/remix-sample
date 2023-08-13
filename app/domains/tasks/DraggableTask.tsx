import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { SortableItem } from "~/components/SortableItem";

export function DraggableTask(task: SerializeFrom<Task>) {
  if (task == null) {
    return <></>
  }

  return (
    <SortableItem id={ String(task.id) }>
      <div style={{ width: "100px", height: "100px" }}>
        <div>
          <Link
            to={ "/tasks/" + String(task.id) }
          >
            { task.id }
          </Link>
        </div>

        { task.title }
      </div>
    </SortableItem>
  )
}
