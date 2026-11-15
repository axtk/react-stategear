import type { State, StatePayloadMap } from "stategear";

export type SetExternalStateValue<
  T,
  P extends StatePayloadMap<T> = StatePayloadMap<T>,
> = State<T, P>["setValue"];
