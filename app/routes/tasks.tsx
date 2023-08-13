import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";

export const action = async ({ request }: ActionArgs) => {
  const { title, body, swimlaneId } = await request.json() as unknown as { title: string, body: string, swimlaneId: number };
  if (title == null || body == null || swimlaneId == null) {
    return json({ status: 400 });
  }

  const task = await db.task.create({
    data: {
      title,
      body,
      swimlaneId,
    }
  });

  return json(task);
};
