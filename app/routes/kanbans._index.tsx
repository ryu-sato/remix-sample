import type { V2_MetaFunction } from "@remix-run/node";
import KanbanIndex from "~/domains/kanbans/index";

export * from '~/domains/kanbans/index';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Kanbans" },
  ];
};

export default function Index() {
  return (
    <KanbanIndex />
  );
}
