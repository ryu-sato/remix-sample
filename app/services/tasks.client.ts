import axios from "~/services/axios.client";
import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

export type SerializedTask = SerializeFrom<Task>

export async function update(task: SerializedTask, updateFields: Partial<SerializedTask>) {
  await axios.post(`/tasks/${ task.id }`, updateFields);
}
