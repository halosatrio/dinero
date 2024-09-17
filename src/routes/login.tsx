import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AppLayout from "../components/AppLayout";
import { Button, Center, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  postAuthLogin,
  PostAuthLoginPayload,
} from "@/api/endpoints/post-auth-login";
import { useCookies } from "react-cookie";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate({ from: "/login" });
  const [_, setCookie] = useCookies(["token"]);
  const form = useForm<PostAuthLoginPayload>({
    initialValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmitLogin(bodyReq: PostAuthLoginPayload) {
    await postAuthLogin(bodyReq, {}).then((data) => {
      setCookie("token", data.data);
      navigate({ to: "/" });
    });
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
