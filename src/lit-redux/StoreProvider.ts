import type { LitElement } from "lit";
import type { PropertyValues } from "@lit/reactive-element";
import type { Store } from "redux";
import { storeInstance } from "./internal";

type Constructor<T> = new (...args: any[]) => T;

export function StoreProvider<T extends Constructor<LitElement>>(superClass: T) {
  abstract class StoreProviderElement extends superClass {
    /**
     * Current store instance. The unique Symbol `storeInstance` helps identify current element as a `StoreProvider`.
     * @private
     */
    private [storeInstance]?: Store;

    /**
     * Indicates whether a new store instance should be used. Invoked on `LitElement.willUpdate()`.
     * @param changedProperties   Map of changed properties with old values
     * @protected
     */
    protected shouldStoreChange(changedProperties: PropertyValues) {
      return false;
    }

    /**
     * Should be implemented by subclass. It will be invoked on first rendering and subsequent updates
     * if `shouldStoreUpdate()` returns true.
     * @protected
     */
    protected abstract createStore(): Store;

    /**
     * Callback function that needs to be overridden. It's called when a new store instance is provided.
     * @param prevStore Previous store
     * @param nextStore Next store
     * @protected
     */
    protected onStoreChange(prevStore: Store, nextStore: Store) {
      return;
    }

    override willUpdate(changedProperties: PropertyValues) {
      /* This branch is for initial rendering */
      if (!this[storeInstance]) {
        this[storeInstance] = this._createStore();
      } else {
        /* This branch is for update cycles */
        if (this.shouldStoreChange(changedProperties)) {
          const prevStore = this[storeInstance];
          this[storeInstance] = this._createStore();

          // Firstly, Notify element itself for store change
          this.onStoreChange(prevStore, this[storeInstance]);

          // Secondly, Trigger `storechange` event
          const evt = new CustomEvent("storechange", {
            bubbles: false,
          });
          this.dispatchEvent(evt);
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
