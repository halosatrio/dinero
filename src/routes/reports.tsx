import { createFileRoute } from "@tanstack/react-router";
import NavigationBar from "../components/NavigationBar";
import { AppShell } from "@mantine/core";

export const Route = createFileRoute("/reports")({
  component: ReportPage,
});

function ReportPage() {
  return (
    <AppShell>
      <AppShell.Main>
        <div>Hello /reports!</div>
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
    </AppShell>
  );
}
