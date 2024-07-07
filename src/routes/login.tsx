import { Router, createFileRoute, useNavigate } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import { Button, Center, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "@mantine/form";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

interface LoginSchema {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate({ from: "/login" });
  const form = useForm<LoginSchema>({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (bodyReq: LoginSchema) => {
      axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        ...bodyReq,
      });
    },
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });
  function onSubmitLogin(bodyReq: LoginSchema) {
    mutate({ ...bodyReq });
  }

  return (
    <AppLayout>
      <Center h="100%">
        <Stack>
          <h2>Sign in to your account</h2>
          <form onSubmit={form.onSubmit((values) => onSubmitLogin(values))}>
            <TextInput
              label="Email Address"
              placeholder="email address..."
              mb="xl"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="password..."
              mb="xl"
              required
              {...form.getInputProps("password")}
            />
            <Button fullWidth type="submit">
              Sign In
            </Button>
          </form>
        </Stack>
      </Center>
    </AppLayout>
  );
}
