import { Prisma } from "@prisma/client";
import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { DndContext } from '@dnd-kit/core';
import SwimlaneTableData from "./SwimlaneTableData";
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

const swimlaneWithTasks = Prisma.validator<Prisma.SwimlaneArgs>()({
  include: {
    tasks: true,
  }
});
type SwimlaneWithTasks = Prisma.SwimlaneGetPayload<typeof swimlaneWithTasks>
type TaskSerializeFrom = SerializeFrom<Task>

function groupBy<ItemType>(array: ItemType[], getKey: (item: ItemType) => string) {
  return array.reduce((result: { [key: string]: ItemType[] }, item: ItemType) => {
    const key = getKey(item);
    result[key] ||= [];
    result[key].push(item);
    return result;
  }, {});
}

export default function SwimlaneTableRow(swimlane: SerializeFrom<SwimlaneWithTasks>) {
  const [tasksGroupByStatus, setTasksGroupByStatus] = useState(groupBy<TaskSerializeFrom>(swimlane.tasks, t => t.status));

  if (swimlane == null) {
    return <></>
  }

  const orderedTaskStatuses = ['OPEN', 'INPROGRESS', 'TOVERIFY', 'FEEDBACK', 'DONE', 'REJECT'];
  return (
    <tr key={ swimlane.id }>
      <DndContext
        onDragEnd={ handleDragEnd }
      >
        <td>{ swimlane.title }</td>
        {
          orderedTaskStatuses.map((status) => (
            <SwimlaneTableData
              key={ `${swimlane.id}_${status}` }
              id={ status }
              tasks={ tasksGroupByStatus[status] || [] }
            />
          ))
        }
      </DndContext>
    </tr>
  )

  function handleDragEnd(event) {
    const { active, over } = event;

    /* ドラッグしたタスクが不明、またはドロップがキャンセルされた */
    const allTasks = Object.values(tasksGroupByStatus).flat();
    const draggedTask = allTasks.find(task => String(task.id) === active?.id);
    if (draggedTask == null || over?.id == null) {
      return;
    }

    if (!orderedTaskStatuses.includes(over.id)) {
      /* 同一ステータスでの移動 */
      const taskIdOfDropOver = Number(over.id);
      setTasksGroupByStatus((orderedTasks) => {
        const oldIndex = orderedTasks[draggedTask.status].findIndex(task => task.id === draggedTask.id);
        const newIndex = orderedTasks[draggedTask.status].findIndex(task => task.id === taskIdOfDropOver);

        orderedTasks[draggedTask.status] = arrayMove(orderedTasks[draggedTask.status], oldIndex, newIndex);
        return orderedTasks;
      });
    }
    else {
      /* ステータス変更 */
      const statusOfDropOver = over.id;
      if (draggedTask.status !== statusOfDropOver) {
        draggedTask.status = statusOfDropOver;
        setTasksGroupByStatus(groupBy<TaskSerializeFrom>(swimlane.tasks, t => t.status));
        return;
      }
    }
  }
}
