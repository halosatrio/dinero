import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import dayjs from "dayjs";
import NavigationBar from "../components/NavigationBar";
import {
  Button,
  Center,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import { useIcon } from "../helper/useIcon";
import ModalNewTransaction from "../components/ModalNewTransactions";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [opened, { open, close }] = useDisclosure();

  const now = dayjs();

  const {
    data: dataTx,
    isLoading,
    isSuccess,
    status,
  } = useQuery({
    queryKey: ["get-transaction"],
    queryFn: async (): Promise<any> => {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/transaction`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        })
        .then((res) => res.data.data);
    },
  });
  const data = [
    {
      id: 4,
      user_id: 1,
      type: "outflow",
      amount: 14000,
      category: "makan",
      date: "2024-06-27",
      note: "ketoprak",
      is_active: true,
      created_at: "2024-06-26T17:20:48.090Z",
      updated_at: "2024-06-26T17:20:48.090Z",
    },
    {
      id: 3,
      user_id: 1,
      type: "outflow",
      amount: 20000,
      category: "makan",
      date: "2024-06-27",
      note: "hejo",
      is_active: true,
      created_at: "2024-06-26T17:20:27.973Z",
      updated_at: "2024-06-27T02:14:49.762Z",
    },
  ];

  const rows = data.map((element: any) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(element.amount)}
      </Table.Td>
      <Table.Td pl="1.5rem">{useIcon(element.category)}</Table.Td>
      <Table.Td miw="6rem">{element.note}</Table.Td>
    </Table.Tr>
  ));

  const today = dayjs();
  return (
    <AppLayout>
      <Stack>
        <NavigationBar />
        <LoadingOverlay visible={isLoading} />

        <div>
          <Title order={3} ta="center" mt="xl">
            {today.format("dddd, DD MMMM YYYY")}
          </Title>
          <Paper mx="lg" mt="4rem" p="lg" shadow="md">
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
          <Center mt="4rem">
            <Button size="lg" w="20rem" onClick={open}>
              New Transaction
            </Button>
          </Center>
        </div>
      </Stack>

      {/* Modal */}
      <ModalNewTransaction open={opened} close={close} />
    </AppLayout>
  );
}
