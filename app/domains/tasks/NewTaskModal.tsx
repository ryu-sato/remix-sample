import type { FormEventHandler, MouseEventHandler} from 'react';
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormInput } from '~/components/FormInput';
import { FormSubmitButton } from '~/components/FormSubmitButton';
import { FormTextArea } from '~/components/FormTextArea';

const zod = {
  title: z
    .string()
    .min(1, { message: "title is required" }),
  body: z
    .string()
    .optional(),
  status: z
    .enum(['OPEN', 'INPROGRESS', 'TOVERIFY', 'DONE', 'REJECT']),
  swimlaneId: z
    .coerce
    .number()
    .positive()
    .int(),
};

type NewTaskModalProps = {
  show?: boolean,
  onCancel: MouseEventHandler<HTMLButtonElement>,
  onSubmit: FormEventHandler<HTMLFormElement>,
  swimlaneId: number,
}

export const taskCreateFormData = zfd.formData({
  title: zfd.text(zod.title),
  body: zfd.text(zod.body),
  status: zfd.text(zod.status),
  swimlaneId: zfd.numeric(zod.swimlaneId),
});

export const taskCreateFormValidator = withZod(z.object(zod));

export function NewTaskModal(props: NewTaskModalProps) {
  return <>
    <Modal isOpen={ props.show } id="domains.tasks.EditableTaskModal">
      <ValidatedForm
        method="post"
        validator={ taskCreateFormValidator }
        defaultValues={
          {
            swimlaneId: props.swimlaneId,
            status: 'OPEN',
          }
        }
        resetAfterSubmit={ true }
        onSubmit={ (_data, event) => props.onSubmit(event) }
      >
        <FormInput type="number" name="swimlaneId" label="swimlaneId" hidden={ true } />
        <FormInput type="text" name="status" label="status" hidden={ true } />

        <ModalHeader>
          New task
        </ModalHeader>
        <ModalBody>
          <FormInput type="text" name="title" label="title" />
          <FormTextArea name="body" label="body" />
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-sm btn-secondary" onClick={ props.onCancel }>Cancel</button>
          <FormSubmitButton text="Create" textProcessing="Creating..." />
        </ModalFooter>
      </ValidatedForm>
    </Modal>
  </>
}
