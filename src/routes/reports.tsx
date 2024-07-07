import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import NavigationBar from "../components/NavigationBar";

export const Route = createFileRoute("/reports")({
  component: ReportPage,
});

function ReportPage() {
  return (
    <AppLayout>
      <div>Hello /report!</div>
      <NavigationBar />
    </AppLayout>
  );
}
