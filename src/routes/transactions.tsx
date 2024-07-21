import { createFileRoute } from "@tanstack/react-router";
// import AppLayout from "../components/AppLayout";
import NavigationBar from "../components/NavigationBar";
import {
  AppShell,
  Box,
  Center,
  LoadingOverlay,
  Paper,
  Table,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {
  getTransaction,
  GetTransactionData,
  GetTransactionResponse,
} from "@/api/endpoints/get-transaction";
import { useIcon } from "@/helper/useIcon";
import { MonthPickerInput } from "@mantine/dates";
import { useState } from "react";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  const { data: dataTxMonth, isLoading: isDataMonthLoading } =
    useQuery<GetTransactionResponse>({
      queryKey: ["get-transaction-all", date],
      queryFn: () =>
        getTransaction({
          params: {
            date_start: dayjs(date).startOf("month").format("YYYY-MM-DD"),
            date_end: dayjs(date).endOf("month").format("YYYY-MM-DD"),
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
    });

  const monthRows = dataTxMonth?.data.map((item: GetTransactionData) => (
    <Table.Tr key={item.id}>
      <Table.Td fz="xs">{dayjs(item.date).format("DD")}</Table.Td>
      <Table.Td fz="xs" align="right">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(item.amount)}
      </Table.Td>
      <Table.Td fz="xs" pl="1.5rem">
        {useIcon(item.category)}
      </Table.Td>
      <Table.Td fz="xs" miw="6rem">
        {item.notes}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AppShell pt="lg">
      <AppShell.Main pb="5rem" px="sm">
        <LoadingOverlay visible={isDataMonthLoading} />
        <Title order={3} ta="center" mb="xl">
          MONTHLY TRANSACTIONS
        </Title>
        <Center>
          <Box w="10rem">
            <MonthPickerInput
              valueFormat="MMMM YYYY"
              placeholder="Pick date"
              value={date}
              onChange={setDate}
            />
          </Box>
        </Center>
        <Paper mt="md" p="xs" shadow="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Notes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{monthRows}</Table.Tbody>
          </Table>
        </Paper>
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
    </AppShell>
  );
}
