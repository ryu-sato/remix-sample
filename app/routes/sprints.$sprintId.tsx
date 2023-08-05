import { useLoaderData } from "@remix-run/react";
import SprintTable from "~/domains/sprints/SprintTable";
import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
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

export default function Show() {
  const sprint = useLoaderData<typeof loader>();

  if (sprint == null) {
    return <></>
  }

  return (
    <SprintTable { ...sprint } />
  );
}
