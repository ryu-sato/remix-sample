import { useLoaderData } from "@remix-run/react";
import { SprintTable } from "~/domains/sprints/SprintTable";
import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSearchParams } from "react-router-dom";
import { EditableTaskModal } from "~/domains//tasks/EditableTaskModal";
import { db } from "~/services/db.server";
import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Sprint" },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  const sprint = await db.sprint.findUnique({
    where: {
      id: Number(params.sprintId ?? 0) || 0,
    },
    include: {
      swimlanes: {
        include: {
          tasks: true,
        }
      },
    }
  });
  return json(sprint, { status: sprint != null ? 200 : 404 });
};

export default function Show() {
  const sprint = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const showEditableTaskModal = searchParams.get('taskId') != null;

  if (sprint == null) {
    return <></>
  }

  return <>
    <SprintTable { ...sprint } />
    { showEditableTaskModal &&
      <EditableTaskModal
        show={ showEditableTaskModal }
        taskId={ Number(searchParams.get('taskId')) }
        onCancel={ hideEditableTaskModal }
      />
    }
  </>;

  function hideEditableTaskModal(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    searchParams.delete('taskId');
    setSearchParams(searchParams);
  }
}
