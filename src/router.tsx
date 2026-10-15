import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { BASE_PATH } from "./lib/base";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    basepath: BASE_PATH === "" ? "/" : BASE_PATH,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
