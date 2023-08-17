import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { SortableItem } from "~/components/SortableItem";

export function DraggableTask(task: SerializeFrom<Task>) {
  if (task == null) {
    return <></>
  }

  return (
    <SortableItem
      id={ String(task.id) }
      className="card d-inline-flex m-1"
      style={{
        width: "150px",
        height: "150px",
      }}
    >
      <div
        className="card-body"
      >
        <div
          className="d-flex"
        >
          <Link
            to={ `/tasks/${ task.id }` }
            className="d-inline-block flex-fill"
          >
            { task.id }
          </Link>
          <div>
            <Link
              to={ `./tasks/${ task.id }` }
              replace={ true }
            >
              <span
                className="btn btn-sm btn-outline-secondary"
              >
                &#9998;
              </span>
            </Link>
          </div>
        </div>

        { task.title }
      </div>
    </SortableItem>
  )
}
