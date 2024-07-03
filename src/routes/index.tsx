import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import dayjs from "dayjs";
import NavigationBar from "../components/NavigationBar";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const data = [
    {
      id: 4,
      user_id: 1,
      type: "outflow",
      amount: 14000,
      category: "makan",
      date: "2024-06-27",
      note: "ketoprak",
      is_active: true,
      created_at: "2024-06-26T17:20:48.090Z",
      updated_at: "2024-06-26T17:20:48.090Z",
    },
    {
      id: 3,
      user_id: 1,
      type: "outflow",
      amount: 20000,
      category: "makan",
      date: "2024-06-27",
      note: "hejo",
      is_active: true,
      created_at: "2024-06-26T17:20:27.973Z",
      updated_at: "2024-06-27T02:14:49.762Z",
    },
  ];

  const today = dayjs();
  return (
    <AppLayout>
      <div className="text-center">{today.format("dddd, DD MMMM YYYY")}</div>

      <NavigationBar />
    </AppLayout>
  );
}
