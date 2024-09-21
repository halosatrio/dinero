import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

import "./index.css";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

interface QueryError extends Error {
  response?: {
    status?: number;
  };
}

// import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Notifications } from "@mantine/notifications";
// create a new router instance
const router = createRouter({ routeTree });
// register the router instance for the type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: QueryError) => {
      if (error?.response?.status === 401 || error?.response?.status === 204) {
        console.log(`Something went wrong:`, error?.response?.status);
        router.navigate({ to: "/login" });
      }
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <Notifications position="bottom-center" />
      <QueryClientProvider client={queryClient}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <RouterProvider router={router} />
        </CookiesProvider>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);
