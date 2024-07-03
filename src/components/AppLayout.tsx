import { Container } from "@mantine/core";
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const demoProps = {
    bg: "var(--mantine-color-blue-light)",
    h: "100vh",
  };

  return (
    <Container size="xs" pt="xs" p={0} {...demoProps}>
      {children}
    </Container>
  );
}
