import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
  AppShell,
  Button,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useIcon } from "@/helper/useIcon";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import ModalNewTransaction from "@/components/ModalNewTransactions";
import {
  getTransaction,
  type GetTransactionResponse,
  type GetTransactionData,
} from "@/api/endpoints/get-transaction";
import NavigationBar from "@/components/NavigationBar";
import { IconCalendar, IconDatabaseOff } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CATEGORY } from "@/helper/constant";
import { deleteTransaction } from "@/api/endpoints/delete-transaction";
import { notifications } from "@mantine/notifications";
// import AppLayout from "@/components/AppLayout";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [opened, { open, close }] = useDisclosure();
  const [modelEditOpened, { open: openModalEdit, close: closeModalEdit }] =
    useDisclosure();
  const [rowData, setRowData] = useState<GetTransactionData>();

  const today = dayjs("2024-07-31");

  const { data: dataTx, isLoading } = useQuery<GetTransactionResponse>({
    queryKey: ["get-transaction-today"],
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
        <Table.Tr
          key={element.id}
          onClick={() => {
            console.log("hehe", element);
            setRowData(element);
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
        rowData={rowData}
      />
    </AppShell>
  );
}

type ModalEditProps = {
  open: boolean;
  close: () => void;
  rowData: GetTransactionData | undefined;
};

export type TransactionFormData = {
  date: string | Date;
  type: "inflow" | "outflow";
  amount: number | undefined;
  category: string | undefined;
  notes: string;
};

function ModalEditTransaction({ open, close, rowData }: ModalEditProps) {
  const [isEdit, setIsEdit] = useState(false);
  const form = useForm<TransactionFormData>({
    mode: "uncontrolled",
    initialValues: {
      date: new Date(),
      type: "outflow",
      amount: undefined,
      category: undefined,
      notes: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (transactionId: number) =>
      deleteTransaction(transactionId, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        },
      }),
    onError: (err) => {
      let error = JSON.parse(err.message);
      notifications.show({
        color: "red",
        title: error.status,
        message: error.message,
      });
    },
    onSuccess: () => {
      // refetch();
      close();
      form.reset();
    },
  });

  function handleSubmit(values: TransactionFormData) {
    console.log("submit", values);
  }

  function handleCancelDelete() {
    // isEdit = true -> button cancel
    if (isEdit) {
      setIsEdit(false);
    } else {
      // trigger mutate
      mutate(rowData?.id ?? 0);
    }
  }
  // deleteTransaction

  useEffect(() => {
    if (rowData) {
      // Even if query.data changes, form will be initialized only once
      console.log("masuk sini");
      form.initialize({
        date: rowData.date,
        type: rowData.type,
        amount: rowData.amount,
        category: rowData.category,
        notes: rowData.notes,
      });
    }
  }, [rowData]);

  return (
    <Modal
      opened={open}
      onClose={close}
      title="Edit Transaction"
      centered
      styles={{ title: { fontWeight: "bold" } }}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack mt="sm" gap="lg">
          <DateInput
            readOnly
            required
            label="Select Date"
            valueFormat="DD MMM YYYY"
            leftSection={<IconCalendar />}
            {...form.getInputProps("date")}
          />
          <Select
            required
            label="Cash In/Out"
            data={["outflow", "inflow"]}
            placeholder="Cash In / Cash Out"
            {...form.getInputProps("type")}
          />
          <NumberInput
            required
            label="Amount"
            placeholder="masukkan nilai transaksi"
            allowNegative={false}
            thousandSeparator="."
            decimalSeparator=","
            leftSection="Rp"
            {...form.getInputProps("amount")}
          />
          <Select
            required
            label="Category"
            data={CATEGORY}
            placeholder="pilih kategori"
            searchable
            {...form.getInputProps("category")}
          />
          <TextInput
            required
            label="Notes"
            placeholder="keterangan"
            {...form.getInputProps("notes")}
          />
          {/* <Button my="md" type="submit">
            Record Transaction
           </Button> */}
        </Stack>
        <Group mt="lg" justify="flex-end">
          <Button color={isEdit ? "gray" : "red"} onClick={handleCancelDelete}>
            {isEdit ? "Cancel" : "Delete"}
          </Button>
          <Button onClick={() => setIsEdit(!isEdit)} type="submit">
            {isEdit ? "Confirm" : "Edit"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
