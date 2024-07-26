import { createFileRoute } from "@tanstack/react-router";
// import AppLayout from "../components/AppLayout";
import NavigationBar from "../components/NavigationBar";
import {
  AppShell,
  Box,
  Center,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Table,
  Text,
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
import {
  getMonthlySummary,
  GetMonthlySummaryResponse,
  MonthlySummaryData,
} from "@/api/endpoints/get-tx-monthly-summary";
import { CATEGORY } from "@/helper/constant";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Semua"
  );

  const { data: dataTxMonth, isLoading: isDataMonthLoading } =
    useQuery<GetTransactionResponse>({
      queryKey: ["get-transaction-all", date, selectedCategory],
      queryFn: () =>
        getTransaction({
          params: {
            date_start: dayjs(date).startOf("month").format("YYYY-MM-DD"),
            date_end: dayjs(date).endOf("month").format("YYYY-MM-DD"),
            category:
              selectedCategory === "Semua" ? undefined : selectedCategory,
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
    });

  const { data: dataMonthlySummary, isLoading: isMonthlySummaryLoading } =
    useQuery<GetMonthlySummaryResponse>({
      queryKey: ["get-monthly-summary", date],
      queryFn: () =>
        getMonthlySummary({
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

  const summaryRows = dataMonthlySummary?.data?.summary.map(
    (item: MonthlySummaryData) => (
      <Table.Tr key={item.category}>
        <Table.Td>
          <Group>
            {useIcon(item.category)}
            <Text ml="sm">{item.category}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(item.total_amount)}
        </Table.Td>
        <Table.Td>{item.count}</Table.Td>
      </Table.Tr>
    )
  );

  const cashflowRows = dataMonthlySummary?.data?.cashflow ? (
    <Table.Tr>
      <Table.Td>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(dataMonthlySummary?.data?.cashflow.outflow)}
      </Table.Td>
      <Table.Td>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(dataMonthlySummary?.data?.cashflow.inflow)}
      </Table.Td>
      {new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(
        dataMonthlySummary?.data?.cashflow.inflow -
          dataMonthlySummary?.data?.cashflow.outflow
      )}
    </Table.Tr>
  ) : (
    <Table.Tr></Table.Tr>
  );

  console.log(dataMonthlySummary?.data?.cashflow.inflow);

  return (
    <AppShell pt="lg">
      <AppShell.Main pb="5rem" px="sm">
        <LoadingOverlay
          visible={isDataMonthLoading || isMonthlySummaryLoading}
        />
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
        {/* REGION: Transaction Monthly Summary */}
        <Paper mt="md" p="xl" shadow="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Category</Table.Th>
                <Table.Th>Total Amount</Table.Th>
                <Table.Th>Count</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{summaryRows}</Table.Tbody>
          </Table>
        </Paper>

        {/* REGION: Cashflow Balance */}
        <Paper mt="lg" p="xl" shadow="md" mb="4rem">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Pengeluaran</Table.Th>
                <Table.Th>Pemasukan</Table.Th>
                <Table.Th>Selisih</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{cashflowRows}</Table.Tbody>
          </Table>
        </Paper>

        <Center>
          <Box w="10rem">
            <Select
              label="Category"
              data={["Semua", ...CATEGORY]}
              placeholder="pilih kategori"
              onChange={setSelectedCategory}
              value={selectedCategory}
            />
          </Box>
        </Center>

        {/* REGION: Monthly Transaction */}
        <Paper p="xs" shadow="md" mt="lg">
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
