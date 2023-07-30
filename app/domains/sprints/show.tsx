import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs} from "@remix-run/node";

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
      swimlanes: true,
    }
  });

  return json(sprint);
};

export default function SprintIndex() {
  const sprint = useLoaderData<typeof loader>();
  if (sprint == null) {
    return <></>
  }

  const swimlanes = sprint.swimlanes.map((swimlane) => (
    <div key={ swimlane.id }>
      { swimlane.title }
    </div>
  ));
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
