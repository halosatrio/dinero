import {
  Button,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { CATEGORY } from "../helper/constant";
import { IconCalendar } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

type ModalNewTransactionProps = {
  open: boolean;
  close: () => void;
};

export default function ModalNewTransaction({
  open,
  close,
}: ModalNewTransactionProps) {
  const form = useForm({
    initialValues: {
      date: new Date(),
      category: undefined,
      type: "outflow",
      amount: undefined,
      notes: undefined,
    },
  });
  return (
    <Modal
      opened={open}
      onClose={close}
      title={<Title order={3}>New Transaction</Title>}
      centered
    >
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack mt="sm" gap="lg">
          <DateInput
            required
            label="Select Date"
            valueFormat="DD MMM YYYY"
            leftSection={<IconCalendar />}
            {...form.getInputProps("date")}
          />
          <Select
            required
            label="Cash In/Out"
            data={["Outflow", "Inflow"]}
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
