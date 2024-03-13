import { appRouter } from "@/server/controller/app";
import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    onError(opts) {
      const { error, type, path, input, ctx, req } = opts;
      console.error("Error:", error);
    },
    createContext: function (
      opts: FetchCreateContextFnOptions
    ): object | Promise<object> {
      return {};
    },
  });
};

export { handler as GET, handler as POST };
