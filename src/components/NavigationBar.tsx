import { Center, Grid, Paper } from "@mantine/core";
import {
  IconCash,
  IconChartPieFilled,
  IconFileSpreadsheet,
  IconHomeFilled,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function NavigationBar() {
  return (
    <Paper bg="teal.2" mt="xl">
      <Grid>
        <Grid.Col span={3}>
          <Link to={"/"}>
            <Center>
              <IconHomeFilled />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/transactions"}>
            <Center>
              <IconFileSpreadsheet />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/reports"}>
            <Center>
              <IconChartPieFilled />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/assets"}>
            <Center>
              <IconCash />
            </Center>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
