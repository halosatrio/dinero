import {
  Button,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { notifications } from "@mantine/notifications";
import {
  postCreateAsset,
  PostCreateAssetPayload,
} from "@/api/endpoints/post-create-asset";
import { useCookies } from "react-cookie";

type ModalNewAssetProps = {
  open: boolean;
  close: () => void;
  refetch: () => void;
};

export type TransactionFormData = {
  account: undefined | "BCA" | "BLU" | "BIBIT"; // hardcoded accounts can be changed into dynamic
  amount: number | undefined;
  date: string | Date;
  notes: string | undefined;
};

export default function ModalNewAsset({
  open,
  close,
  refetch,
}: ModalNewAssetProps) {
  const [cookies] = useCookies(["token"]);
  const form = useForm<TransactionFormData>({
    initialValues: {
      date: new Date(),
      amount: undefined,
      account: undefined,
      notes: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (bodyReq: PostCreateAssetPayload) => {
      postCreateAsset(bodyReq, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
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
      refetch();
      close();
      form.reset();
    },
  });
  function handleSubmit(values: TransactionFormData) {
    if (values.amount === undefined || values.account === undefined) {
      notifications.show({
        color: "red",
        title: "Data Incomplete!",
        message: "Please complete the input data",
      });
    } else {
      mutate({
        date: dayjs(values.date).format("YYYY-MM-DD"),
        amount: values.amount,
        account: values.account,
        notes: values.notes,
      });
    }
  }

  return (
    <Modal
      opened={open}
      onClose={close}
      title="New Asset Record"
      centered
      styles={{ title: { fontWeight: "bold" } }}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack mt="sm" gap="lg">
          <DatePickerInput
            required
            label="Select Date"
            valueFormat="DD MMM YYYY"
            leftSection={<IconCalendar />}
            {...form.getInputProps("date")}
          />
          <Select
            required
            label="Account"
            data={["BCA", "BLU", "BIBIT"]}
            placeholder="Account"
            {...form.getInputProps("account")}
          />
          <NumberInput
            required
            label="Amount"
            placeholder="masukkan nilai asset"
            allowNegative={false}
            thousandSeparator="."
            decimalSeparator=","
            leftSection="Rp"
            {...form.getInputProps("amount")}
          />
          <TextInput
            label="Notes"
            placeholder="keterangan"
            {...form.getInputProps("notes")}
          />
          <Button mt="xl" size="lg" type="submit">
            Record Asset
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
