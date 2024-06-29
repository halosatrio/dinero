import { createFileRoute } from "@tanstack/react-router";

function IndexPage() {
  return <div>Hello /!</div>;
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
