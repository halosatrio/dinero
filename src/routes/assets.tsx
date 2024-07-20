import { createFileRoute } from "@tanstack/react-router";
import NavigationBar from "../components/NavigationBar";
import { AppShell } from "@mantine/core";

export const Route = createFileRoute("/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  return (
    // <AppLayout>
    <AppShell>
      <AppShell.Main>
        <div>Hello /asset!</div>
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
    </AppShell>
    // </AppLayout>
  );
}
