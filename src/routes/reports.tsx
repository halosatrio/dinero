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
  getReportQuarterNonEssentials,
  getReportQuarterShopping,
  GetReportQuarterRes,
  GetReportQuarterShoppingRes,
} from "@/api/endpoints/get-report-quarter";
import { useState } from "react";
import { useIcon } from "@/helper/useIcon";
import { CategoryType } from "@/helper/constant";
import {
  getReportAnnualCashflow,
  GetReportAnnualCashflowRes,
} from "@/api/endpoints/get-report-annual";

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
    useQuery<GetReportQuarterRes>({
      queryKey: ["get-report-quarter-essentials", value],
      queryFn: () =>
        getReportQuarterEssentials({
          params: {
            year: value?.split("-")[0],
            q: value?.split("-")[1],
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
      enabled: typeof value === "string" && value?.split("-").length > 1,
    });

  const { data: dataQuarterNonEssentials, isLoading: loadingNonEssentials } =
    useQuery<GetReportQuarterRes>({
      queryKey: ["get-report-quarter-non-essentials", value],
      queryFn: () =>
        getReportQuarterNonEssentials({
          params: {
            year: value?.split("-")[0],
            q: value?.split("-")[1],
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
      enabled: typeof value === "string" && value?.split("-").length > 1,
    });

  const { data: dataQuarterShopping, isLoading } =
    useQuery<GetReportQuarterShoppingRes>({
      queryKey: ["get-report-quarter-shopping", value],
      queryFn: () =>
        getReportQuarterShopping({
          params: {
            year: value?.split("-")[0],
            q: value?.split("-")[1],
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
      enabled: typeof value === "string" && value?.split("-").length > 1,
    });

  const { data: dataAnnualCashflow, isLoading: isLoadingAnnualCashflow } =
    useQuery<GetReportAnnualCashflowRes>({
      queryKey: ["get-report-annual-cashflow", value],
      queryFn: () =>
        getReportAnnualCashflow({
          params: {
            year: value,
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
          },
        }),
      retry: false,
      enabled: typeof value === "string" && value?.split("-").length <= 1,
    });

  function transformData(
    data: any
  ): Array<{ category: CategoryType; amount: number[] }> {
    const categories = [
      ...new Set(
        Object.values(data?.data).flatMap((month: any) =>
          month.map((item: any) => item.category)
        )
      ),
    ];

    return categories.map((category) => {
      const amount = Object.values(data.data).map((month: any) => {
        const item = month.find((item: any) => item.category === category);
        return item ? item.amount : 0;
      });

      return { category, amount };
    });
  }

  const transformedEssentialsData =
    dataQuarterEssentials !== undefined
      ? transformData(dataQuarterEssentials)
      : undefined;
  const transformedNonEssentialsData =
    dataQuarterNonEssentials !== undefined
      ? transformData(dataQuarterNonEssentials)
      : undefined;

  return (
    <AppShell pt="lg">
      <AppShell.Main pb="5rem" px="sm">
        <LoadingOverlay
          visible={
            isLoading ||
            loadingEssentials ||
            loadingNonEssentials ||
            isLoadingAnnualCashflow
          }
        />
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

        {typeof value === "string" && value?.split("-").length > 1 ? (
          <>
            {/* REGION: Report Card Essentials */}
            <Paper shadow="md" mt="lg" pb="md" withBorder>
              <Center my="md" fw="bold" fz="h3">
                Essentials
              </Center>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th>July</Table.Th>
                    <Table.Th>August</Table.Th>
                    <Table.Th>September</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {transformedEssentialsData?.map((item) => (
                    <Table.Tr key={item.category}>
                      {/* <Table.Td fw={"bold"}>{item.category}</Table.Td> */}
                      <Table.Td fz="xs">{useIcon(item.category)}</Table.Td>
                      {item.amount.map((item, idx) => (
                        <Table.Td key={idx}>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(item)}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>

            {/* REGION: Report Card Non-Essentials*/}
            <Paper shadow="md" mt="lg" pb="md" withBorder>
              <Center my="md" fw="bold" fz="h3">
                Non Essentials
              </Center>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th>July</Table.Th>
                    <Table.Th>August</Table.Th>
                    <Table.Th>September</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {transformedNonEssentialsData?.map((item) => (
                    <Table.Tr key={item.category}>
                      {/* <Table.Td fw={"bold"}>{item.category}</Table.Td> */}
                      <Table.Td fz="xs">{useIcon(item.category)}</Table.Td>
                      {item.amount.map((item, idx) => (
                        <Table.Td key={idx}>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(item)}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>

            {/* REGION: Report Card Shopping */}
            <Paper shadow="md" mt="lg" pb="md" withBorder>
              <Center my="md" fw="bold" fz="h3">
                Belanja
              </Center>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>July</Table.Th>
                    <Table.Th>August</Table.Th>
                    <Table.Th>September</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                {dataQuarterShopping !== undefined ? (
                  <Table.Tbody>
                    <Table.Tr>
                      {Object.values(dataQuarterShopping?.data).map(
                        (item, idx) => (
                          <Table.Td key={idx}>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(item as number)}
                          </Table.Td>
                        )
                      )}
                    </Table.Tr>
                  </Table.Tbody>
                ) : null}
              </Table>
            </Paper>
          </>
        ) : (
          <Paper shadow="md" mt="lg" pb="md" withBorder>
            <Center my="md" fw="bold" fz="h3">
              ANNUAL CASHFLOW
            </Center>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  {/* <Table.Th>Bulan</Table.Th> */}
                  <Table.Th>Inflow</Table.Th>
                  <Table.Th>Outflow</Table.Th>
                  <Table.Th>Saving</Table.Th>
                </Table.Tr>
              </Table.Thead>
              {dataAnnualCashflow !== undefined ? (
                <Table.Tbody>
                  {Object.values(dataAnnualCashflow?.data?.monthly).map(
                    (item) => (
                      <Table.Tr key={item.month}>
                        {/* <Table.Td>
                          {dayjs()
                            .month(item.month - 1)
                            .format("MMM")}
                        </Table.Td> */}
                        <Table.Td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(item.inflow)}
                        </Table.Td>
                        <Table.Td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(item.outflow)}
                        </Table.Td>
                        <Table.Td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(item.saving)}
                        </Table.Td>
                      </Table.Tr>
                    )
                  )}
                  <Table.Tr>
                    <Table.Th colSpan={3}>
                      <Center fz="h5">Total Cashflow</Center>
                    </Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(dataAnnualCashflow?.data?.total?.total_inflow)}
                    </Table.Td>
                    <Table.Td>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(
                        dataAnnualCashflow?.data?.total?.total_outflow!
                      )}
                    </Table.Td>
                    <Table.Td>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(dataAnnualCashflow?.data?.total?.total_saving)}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              ) : null}
            </Table>
          </Paper>
        )}
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
    </AppShell>
  );
}
