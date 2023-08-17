import { useNavigate } from "@remix-run/react";
import { useParams } from "react-router-dom";
import { EditableTaskModal } from "~/domains//tasks/EditableTaskModal";

export default function Show() {
  const navigate = useNavigate();
  const { taskId } = useParams();

  return <>
    <EditableTaskModal
      show={ true }
      taskId={ Number(taskId) }
      onCancel={ hideEditableTaskModal }
    />
  </>

  function hideEditableTaskModal(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    return navigate('../');
  }
}
