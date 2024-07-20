import { Box, Center, Grid } from "@mantine/core";
import {
  IconCash,
  IconChartPieFilled,
  IconFileSpreadsheet,
  IconHomeFilled,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function NavigationBar() {
  return (
    <Box bg="teal.2" py="sm">
      <Grid>
        <Grid.Col span={3}>
          <Link to={"/"}>
            <Center>
              <IconHomeFilled size={32} />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/transactions"}>
            <Center>
              <IconFileSpreadsheet size={32} />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/reports"}>
            <Center>
              <IconChartPieFilled size={32} />
            </Center>
          </Link>
        </Grid.Col>
        <Grid.Col span={3}>
          <Link to={"/assets"}>
            <Center>
              <IconCash size={32} />
            </Center>
          </Link>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
