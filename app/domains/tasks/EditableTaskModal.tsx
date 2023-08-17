import { type FormEventHandler, type MouseEventHandler } from "react";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormInput } from "~/components/FormInput";
import { FormTextArea } from "~/components/FormTextArea";
import { FormSubmitButton } from "~/components/FormSubmitButton";
import { taskCreateFormValidator } from "~/domains/tasks/NewTaskModal";
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
  task: SerializedTask | null,
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
  if (props.task == null) {
    return <></>;
  }

  return (
    <Modal isOpen={ props.show } id="domains.tasks.EditableTaskModal">
      <ValidatedForm
        action={ `/tasks/${ props.task.id }` }
        method="post"
        validator={ taskCreateFormValidator }
        defaultValues={
          {
            swimlaneId: props.task.swimlaneId ?? undefined,
            title: props.task.title ?? undefined,
            body: props.task.body ?? undefined,
            status: (props.task.status as 'OPEN'|'INPROGRESS'|'TOVERIFY'|'DONE'|'REJECT') ?? undefined,
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
