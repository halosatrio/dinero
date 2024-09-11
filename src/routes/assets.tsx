import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AppShell,
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

export const Route = createFileRoute("/assets")({
  component: AssetPage,
});

function AssetPage() {
  const { data: dataAssetRecord, isLoading } = useQuery<GetAssetRecordRes>({
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
        <Paper shadow="md" mt="lg" pb="md" withBorder>
          {sortedDates.map((date) => (
            <div key={date}>
              <Center>{date}</Center>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Notes</Table.Th>
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
                      <Table.Td>{item.notes || "-"}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          ))}
        </Paper>
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
    </AppShell>
  );
}
