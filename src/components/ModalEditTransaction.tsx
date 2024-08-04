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
import { useMutation, useQuery } from "@tanstack/react-query";
import { CATEGORY } from "@/helper/constant";
import { deleteTransaction } from "@/api/endpoints/delete-transaction";
import { TransactionFormData } from "./ModalNewTransactions";
import {
  getTransactionDetail,
  GetTransactionDetailResponse,
} from "@/api/endpoints/get-transaction-by-id";

type ModalEditProps = {
  open: boolean;
  close: () => void;
  rowId: number | undefined;
  resetRow: () => void;
};

export default function ModalEditTransaction({
  open,
  close,
  rowId,
  resetRow,
}: ModalEditProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [date, setDate] = useState<Date>();

  const form = useForm<Omit<TransactionFormData, "date">>({
    mode: "controlled",
    initialValues: {
      type: undefined,
      amount: undefined,
      category: undefined,
      notes: "",
    },
  });

  const { data } = useQuery<GetTransactionDetailResponse>({
    queryKey: ["get-transaction-month", rowId],
    queryFn: () =>
      getTransactionDetail(rowId!, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        },
      }),
    retry: false,
    enabled: !!rowId,
  });

  const { mutate: triggerUpdate } = useMutation({
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
      close();
      form.reset();
    },
  });

  function handleSubmit(values: Omit<TransactionFormData, "date">) {
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
      triggerDelete(rowId!);
    }
  }

  function onclose() {
    setIsEdit(false);
    form.reset();
    close();
    resetRow();
  }

  useEffect(() => {
    if (data?.data) {
      // Even if query.data changes, form will be initialized only once
      // seperate date field because it wont update
      // or even give error toISOString is not a function
      setDate(new Date(data.data.date));
      form.setValues({
        type: data.data.type,
        amount: data.data.amount,
        category: data.data.category,
        notes: data.data.notes,
      });
    }
  }, [data?.data]);

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
            value={date}
            leftSection={<IconCalendar />}
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
