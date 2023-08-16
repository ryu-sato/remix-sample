import type { FormEventHandler, MouseEventHandler} from 'react';
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import type {Coordinates} from '@dnd-kit/utilities';
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { Draggable } from "~/components/Draggable";
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
  swimlaneId: z
    .coerce
    .number()
    .positive()
    .int(),
};

type NewTaskProps = {
  style?: React.CSSProperties,
  onCancel: MouseEventHandler<HTMLButtonElement>,
  onSubmit: FormEventHandler<HTMLFormElement>,
  swimlaneId: number,
}

export const taskCreateFormData = zfd.formData({
  title: zfd.text(zod.title),
  body: zfd.text(zod.body),
  swimlaneId: zfd.numeric(zod.swimlaneId),
});

export const taskCreateFormValidator = withZod(z.object(zod));

export function NewTask(props: NewTaskProps) {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 });

  return (
    <DndContext
      onDragEnd={ handleDragEndOfNewTask }
    >
      <div
        style={
          {
            ...props.style,
            position: "relative",
            left: x,
            top: y,
            width: "200px",
            height: "200px",
          }
        }
      >
        <Draggable id="newTaskDraggable">
          <ValidatedForm
            method="post"
            validator={ taskCreateFormValidator }
            defaultValues={
              {
                swimlaneId: props.swimlaneId,
              }
            }
            resetAfterSubmit={ true }
            onSubmit={ (_data, event) => props.onSubmit(event) }
          >
            <FormInput type="number" name="swimlaneId" label="swimlaneId" hidden={ true } />

            <FormInput type="text" name="title" label="title" />
            <FormTextArea name="body" label="body" />
            <div>
              <button type="button" onClick={ props.onCancel }>Cancel</button>
              <FormSubmitButton text="Create" textProcessing="Creating..." />
            </div>
          </ValidatedForm>
        </Draggable>
      </div>
    </DndContext>
  )

  function handleDragEndOfNewTask(event: { delta: any; }) {
    const { delta } = event;

    setCoordinates(({ x, y }) => {
      return {
        x: x + delta.x,
        y: y + delta.y,
      };
    });
  }
}
