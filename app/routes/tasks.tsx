import { Outlet } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";
import { taskTaskCreateFormValidator } from "~/domains/tasks/NewTask";

export const action = async ({ request }: ActionArgs) => {
  const validationResult = await taskTaskCreateFormValidator.validate(await request.json());
  if (validationResult.error) {
    console.log(validationResult.error);
    return json({}, { status: 400 });
  }

  const task = await db.task.create({
    data: validationResult.data,
  });

  return json(task);
};

export default function TaskRoute() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
