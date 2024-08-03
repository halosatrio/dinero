import { useEffect, useState } from "react";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCalendar } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { CATEGORY } from "@/helper/constant";
import { deleteTransaction } from "@/api/endpoints/delete-transaction";
import { GetTransactionData } from "@/api/endpoints/get-transaction";
import { TransactionFormData } from "./ModalNewTransactions";

type ModalEditProps = {
  open: boolean;
  close: () => void;
  rowData: GetTransactionData | undefined;
  resetRow: () => void;
};

export default function ModalEditTransaction({
  open,
  close,
  rowData,
  resetRow,
}: ModalEditProps) {
  const [isEdit, setIsEdit] = useState(false);
  // const [date, setDate] = useState<Date>();

  // Omit<TransactionFormData, "date">
  const form = useForm<TransactionFormData>();

  // const { mutate: triggerUpdate } = useMutation({
  //   mutationFn: async (transactionId: number) =>
  //     deleteTransaction(transactionId, {
  //       headers: {
  //         Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
  //       },
  //     }),
  //   onError: (err) => {
  //     let error = JSON.parse(err.message);
  //     notifications.show({
  //       color: "red",
  //       title: error.status,
  //       message: error.message,
  //     });
  //   },
  //   onSuccess: () => {
  //     // refetch();
  //     close();
  //     form.reset();
  //   },
  // });

  // delete transaction by id
  const { mutate: triggerDelete } = useMutation({
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
    if (!isEdit) {
      setIsEdit(true);
    } else {
      console.log("submit", values);
      // triggerUpdate(values);
    }
  }

  function handleCancelDelete() {
    // isEdit = true -> button cancel
    if (isEdit) {
      setIsEdit(false);
    } else {
      // trigger mutate
      // triggerDelete(rowData?.id ?? 0);
    }
  }

  function onclose() {
    setIsEdit(false);
    form.reset();
    close();
    resetRow();
  }

  useEffect(() => {
    if (rowData) {
      // Even if query.data changes, form will be initialized only once
      // console.log("masuk sini", rowData.date);
      // setDate(new Date(rowData.date));
      form.initialize({
        date: new Date(rowData.date),
        type: rowData.type,
        amount: rowData.amount,
        category: rowData.category,
        notes: rowData.notes,
      });
    }
  }, [rowData]);

  console.log("get values", form.getValues());
  console.log("rowData modal", rowData);

  return (
    <Modal
      opened={open}
      onClose={onclose}
      title="Update Transaction"
      centered
      styles={{ title: { fontWeight: "bold" } }}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack mt="sm" gap="lg">
          <DateInput
            disabled
            required
            label="Select Date"
            valueFormat="DD MMM YYYY"
            // value={date}
            leftSection={<IconCalendar />}
            {...form.getInputProps("date")}
          />
          <Select
            required
            disabled={!isEdit}
            label="Cash In/Out"
            data={["outflow", "inflow"]}
            placeholder="Cash In / Cash Out"
            {...form.getInputProps("type")}
          />
          <NumberInput
            required
            disabled={!isEdit}
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
            disabled={!isEdit}
            label="Category"
            data={CATEGORY}
            placeholder="pilih kategori"
            searchable
            {...form.getInputProps("category")}
          />
          <TextInput
            required
            disabled={!isEdit}
            label="Notes"
            placeholder="keterangan"
            {...form.getInputProps("notes")}
          />
          {/* <Button my="md" type="submit">
            Record Transaction
           </Button> */}
        </Stack>
        <Group mt="lg" justify="flex-end">
          <Button
            color={isEdit ? "gray" : "red"}
            onClick={handleCancelDelete}
            w={100}
          >
            {isEdit ? "Cancel" : "Delete"}
          </Button>
          <Button type="submit" w={100}>
            {isEdit ? "Confirm" : "Edit"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
