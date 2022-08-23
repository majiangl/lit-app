import type { LitElement } from "lit";
import type { Store } from "redux";
import { storeProp, UPDATE_STORE } from "./internal";

type Constructor<T> = new (...args: any[]) => T;

export function StoreProvider<T extends Constructor<LitElement>>(superClass: T) {
  class StoreProviderElement extends superClass {
    protected createStore?: () => Store;

    private [storeProp]?: Store;

    getStore() {
      return this[storeProp];
    }

    protected shouldStoreUpdate(changedProperties: Map<PropertyKey, unknown>) {
      return false;
    }

    override willUpdate(changedProperties: Map<PropertyKey, unknown>) {
      if (!this.createStore) {
        throw new Error("Function `createStore()` is not implemented. It is required to use `StoreProvider`.");
      }
      // First render
      if (!this[storeProp]) {
        this[storeProp] = this._createStore();
      } else {
        if (this.shouldStoreUpdate(changedProperties)) {
          const prevStore = this[storeProp];
          const nextStore = this._createStore();
          this._updateStore(prevStore, nextStore);
        }
      }
      super.willUpdate(changedProperties);
    }

    private _createStore() {
      const store = this.createStore!();
      if (!store) {
        throw new Error(`Store shouldn't be empty. Function \`createStore()\` returned ${store}`);
      }
      return store;
    }

    private _updateStore(prevStore: Store, nextStore: Store) {
      this[storeProp] = nextStore;
      // notify
      prevStore.replaceReducer((state, action) => action);
      prevStore.dispatch({
        type: UPDATE_STORE,
        payload: nextStore,
      });
    }
  }

  return StoreProviderElement;
}
