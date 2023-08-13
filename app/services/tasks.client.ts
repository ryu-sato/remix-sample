import axios from "~/services/axios.client";
import type { Task } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

export type SerializedTask = SerializeFrom<Task>

export async function create(task: Partial<SerializedTask>) {
  await axios.post(`/tasks`, task);
}

export async function update(task: SerializedTask, updateFields: Partial<SerializedTask>) {
  await axios.put(`/tasks/${ task.id }`, updateFields);
}
