import type { SerializeFrom } from "@remix-run/node";
import SwimlaneTableRow from "../swimlanes/SwimlaneTableRow";
import { Prisma } from "@prisma/client";

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

  const swimlanes = <>
    <table>
      <thead>
        <tr>
          <th>ストーリー</th>
          <th>新規</th>
          <th>進行中</th>
          <th>解決</th>
          <th>フィードバック</th>
          <th>終了</th>
          <th>却下</th>
        </tr>
      </thead>
      <tbody>
        { sprint.swimlanes.map((swimlane) => (
          <SwimlaneTableRow key={ swimlane.id } { ...swimlane } />
        )) }
      </tbody>
    </table>
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
