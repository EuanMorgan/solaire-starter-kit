import "server-only";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

// Stable getter ensuring consistent QueryClient across server requests
export const getQueryClient = cache(makeQueryClient);

// Create typesafe proxy for server-side query operations
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// Reusable component wrapping dehydrated state
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

// Helper to prefetch queries without awaiting completion
// biome-ignore lint/suspicious/noExplicitAny: TRPCQueryOptions generic variance
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  // biome-ignore lint/suspicious/noExplicitAny: infinite query type mismatch
  if ((queryOptions.queryKey[1] as any)?.type === "infinite") {
    // biome-ignore lint/suspicious/noExplicitAny: infinite query options
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

// Direct server caller for data access without hydration
export const caller = appRouter.createCaller(createTRPCContext);
