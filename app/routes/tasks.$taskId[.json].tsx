import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";

export const action = async ({ request, params }: ActionArgs) => {
  if (params.taskId == null) {
    return json({}, { status: 400 });
  }

  switch(request.method) {
    case 'PUT': {
      const body = await request.json();
      const task = await db.task.update({
        where: {
          id: parseInt(params.taskId),
        },
        data: {
          ...body,
        }
      });
      return json(task);
    }

    default: {
      return json({}, { status: 405 });
    }
  }
};
