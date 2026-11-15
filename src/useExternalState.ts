import { useMemo } from "react";
import { isState, type State, type StatePayloadMap } from "stategear";
import { useExternalStateSubscription } from "./useExternalStateSubscription.ts";
import { shallowEqual } from "./shallowEqual.ts";
import { Subscribe } from "./types/Subscribe.ts";
import { SetExternalStateValue } from "./types/SetExternalStateValue.ts";

export function useExternalState<T, P extends StatePayloadMap<T>, V = T>(
  state: State<T, P> | null | undefined,
  selector?: ((value: T) => V) | boolean,
  equal = shallowEqual,
): [V, SetExternalStateValue<T, P>] {
  let [subscribe, getSnapshot] = useMemo<[Subscribe | boolean | undefined, (() => V) | undefined]>(() => {
    if (!isState<T, P>(state)) return [undefined, undefined];
    if (selector === false) return [false, undefined];

    let transform = typeof selector === "function"
      ? selector
      : (x: T) => x as unknown as V;

    return [
      (render) => {
        return state.on("update", ({ current, previous }) => {
          if (!equal(transform(current), transform(previous))) render();
        });
      },
      () => transform(state.getValue()),
    ];
  }, [state, selector, equal]);

  return useExternalStateSubscription(state, subscribe, getSnapshot);
}
