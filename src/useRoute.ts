import { useCallback, useContext, useMemo } from "react";
import type { NavigationOptions } from "stategear";
import { RouteContext } from "./RouteContext.ts";
import type { RenderCallback } from "./types/RenderCallback.ts";
import type { Subscribe } from "./types/Subscribe.ts";
import { useExternalStateSubscription } from "./useExternalStateSubscription.ts";

export function useRoute(callback?: RenderCallback<NavigationOptions>) {
  let route = useContext(RouteContext);

  let subscribe = useCallback<Subscribe>(
    (render) =>
      route.on("navigation", (payload) => {
        if (callback) callback(render, payload);
        else render();
      }),
    [route, callback],
  );

  useExternalStateSubscription(route, subscribe);

  return useMemo(
    () => ({
      route,
      at: route.at.bind(route),
    }),
    [route],
  );
}
