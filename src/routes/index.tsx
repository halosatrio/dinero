import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return <AppLayout>hehehehe</AppLayout>;
}
