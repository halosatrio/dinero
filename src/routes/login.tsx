import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import { Button, Center, PasswordInput, Stack, TextInput } from "@mantine/core";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <AppLayout>
      <Center h="100%">
        <Stack>
          <h2>Sign in to your account</h2>

          <form>
            <TextInput
              label="Email Address"
              placeholder="email address..."
              mb="xl"
            />

            <PasswordInput label="Password" placeholder="password..." mb="xl" />

            <Button fullWidth>Sign In</Button>
          </form>
        </Stack>
      </Center>
    </AppLayout>
  );
}
