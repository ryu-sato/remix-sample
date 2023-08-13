import { Form, Link, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/services/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  if (params.taskId == null) {
    return json({ status: 400 });
  }

  const task = await db.task.findFirst({
    where: {
      id: parseInt(params.taskId),
    },
    include: {
      swimlane: {
        include: {
          sprint: true
        },
      },
    },
  });
  return json(task);
};

export const action = async ({ request, params }: ActionArgs) => {
  if (params.taskId == null) {
    return json({ status: 400 });
  }

  // DELETE method
  const form = await request.formData();
  if (form.get("intent") === "delete") {
    const task = await db.task.delete({
      where: {
        id: parseInt(params.taskId),
      },
      include: {
        swimlane: {
          include: {
            sprint: true,
          },
        },
      },
    });
    return redirect(`/sprints/${ task.swimlane.sprint.id }`);
  }

  // POST method
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
};

export default function Show() {
  const task = useLoaderData<typeof loader>();

  const parentSprintLink = `/sprints/${task.swimlane.sprint.id}`;

  if (task == null) {
    return <></>
  }

  return (
    <div>
      <h2>Task</h2>
      <dl>
        <dt>id</dt><dd>{ task.id }</dd>
        <dt>title</dt><dd>{ task.title }</dd>
        <dt>body</dt><dd>{ task.title }</dd>
        <dt>sprint</dt>
        <dd>
          <Link
            to={ parentSprintLink }
          >
            { parentSprintLink }
          </Link>
        </dd>
      </dl>
      <Form method="post">
        <button name="intent" type="submit" value="delete">
          Delete
        </button>
      </Form>
    </div>
  );
}
