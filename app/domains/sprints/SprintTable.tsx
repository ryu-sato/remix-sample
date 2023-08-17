import type { SerializeFrom } from "@remix-run/node";
import { Prisma } from "@prisma/client";
import { DndContext } from '@dnd-kit/core';
import { SwimlaneRow } from "~/domains/swimlanes/SwimlaneRow";
import { SwimlaneHeader } from "~/domains/swimlanes/SwimlaneHeader";

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

export function SprintTable(sprint: SerializeFrom<SprintWithSwimlanes>) {
  if (sprint == null) {
    return <></>
  }

  const orderedTaskStatuses = ['OPEN', 'INPROGRESS', 'TOVERIFY', 'FEEDBACK', 'DONE', 'REJECT'];
  const rowClassName = `row row-cols-${ 1 + orderedTaskStatuses.length }`;
  const swimlanes = <>
    <div className="container-fluid">
      <div className={ rowClassName }>
        <SwimlaneHeader
          orderedTaskStatuses={ orderedTaskStatuses }
        />
      </div>
      { sprint.swimlanes.map((swimlane) => (
        <div
          className={ rowClassName }
          key={ swimlane.id }
        >
          <SwimlaneRow
            swimlane={ swimlane }
            orderedTaskStatuses={ orderedTaskStatuses }
          />
        </div>
      )) }
    </div>
  </>

  return (
    <div>
      <div>
        { sprint.name } ({ sprint.beginAt.toString() } - { sprint.endAt.toString() })
      </div>
      <div>
        { swimlanes }
      </div>
    </div>
  );
}
