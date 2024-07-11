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
    <Paper bg="teal.2" mb="xl" py="lg" radius={0}>
      <Grid>
        <Grid.Col span={3}>
          <Link to={"/"}>
            <Center>
              <IconHomeFilled size={36} />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/transactions"}>
            <Center>
              <IconFileSpreadsheet size={36} />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/reports"}>
            <Center>
              <IconChartPieFilled size={36} />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/assets"}>
            <Center>
              <IconCash size={36} />
            </Center>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
