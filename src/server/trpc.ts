import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "./controller/app";
import SuperJSON from "superjson";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      transformer: SuperJSON,
    }),
  ],
});
