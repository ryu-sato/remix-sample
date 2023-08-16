import { json, type LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import { useSearchParams } from "react-router-dom";
import { EditableTaskModal } from "~/domains//tasks/EditableTaskModal";
import { db } from "~/services/db.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId');
  if (taskId == null) {
    return json(null, { status: 200 })
  }

  const task = await db.task.findUnique({
    where: {
      id: Number(taskId ?? 0) || 0,
    },
  });
  return json(task, { status: task != null ? 200 : 404 });
};

export default function SprintRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const task = useLoaderData<typeof loader>();

  const showEditableTaskModal = searchParams.get('taskId') != null;

  return (
    <div>
      <h1>Sprints</h1>
      <main>
        <Outlet />
        { showEditableTaskModal &&
          <EditableTaskModal
            task={ task }
            onCancel={ hideEditableTaskModal }
          />
        }
      </main>
    </div>
  );

  function hideEditableTaskModal(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    searchParams.delete('taskId');
    setSearchParams(searchParams);
  }
}
