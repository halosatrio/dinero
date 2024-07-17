import {
  Button,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { CATEGORY } from "../helper/constant";
import { IconCalendar } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { notifications } from "@mantine/notifications";

type ModalNewTransactionProps = {
  open: boolean;
  close: () => void;
};

type NewTransactionSchema = {
  type: "inflow" | "outflow";
  amount: number;
  category: string;
  date: string | Date;
  notes: string;
};

export default function ModalNewTransaction({
  open,
  close,
}: ModalNewTransactionProps) {
  const form = useForm<NewTransactionSchema>();

  const { mutate } = useMutation({
    mutationFn: async (bodyReq: NewTransactionSchema) => {
      await axios
        .post(
          `${import.meta.env.VITE_API_URL}/transaction/create`,
          {
            ...bodyReq,
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
            },
          }
        )
        .catch((err) => {
          throw new Error(JSON.stringify(err.response.data));
        });
    },
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
  function handleSubmit(values: any) {
    mutate({
      type: values.type,
      amount: values.amount,
      category: values.category,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      notes: values.notes,
    });
  }

  return (
    <Modal
      opened={open}
      onClose={close}
      title="New Transaction"
      centered
      styles={{ title: { fontWeight: "bold" } }}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack mt="sm" gap="lg">
          <DateInput
            required
            label="Select Date"
            valueFormat="DD MMM YYYY"
            leftSection={<IconCalendar />}
            defaultValue={new Date()}
            {...form.getInputProps("date")}
          />
          <Select
            required
            label="Cash In/Out"
            data={["outflow", "inflow"]}
            defaultValue={"outflow"}
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
            {...form.getInputProps("category")}
          />
          <TextInput
            required
            label="Notes"
            placeholder="keterangan"
            {...form.getInputProps("notes")}
          />
          <Button mt="xl" size="lg" type="submit">
            Record Transaction
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
