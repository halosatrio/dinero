import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import NavigationBar from "../components/NavigationBar";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  return (
    <AppLayout>
      <div>Hello /transactions!</div>
      <NavigationBar />
    </AppLayout>
  );
}
