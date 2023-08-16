import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";

export const action = async ({ request, params }: ActionArgs) => {
  switch(request.method) {
    case 'PUT': {
      const body = await request.json();
      const task = await db.task.update({
        where: {
          id: Number(params.taskId ?? 0) || 0,
        },
        data: {
          ...body,
        }
      });
      return json(task, { status: task != null ? 200 : 404 });
    }

    default: {
      return json({}, { status: 405 });
    }
  }
};
