import { json, type LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useSearchParams } from "react-router-dom";
import { EditableTaskModal } from "~/domains//tasks/EditableTaskModal";
import { db } from "~/services/db.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId');

  const sprint = await db.task.findUnique({
    where: {
      id: Number(taskId ?? 0) || 0,
    },
  });
  return json(sprint, { status: sprint != null ? 200 : 404 });
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
      </main>
      { showEditableTaskModal &&
        <EditableTaskModal
          task={ task }
          onCancel={ hideEditableTaskModal }
          onSubmit={ () => {} }
        />
      }
    </div>
  );

  function hideEditableTaskModal() {
    searchParams.delete('taskId');
    setSearchParams(searchParams);
  }
}
