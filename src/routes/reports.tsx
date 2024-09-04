import { createFileRoute } from "@tanstack/react-router";
import NavigationBar from "../components/NavigationBar";
import {
  AppShell,
  Box,
  Center,
  LoadingOverlay,
  Paper,
  Select,
  Table,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  getReportQuarterEssentials,
  GetReportQuarterEssentialsRes,
} from "@/api/endpoints/get-report-quarter-essentials";
import { useState } from "react";
import {
  getReportQuarterNonEssentials,
  GetReportQuarterNonEssentialsRes,
} from "@/api/endpoints/get-report-quarter-non-essentials";
import {
  getReportQuarterShopping,
  GetReportQuarterShoppingRes,
} from "@/api/endpoints/get-report-quarter-shopping";

export const Route = createFileRoute("/reports")({
  component: ReportPage,
});

const PERIOD_DATA = [
  { value: "2024-3", label: "Q3 2024" },
  { value: "2024-4", label: "Q4 2024" },
  { value: "2024", label: "Annual 2024" },
  { value: "2025-1", label: "Q1 2025" },
];

function ReportPage() {
  const [value, setValue] = useState<string | null>("2024-3");

  const { data: dataQuarterEssentials, isLoading: loadingEssentials } =
    useQuery<GetReportQuarterEssentialsRes>({
      queryKey: ["get-report-quarter-essentials"],
      queryFn: () =>
        getReportQuarterEssentials({
          params: {
            year: 2024,
            q: 3,
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
    });

  const { data: dataQuarterNonEssentials, isLoading: loadingNonEssentials } =
    useQuery<GetReportQuarterNonEssentialsRes>({
      queryKey: ["get-report-quarter-non-essentials"],
      queryFn: () =>
        getReportQuarterNonEssentials({
          params: {
            year: 2024,
            q: 3,
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
    });

  const { data: dataQuarterShopping, isLoading } =
    useQuery<GetReportQuarterShoppingRes>({
      queryKey: ["get-report-quarter-shopping"],
      queryFn: () =>
        getReportQuarterShopping({
          params: {
            year: 2024,
            q: 3,
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
    });

  console.log("dataQuarterEssentials", dataQuarterEssentials);
  console.log("dataQuarterNonEssentials", dataQuarterNonEssentials);
  console.log("dataQuarterShopping", dataQuarterShopping);
  // console.log(value);

  return (
    <AppShell pt="lg">
      <AppShell.Main pb="5rem" px="sm">
        <LoadingOverlay visible={isLoading} />
        <Title order={3} ta="center" mb="xl">
          TRANSACTION REPORTS
        </Title>
        <Center>
          <Box w="10rem">
            <Select
              label="Select Period"
              placeholder="Select Period"
              data={PERIOD_DATA}
              value={value}
              onChange={setValue}
              allowDeselect={false}
            />
          </Box>
        </Center>

        {/* REGION: Monthly Transaction */}
        <Paper p="xs" shadow="md" mt="lg" withBorder>
          <Center mb="md" fw="bold" fz="h3">
            Essentials
          </Center>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th>January</Table.Th>
                <Table.Th>February</Table.Th>
                <Table.Th>March</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td fw={"bold"}>Makan</Table.Td>
                {[1400500, 1322000, 1424000].map((item, idx) => (
                  <Table.Td key={idx}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item)}
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={"bold"}>Cafe</Table.Td>
                {[206000, 172000, 184000].map((item, idx) => (
                  <Table.Td key={idx}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item)}
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={"bold"}>Errand</Table.Td>
                {[353500, 407500, 331500].map((item, idx) => (
                  <Table.Td key={idx}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item)}
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={"bold"}>Utils</Table.Td>
                {[1943000, 1743000, 1732500].map((item, idx) => (
                  <Table.Td key={idx}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item)}
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={"bold"}>Bensin</Table.Td>
                {[120000, 160000, 160000].map((item, idx) => (
                  <Table.Td key={idx}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item)}
                  </Table.Td>
                ))}
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
    </AppShell>
  );
}
