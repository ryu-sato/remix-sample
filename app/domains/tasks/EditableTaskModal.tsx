import type { FormEventHandler, MouseEventHandler } from "react";
import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { taskCreateFormValidator } from "./NewTask";
import { FormInput } from "~/components/FormInput";
import { FormTextArea } from "~/components/FormTextArea";
import { FormSubmitButton } from "~/components/FormSubmitButton";

const zod = {
  title: z
    .string()
    .min(1, { message: "title is required" })
    .optional(),
  body: z
    .string()
    .optional(),
  swimlaneId: z
    .coerce
    .number()
    .positive()
    .int()
    .optional(),
};

type EditableTaskModalProps = {
  task?: SerializeFrom<Task> | null,
  onCancel: MouseEventHandler<HTMLButtonElement>,
  onSubmit: FormEventHandler<HTMLFormElement>,
}

export const taskUpdateFormData = zfd.formData({
  title: zfd.text(zod.title),
  body: zfd.text(zod.body),
  swimlaneId: zfd.numeric(zod.swimlaneId),
});

export const taskUpdateFormValidator = withZod(z.object(zod));

export function EditableTaskModal(props: EditableTaskModalProps) {
  if (props.task == null) {
    return <></>;
  }

  return (
    <ValidatedForm
      action={ `/tasks/${ props.task.id }` }
      method="post"
      validator={ taskCreateFormValidator }
      defaultValues={
        {
          swimlaneId: props.task?.swimlaneId ?? undefined,
          title: props.task?.title ?? undefined,
          body: props.task?.body ?? undefined,
        }
      }
      resetAfterSubmit={ true }
      onSubmit={ (_data, event) => props.onSubmit(event) }
    >
      <input type="hidden" name="intent" value="put" />

      <FormInput type="number" name="swimlaneId" label="swimlaneId" />
      <FormInput type="text" name="title" label="title" />
      <FormTextArea name="body" label="body" />
      <div>
        <button type="reset" onClick={ props.onCancel }>Cancel</button>
        <FormSubmitButton text="Update" textProcessing="Updating..." />
      </div>
    </ValidatedForm>
  )
}
