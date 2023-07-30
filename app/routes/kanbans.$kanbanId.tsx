import type { V2_MetaFunction } from "@remix-run/node";
import KanbanShow from "~/domains/kanbans/show";

export * from '~/domains/kanbans/show';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Kanbans" },
  ];
};

export default function Show() {
  return (
    <KanbanShow />
  );
}
