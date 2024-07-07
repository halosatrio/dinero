import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import NavigationBar from "../components/NavigationBar";

export const Route = createFileRoute("/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  return (
    <AppLayout>
      <div>Hello /asset!</div>
      <NavigationBar />
    </AppLayout>
  );
}
