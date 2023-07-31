import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/services/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Sprint" },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  const sprint = await db.sprint.findFirst({
    where: {
      id: parseInt(params.sprintId || '0'),
    },
    include: {
      swimlanes: {
        include: {
          tasks: true,
        }
      },
    }
  });

  return json(sprint);
};

export default function SprintIndex() {
  const sprint = useLoaderData<typeof loader>();
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
        { sprint.swimlanes.map((swimlane) => {
          const getTasksByState = (status: string) => {
            return swimlane
              .tasks
              .filter((task) => task.status === status)
              .map((task) => <div key={ task.id }>{ task.title }</div>);
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
        })}
      </tbody>
    </table>
  </>

  return (
    <div>
      <div>
        { sprint.name } ({ sprint.beginAt } - { sprint.endAt })
      </div>
      <div>
        { swimlanes }
      </div>
    </div>
  )
}
