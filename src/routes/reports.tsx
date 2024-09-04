import { createFileRoute } from "@tanstack/react-router";
import NavigationBar from "../components/NavigationBar";
import {
  AppShell,
  Box,
  Center,
  LoadingOverlay,
  Paper,
  Title,
} from "@mantine/core";

export const Route = createFileRoute("/reports")({
  component: ReportPage,
});

function ReportPage() {
  return (
    <AppShell pt="lg">
      <AppShell.Main pb="5rem" px="sm">
        <LoadingOverlay visible={false} />
        <Title order={3} ta="center" mb="xl">
          TRANSACTION REPORTS
        </Title>
        <Center>
          <Box w="10rem">Select Quarter or Annual</Box>
        </Center>

        {/* REGION: Monthly Transaction */}
        <Paper p="xs" shadow="md" mt="lg">
          hehe
        </Paper>
      </AppShell.Main>
      <AppShell.Footer>
        <NavigationBar />
      </AppShell.Footer>
    </AppShell>
  );
}
