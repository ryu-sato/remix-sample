import type { V2_MetaFunction } from "@remix-run/node";
import KanbanIndex from "~/domains/kanbans/index";

export * from '~/domains/kanbans/index';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <KanbanIndex />
  );
}
