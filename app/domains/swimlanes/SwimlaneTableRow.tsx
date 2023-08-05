import { Prisma } from "@prisma/client";
import DraggableTask from "../tasks/DraggableTask";
import type { SerializeFrom } from "@remix-run/node";

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

  const opens = getTasksByState('OPEN');
  const inProgresses = getTasksByState('INPROGRESS');
  const toVerifies = getTasksByState('TOVERIFY');
  const feedbacks = getTasksByState('FEEDBACK');
  const dones = getTasksByState('DONE');
  const rejects = getTasksByState('REJECT');

  return (
    <tr key={ swimlane.id }>
      <td>{ swimlane.title }</td>
      <td>{ opens }</td>
      <td>{ inProgresses }</td>
      <td>{ toVerifies }</td>
      <td>{ feedbacks }</td>
      <td>{ dones }</td>
      <td>{ rejects }</td>
    </tr>
  )
}
