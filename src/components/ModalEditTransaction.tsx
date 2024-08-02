import { deleteTransaction } from "@/api/endpoints/delete-transaction";
import { GetTransactionData } from "@/api/endpoints/get-transaction";
import { CATEGORY } from "@/helper/constant";
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
import { useEffect, useState } from "react";
import { TransactionFormData } from "./ModalNewTransactions";

type ModalEditProps = {
  open: boolean;
  close: () => void;
  rowData: GetTransactionData | undefined;
};

export default function ModalEditTransaction({
  open,
  close,
  rowData,
}: ModalEditProps) {
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
