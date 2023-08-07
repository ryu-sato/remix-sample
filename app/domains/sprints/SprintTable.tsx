import type { SerializeFrom } from "@remix-run/node";
import SwimlaneTableRow from "../swimlanes/SwimlaneTableRow";
import { Prisma } from "@prisma/client";
import { DndContext } from '@dnd-kit/core';
import SwimlaneTableHeader from "../swimlanes/SwimlaneTableHeader";

const sprintWithSwimlanes = Prisma.validator<Prisma.SprintArgs>()({
  include: {
    swimlanes: {
      include: {
        tasks: true,
      },
    },
  },
});
type SprintWithSwimlanes = Prisma.SprintGetPayload<typeof sprintWithSwimlanes>

export default function SprintTable(sprint: SerializeFrom<SprintWithSwimlanes>) {
  if (sprint == null) {
    return <></>
  }

  const orderedTaskStatuses = ['OPEN', 'INPROGRESS', 'TOVERIFY', 'FEEDBACK', 'DONE', 'REJECT'];
  const swimlanes = <>
    <DndContext>
      <table border={1}>
        <thead>
          <SwimlaneTableHeader orderedTaskStatuses={ orderedTaskStatuses } />
        </thead>
        <tbody>
          { sprint.swimlanes.map((swimlane) => (
            <SwimlaneTableRow key={ swimlane.id } swimlane={ swimlane } orderedTaskStatuses={ orderedTaskStatuses } />
          )) }
        </tbody>
      </table>
    </DndContext>
  </>

  return (
    <div>
      <div>
        { sprint.name } ({ String(sprint.beginAt) } - { String(sprint.endAt) })
      </div>
      <div>
        { swimlanes }
      </div>
    </div>
  )
}
