import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
  AppShell,
  Button,
  Center,
  LoadingOverlay,
  Paper,
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
  type TransactionData,
} from "@/api/endpoints/get-transaction";
import NavigationBar from "@/components/NavigationBar";
import { IconDatabaseOff } from "@tabler/icons-react";
import { useState } from "react";
import ModalEditTransaction from "@/components/ModalEditTransaction";
import { useCookies } from "react-cookie";
// import AppLayout from "@/components/AppLayout";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [opened, { open, close }] = useDisclosure();
  const [cookies] = useCookies(["token"]);
  const [modelEditOpened, { open: openModalEdit, close: closeModalEdit }] =
    useDisclosure();
  const [rowId, setRowId] = useState<number>();

  function resetRowId() {
    setRowId(undefined);
  }

  const today = dayjs();

  const { data: dataTx, isLoading } = useQuery<GetTransactionResponse>({
    queryKey: ["get-transaction-today"],
    queryFn: () =>
      getTransaction({
        params: {
          date_start: today.format("YYYY-MM-DD"),
          date_end: today.format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      }),
    retry: false,
  });

  const {
    data: dataTxMonth,
    isLoading: isDataMonthLoading,
    refetch: refetchMonthlyTx,
  } = useQuery<GetTransactionResponse>({
    queryKey: ["get-transaction-month"],
    queryFn: () =>
      getTransaction({
        params: {
          date_start: today.startOf("month").format("YYYY-MM-DD"),
          date_end: today.endOf("month").format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: `Bearer ${cookies.token}`,
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
      dataTx?.data.map((element: TransactionData) => (
        <Table.Tr
          key={element.id}
          onClick={() => {
            setRowId(element.id);
            openModalEdit();
          }}
        >
          <Table.Td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(element.amount)}
          </Table.Td>
          <Table.Td pl="1.5rem">{useIcon(element.category)}</Table.Td>
          <Table.Td miw="6rem">{element.notes}</Table.Td>
        </Table.Tr>
      ))
    );

  const monthRows = dataTxMonth?.data.map((item: TransactionData) => (
    <Table.Tr
      key={item.id}
      onClick={() => {
        setRowId(item.id);
        openModalEdit();
      }}
    >
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
      <AppShell.Main pb="5rem">
        <LoadingOverlay visible={isLoading || isDataMonthLoading} />
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
        <Paper mx="sm" mt="md" p="xs" shadow="md">
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
      {/* Modal */}
      <ModalNewTransaction
        open={opened}
        close={close}
        refetch={refetchMonthlyTx}
      />
      <ModalEditTransaction
        open={modelEditOpened}
        close={closeModalEdit}
        rowId={rowId}
        resetRow={resetRowId}
      />
    </AppShell>
  );
}
