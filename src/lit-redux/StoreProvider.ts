import type { LitElement } from "lit";
import { store } from "./internal";
import type { Store } from "redux";

type Constructor<T> = new (...args: any[]) => T;

export function StoreProvider<T extends Constructor<LitElement>>(superClass: T) {
  abstract class StoreProviderMixin extends superClass {
    abstract createStore(): Store;

    [store]?: Store;

    getStore() {
      return this[store];
    }

    override willUpdate(changedProperties: Map<PropertyKey, unknown>) {
      if (this.shouldStoreUpdate(changedProperties)) {
        this.updateStore();
      }
      super.willUpdate(changedProperties);
    }

    shouldStoreUpdate(changedProperties: Map<PropertyKey, unknown>) {
      return !this.getStore();
    }

    updateStore() {
      const prevStore = this[store];
      const nextStore = this.createStore();
      this[store] = nextStore;
      if (prevStore) {
        //TODO: notify change
      }
    }
  }

  return StoreProviderMixin;
}
