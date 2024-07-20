import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
  Button,
  Center,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useIcon } from "@/helper/useIcon";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import ModalNewTransaction from "@/components/ModalNewTransactions";
import {
  getTransaction,
  type GetTransactionResponse,
  type GetTransactionData,
} from "@/api/endpoints/get-transaction";
import AppLayout from "@/components/AppLayout";
import NavigationBar from "@/components/NavigationBar";
import { IconDatabaseOff } from "@tabler/icons-react";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [opened, { open, close }] = useDisclosure();

  const today = dayjs();

  const { data: dataTx, isLoading } = useQuery<GetTransactionResponse>({
    queryKey: ["get-transaction-month"],
    queryFn: () =>
      getTransaction({
        params: {
          date_start: today.format("YYYY-MM-DD"),
          date_end: today.format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        },
      }),
    retry: false,
  });

  const { data: dataTxMonth, isLoading: isDataMonthLoading } =
    useQuery<GetTransactionResponse>({
      queryKey: ["get-transaction-all"],
      queryFn: () =>
        getTransaction({
          params: {
            date_start: today.startOf("month").format("YYYY-MM-DD"),
            date_end: today.endOf("month").format("YYYY-MM-DD"),
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
    });

  // handle no item rows
  const rows =
    dataTx?.data?.length === 0 ? (
      <Table.Tr>
        <Table.Td colSpan={3}>
          <Center mt="md">
            <IconDatabaseOff />
            <Text ml="md" fw={500}>
              No Data
            </Text>
          </Center>
        </Table.Td>
      </Table.Tr>
    ) : (
      dataTx?.data.map((element: GetTransactionData) => (
        <Table.Tr key={element.id}>
          <Table.Td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(element.amount)}
          </Table.Td>
          <Table.Td pl="1.5rem">{useIcon(element.category)}</Table.Td>
          <Table.Td miw="6rem">{element.notes}</Table.Td>
        </Table.Tr>
      ))
    );

  const monthRows = dataTxMonth?.data.map((item: GetTransactionData) => (
    <Table.Tr key={item.id}>
      <Table.Td>{dayjs(item.date).format("DD MMMM")}</Table.Td>
      <Table.Td>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(item.amount)}
      </Table.Td>
      <Table.Td pl="1.5rem">{useIcon(item.category)}</Table.Td>
      <Table.Td miw="6rem">{item.notes}</Table.Td>
    </Table.Tr>
  ));

  return (
    <AppLayout>
      <Stack>
        <NavigationBar />
        <LoadingOverlay visible={isLoading || isDataMonthLoading} />

        <div>
          <Center mb="xl">
            <Button size="lg" w="20rem" onClick={open}>
              New Transaction
            </Button>
          </Center>
          <Title order={3} ta="center">
            {today.format("dddd, DD MMMM YYYY")}
          </Title>
          <Paper mx="lg" mt="md" p="lg" shadow="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Notes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Paper>

          <Title order={3} ta="center" mt="3rem">
            Transactions: {today.format("MMMM YYYY")}
          </Title>
          <Paper mx="lg" mt="md" p="lg" shadow="md">
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
        </div>
      </Stack>

      {/* Modal */}
      <ModalNewTransaction open={opened} close={close} />
    </AppLayout>
  );
}
