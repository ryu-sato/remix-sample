import { Prisma } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { DndContext } from '@dnd-kit/core';
import SwimlaneTableData from "./SwimlaneTableData";

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

  return (
    <tr key={ swimlane.id }>
      <DndContext>
        <td>{ swimlane.title }</td>
        {
          ['OPEN', 'INPROGRESS', 'TOVERIFY', 'FEEDBACK', 'DONE', 'REJECT'].map((status) => (
            <SwimlaneTableData
              key={ `${swimlane.id}_${status}` }
              id={ `${swimlane.id}_${status}` }
              tasks={ swimlane.tasks.filter((task) => task.status === status) }
            />
          ))
        }
      </DndContext>
    </tr>
  )
}
