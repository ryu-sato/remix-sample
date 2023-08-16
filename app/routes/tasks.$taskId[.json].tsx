import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { taskCreateFormValidator } from "~/domains/tasks/NewTask";
import { db } from "~/services/db.server";

export const action = async ({ request, params }: ActionArgs) => {
  switch(request.method) {
    case 'PUT': {
      const validationResult = await taskCreateFormValidator.validate(await request.json());
      if (validationResult.error) {
        console.log(validationResult.error);
        return json({}, { status: 400 });
      }

      const task = await db.task.update({
        where: {
          id: Number(params.taskId ?? 0) || 0,
        },
        data: validationResult.data,
      });
      return json(task, { status: task != null ? 200 : 404 });
    }

    default: {
      return json({}, { status: 405 });
    }
  }
};
