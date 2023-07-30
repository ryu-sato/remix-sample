import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { db } from "~/services/db.server";

export const loader = async () => {
  const kanbans = await db.kanban.findMany();
  return json(kanbans);
};

export default function KanbanIndex() {
  const kanbans = useLoaderData<typeof loader>();

  return (
    <div>
      {
        kanbans.map((kanban) => {
          return (
            <div key={ kanban.id }>
              <Link
                to={ kanban.id.toString() }
              >
                { kanban.name }
              </Link>
            </div>
          );
        })
      }
    </div>
  );
}
