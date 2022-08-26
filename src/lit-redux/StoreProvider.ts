import type { LitElement } from "lit";
import type { PropertyValues } from "@lit/reactive-element";
import type { Store } from "redux";
import { storeProp, UPDATE_STORE } from "./internal";

type Constructor<T> = new (...args: any[]) => T;

export function StoreProvider<T extends Constructor<LitElement>>(superClass: T) {
  abstract class StoreProviderElement extends superClass {
    /**
     * Current store instance. The unique Symbol `storeProp` helps identify current element as a `StoreProvider`.
     * @private
     */
    private [storeProp]?: Store;

    /**
     * Returns current store instance.
     */
    getStore() {
      return this[storeProp];
    }

    /**
     * Indicates whether a new store instance should be provided. Invoked on `LitElement.willUpdate()`.
     * @param changedProperties   Map of changed properties with old values
     * @protected
     */
    protected shouldStoreUpdate(changedProperties: PropertyValues) {
      return false;
    }

    /**
     * Should be implemented by subclass. It will be invoked on first rendering and subsequent updates
     * if `shouldStoreUpdate()` returns true.
     * @protected
     */
    protected abstract createStore(): Store;

    override willUpdate(changedProperties: PropertyValues) {
      // First rendering
      if (!this[storeProp]) {
        this[storeProp] = this._createStore();
      } else {
        // Subsequent updates
        if (this.shouldStoreUpdate(changedProperties)) {
          const prevStore = this[storeProp];
          const nextStore = this._createStore();
          // Notify all connected directives to listen to new store
          prevStore.replaceReducer((state, action) => action);
          prevStore.dispatch({
            type: UPDATE_STORE,
            payload: nextStore,
          });
        }
      }
      super.willUpdate(changedProperties);
    }

    /**
     * Invokes `createStore()` and returns the store. Throws error if created store is null or undefined.
     * @private
     */
    private _createStore() {
      const store = this.createStore();
      if (!store) {
        throw new Error(`Store can't be empty. Function \`createStore()\` returned ${store}`);
      }
      return store;
    }
  }

  return StoreProviderElement;
}
