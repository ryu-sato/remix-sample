import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";

export const action = async ({ request, params }: ActionArgs) => {
  const body = await request.json();
  const task = await db.task.update({
    where: {
      id: parseInt(params.taskId || '0'),
    },
    data: {
      ...body,
    }
  });

  return json(task);
};
