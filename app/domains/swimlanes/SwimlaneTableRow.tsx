import { Prisma } from "@prisma/client";
import { type SerializeFrom } from "@remix-run/node";
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { SwimlaneTableData } from "~/domains/swimlanes/SwimlaneTableData";
import { NewTask, taskTaskCreateFormData } from "~/domains/tasks/NewTask";
import * as Task from '~/services/tasks.client';

const swimlaneWithTasks = Prisma.validator<Prisma.SwimlaneArgs>()({
  include: {
    tasks: true,
  }
});
type SwimlaneWithTasks = Prisma.SwimlaneGetPayload<typeof swimlaneWithTasks>
type SwimlaneTableRowProps = {
  swimlane: SerializeFrom<SwimlaneWithTasks>,
  orderedTaskStatuses: Array<string>,
}

function groupBy<ItemType>(array: ItemType[], getKey: (item: ItemType) => string) {
  return array.reduce((result: { [key: string]: ItemType[] }, item: ItemType) => {
    const key = getKey(item);
    result[key] ||= [];
    result[key].push(item);
    return result;
  }, {});
}

export function SwimlaneTableRow(props: SwimlaneTableRowProps) {
  const [tasksGroupByStatus, setTasksGroupByStatus] = useState(groupBy<Task.SerializedTask>(props.swimlane.tasks, t => t.status));
  const [hiddenNewTask, setHiddenNewTask] = useState(true);

  if (props.swimlane == null) {
    return <></>
  }

  return (
    <tr key={ props.swimlane.id }>
      <DndContext
        onDragEnd={ moveTask }
      >
        <td>
          <div>
            <button
              type="button"
              onClick={ showNewTask }
              disabled={ !hiddenNewTask }
            >
              &#043;
            </button>
          </div>
          <div>{ props.swimlane.title }</div>
        </td>
        {
          props.orderedTaskStatuses.map((status) => (
            <td
              key={ `${props.swimlane.id}_${status}` }
            >
              { status == 'OPEN' &&
                <NewTask
                  style={
                    {
                      display: hiddenNewTask ? 'none' : undefined,
                    }
                  }
                  onCancel={ cancelNewTask }
                  onSubmit={ createNewTask }
                  swimlaneId={ props.swimlane.id }
                />
              }
              <SwimlaneTableData
                id={ status }
                tasks={ tasksGroupByStatus[status] || [] }
              />
            </td>
          ))
        }
      </DndContext>
    </tr>
  )

  function showNewTask(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setHiddenNewTask(false);
  }

  function cancelNewTask(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setHiddenNewTask(true);
  }

  function createNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const newTaskData = taskTaskCreateFormData.parse(formData);

    (async () => {
      const task = await Task.create(newTaskData);
      setTasksGroupByStatus(groupBy<Task.SerializedTask>([...Object.values(tasksGroupByStatus).flat(), task], t => t.status));
    })();

    setHiddenNewTask(true);
  }

  function moveTask(event: DragEndEvent) {
    const { active, over } = event;

    /* ドラッグしたタスクが不明、またはドロップがキャンセルされた */
    const allTasks = Object.values(tasksGroupByStatus).flat();
    const draggedTask = allTasks.find(task => String(task.id) === active?.id);
    if (draggedTask == null || over?.id == null) {
      return;
    }

    if (!props.orderedTaskStatuses.includes(String(over.id))) {
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
      const statusOfDropOver = String(over.id);
      if (draggedTask.status === statusOfDropOver) {
        return;
      }

      draggedTask.status = statusOfDropOver;
      setTasksGroupByStatus(groupBy<Task.SerializedTask>(Object.values(tasksGroupByStatus).flat(), t => t.status));
      (async () => {
        await Task.update(draggedTask, { status: statusOfDropOver });
      })();
      return;
    }
  }
}
