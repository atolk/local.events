import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { act } from "@testing-library/react";
import type * as ZustandExportedTypes from "zustand";

const storeResetFns = new Set<() => void>();

vi.mock("zustand", async () => {
  const actual =
    await vi.importActual<typeof ZustandExportedTypes>("zustand");
  const { create: actualCreate, createStore: actualCreateStore } = actual;

  const createUncurried = <T>(
    stateCreator: ZustandExportedTypes.StateCreator<T>
  ) => {
    const store = actualCreate(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => store.setState(initialState, true));
    return store;
  };

  const create = (<T>(
    stateCreator: ZustandExportedTypes.StateCreator<T>
  ) =>
    typeof stateCreator === "function"
      ? createUncurried(stateCreator)
      : createUncurried) as typeof actual.create;

  const createStoreUncurried = <T>(
    stateCreator: ZustandExportedTypes.StateCreator<T>
  ) => {
    const store = actualCreateStore(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => store.setState(initialState, true));
    return store;
  };

  const createStore = (<T>(
    stateCreator: ZustandExportedTypes.StateCreator<T>
  ) =>
    typeof stateCreator === "function"
      ? createStoreUncurried(stateCreator)
      : createStoreUncurried) as typeof actual.createStore;

  return { ...actual, create, createStore };
});

afterEach(() => {
  act(() => storeResetFns.forEach((fn) => fn()));
});
