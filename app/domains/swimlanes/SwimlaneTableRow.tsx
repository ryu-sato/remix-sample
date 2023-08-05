import { Prisma } from "@prisma/client";
import DraggableTask from "../tasks/DraggableTask";
import type { SerializeFrom } from "@remix-run/node";
import { Droppable } from "~/components/Droppable";

const swimlaneWithTasks = Prisma.validator<Prisma.SwimlaneArgs>()({
  include: {
    tasks: true,
  }
});
type SwimlaneWithTasks = Prisma.SwimlaneGetPayload<typeof swimlaneWithTasks>

export default function SwimlaneTableRow(swimlane: SerializeFrom<SwimlaneWithTasks>) {
  if (swimlane == null) {
    return <></>
  }

  const getTasksByState = (status: string) => {
    return swimlane
      .tasks
      .filter((task) => task.status === status)
      .map((task) => <DraggableTask key={ task.id } { ...task } />);
  }

  const taskStatuses = ['OPEN', 'INPROGRESS', 'TOVERIFY', 'FEEDBACK', 'DONE', 'REJECT'];

  return (
    <tr key={ swimlane.id }>
      <td>{ swimlane.title }</td>
      {
        taskStatuses.map((state) => {
          const id = `${swimlane.id}_${state}`;
          return (
            <td key={ id }>
              <Droppable id={ id }>
                <div style={{ width: "300px", height: "300px" }}>
                  { getTasksByState(state) }
                </div>
              </Droppable>
            </td>
          )
        })
      }
    </tr>
  )
}
