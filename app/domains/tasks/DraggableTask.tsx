import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createSearchParams } from "react-router-dom";
import { SortableItem } from "~/components/SortableItem";

export function DraggableTask(task: SerializeFrom<Task>) {
  if (task == null) {
    return <></>
  }

  return (
    <SortableItem id={ String(task.id) }>
      <div style={{ width: "100px", height: "100px" }}>
        <Link
          to={ "/tasks/" + String(task.id) }
        >
          <div>
            { task.id }
          </div>
        </Link>

        { task.title }

        <Link
          to={{
            search: createSearchParams({
              taskId: String(task.id),
            }).toString(),
          }}
          preventScrollReset={ true }
          replace={ true }
          reloadDocument={ false }
        >
          <button>
            &#9998;
          </button>
        </Link>
      </div>
    </SortableItem>
  )
}
