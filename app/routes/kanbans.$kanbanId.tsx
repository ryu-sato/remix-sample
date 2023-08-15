import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderArgs) => {
  if (params.kanbanId == null) {
    return json({}, { status: 400 });
  }

  const kanban = await db.kanban.findFirst({
    where: {
      id: parseInt(params.kanbanId),
    },
    include: {
      sprints: true
    }
  });
  return json(kanban);
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Kanbans" },
  ];
};

export default function Show() {
  const kanban = useLoaderData<typeof loader>();

  if (kanban == null) {
    return <></>
  }

  return (
    <div>
      <div>{ kanban.name }</div>
      {
        kanban.sprints.map((sprint) => (
          <div key={ sprint.id }>
            <Link
              to={ "/sprints/" + String(sprint.id) }
            >
              { sprint.name }
            </Link>
          </div>
        ))
      }
    </div>
  );
}
