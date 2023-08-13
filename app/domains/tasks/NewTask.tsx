import type { FormEventHandler, MouseEventHandler} from 'react';
import { useState } from 'react';
import { Form } from "@remix-run/react";
import { DndContext } from '@dnd-kit/core';
import type {Coordinates} from '@dnd-kit/utilities';
import { Draggable } from "~/components/Draggable";

type NewTaskProps = {
  style?: React.CSSProperties,
  onCancel: MouseEventHandler<HTMLButtonElement>,
  onSubmit: FormEventHandler<HTMLFormElement>,
  swimlaneId: number,
}
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
        <Draggable id="newTask">
          <Form onSubmit={ props.onSubmit }>
            <input type="hidden" name="swimlaneId" value={ props.swimlaneId }></input>
            <div>
              <div>title</div>
              <div><input type="text" name="title"></input></div>
            </div>
            <div>
              <div>body</div>
              <div><textarea name="body"></textarea></div>
            </div>
            <div>
              <button type="button" onClick={ props.onCancel }>Cancel</button>
              <button type="submit">Create</button>
            </div>
          </Form>
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
