import { Center, Grid, Paper } from "@mantine/core";
import { IconHomeFilled } from "@tabler/icons-react";

export default function NavigationBar() {
  return (
    <Paper bg="teal.2" mt="xl">
      <Grid>
        <Grid.Col span={3}>
          <Center>
            <IconHomeFilled />
          </Center>
        </Grid.Col>
        <Grid.Col span={3}>
          <Center>
            <IconHomeFilled />
          </Center>
        </Grid.Col>
        <Grid.Col span={3}>
          <Center>
            <IconHomeFilled />
          </Center>
        </Grid.Col>
        <Grid.Col span={3}>
          <Center>
            <IconHomeFilled />
          </Center>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
