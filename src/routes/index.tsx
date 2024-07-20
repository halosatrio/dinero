import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
  Button,
  Center,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
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

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [opened, { open, close }] = useDisclosure();

  const today = dayjs();

  const { data: dataTx, isLoading } = useQuery<GetTransactionResponse>({
    queryKey: ["get-transaction"],
    queryFn: () =>
      getTransaction({
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        },
      }),
    retry: false,
  });

  const rows = dataTx?.data.map((element: GetTransactionData) => (
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
  ));

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
