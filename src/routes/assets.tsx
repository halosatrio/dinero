import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AppShell,
  Button,
  Center,
  LoadingOverlay,
  Paper,
  Table,
  Title,
} from "@mantine/core";

import NavigationBar from "@/components/NavigationBar";
import {
  getAssetRecord,
  GetAssetRecordRes,
} from "@/api/endpoints/get-asset-record";
import ModalNewAsset from "@/components/ModalNewAsset";
import { useDisclosure } from "@mantine/hooks";

export const Route = createFileRoute("/assets")({
  component: AssetPage,
});

function AssetPage() {
  const [opened, { open, close }] = useDisclosure();

  const {
    data: dataAssetRecord,
    isLoading,
    refetch: refetchAssetRecord,
  } = useQuery<GetAssetRecordRes>({
    queryKey: ["get-asset-record"],
    queryFn: () =>
      getAssetRecord({
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        },
      }),
    retry: false,
  });

  const groupedData = dataAssetRecord
    ? dataAssetRecord?.data?.reduce((acc: any, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      }, {})
    : [];

  // Sort dates
  const sortedDates = Object.keys(groupedData).sort();

  return (
    <AppShell pt="lg">
      <AppShell.Main pb="5rem" px="sm">
        <LoadingOverlay visible={isLoading} />
        <Title order={3} ta="center" mb="xl">
          ASSET RECORDS
        </Title>
        <Center mb="xl">
          <Button size="lg" w="20rem" onClick={open}>
            New Asset Record
          </Button>
        </Center>
        {sortedDates.map((date) => (
          <Paper px="xs" pb="md" shadow="md" mt="lg" withBorder key={date}>
            <Center>
              <Title mt="lg" mb="sm" fz="h4">
                {date}
              </Title>
            </Center>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Account</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  {/* <Table.Th>Notes</Table.Th> */}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {groupedData[date].map((item: any) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.account}</Table.Td>
                    <Table.Td>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(item.amount)}
                    </Table.Td>
                    {/* <Table.Td>{item.notes || "-"}</Table.Td> */}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        ))}
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
      <ModalNewAsset open={opened} close={close} refetch={refetchAssetRecord} />
    </AppShell>
  );
}
