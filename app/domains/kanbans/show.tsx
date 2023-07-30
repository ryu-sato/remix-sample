import type { LoaderArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { db } from "~/services/db.server";

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

export default function KanbanShow() {
  const kanban = useLoaderData<typeof loader>();

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
