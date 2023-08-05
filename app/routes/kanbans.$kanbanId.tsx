import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderArgs) => {
  const kanban = await db.kanban.findFirst({
    where: {
      id: parseInt(params.kanbanId || '0'),
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
              to={ "/sprints/" + sprint.id.toString() }
            >
              { sprint.name }
            </Link>
          </div>
        ))
      }
    </div>
  );
}
