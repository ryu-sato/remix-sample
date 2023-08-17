import { useEffect, type FormEventHandler, type MouseEventHandler } from "react";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { useFetcher } from "@remix-run/react";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormInput } from "~/components/FormInput";
import { FormTextArea } from "~/components/FormTextArea";
import { FormSubmitButton } from "~/components/FormSubmitButton";
import { taskCreateFormValidator } from "~/domains/tasks/NewTask";
import type { SerializedTask } from "~/services/tasks.client";

const zod = {
  title: z
    .string()
    .min(1, { message: "title is required" })
    .optional(),
  body: z
    .string()
    .optional(),
  status: z
    .enum(['OPEN', 'INPROGRESS', 'TOVERIFY', 'DONE', 'REJECT'])
    .optional(),
  swimlaneId: z
    .coerce
    .number()
    .positive()
    .int()
    .optional(),
};

type EditableTaskModalProps = {
  taskId: number | null,
  show?: boolean,
  onCancel?: MouseEventHandler<HTMLButtonElement>,
  onSubmit?: FormEventHandler<HTMLFormElement>,
}

export const taskUpdateFormData = zfd.formData({
  title: zfd.text(zod.title),
  body: zfd.text(zod.body),
  status: zfd.text(zod.status),
  swimlaneId: zfd.numeric(zod.swimlaneId),
});

export const taskUpdateFormValidator = withZod(z.object(zod));

export function EditableTaskModal(props: EditableTaskModalProps) {
  const fetcher = useFetcher();
  const isFetcherStatusInit = fetcher.state === "idle" && fetcher.data == null;
  const isFetcherStatusLoaded = fetcher.state === "idle" && fetcher.data != null;

  useEffect(() => {
    if (isFetcherStatusInit) {
      fetcher.load(`/tasks/${props.taskId}`);
    }
  }, [fetcher, isFetcherStatusInit, props.taskId]);

  if (props.taskId == null || !isFetcherStatusLoaded) {
    return <></>;
  }

  const task = fetcher.data as SerializedTask;

  return (
    <Modal isOpen={ props.show } id="domains.tasks.EditableTaskModal">
      <ValidatedForm
        action={ `/tasks/${ props.taskId }` }
        method="post"
        validator={ taskCreateFormValidator }
        defaultValues={
          {
            swimlaneId: task.swimlaneId ?? undefined,
            title: task.title ?? undefined,
            body: task.body ?? undefined,
            status: task.status ?? undefined,
          }
        }
        resetAfterSubmit={ true }
        onSubmit={ (_data, event) => props.onSubmit && props.onSubmit(event) }
      >
        <input type="hidden" name="intent" value="put" />

        <ModalHeader>
          Edit task
        </ModalHeader>
        <ModalBody>
          <FormInput type="number" name="swimlaneId" label="swimlaneId" />
          <FormInput type="text" name="title" label="title" />
          <FormInput type="text" name="status" label="status" />
          <FormTextArea name="body" label="body" />
        </ModalBody>
        <ModalFooter>
          <button type="reset" className="btn btn-sm btn-secondary" onClick={ props.onCancel }>Cancel</button>
          <FormSubmitButton text="Update" textProcessing="Updating..." />
        </ModalFooter>
      </ValidatedForm>
    </Modal>
  );
}
