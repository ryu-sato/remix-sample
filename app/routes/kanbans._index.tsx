import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/services/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Kanbans" },
  ];
};

export const loader = async () => {
  const kanbans = await db.kanban.findMany();
  return json(kanbans);
};

export default function Index() {
  const kanbans = useLoaderData<typeof loader>();

  if (kanbans == null) {
    return <></>;
  }

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
