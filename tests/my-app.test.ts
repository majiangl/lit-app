import { fixture, expect } from "@open-wc/testing";

import { type MyApp } from "../src/my-app";
import "../src/my-app";

describe("MyApp", () => {
  let element: MyApp;
  beforeEach(async () => {
    element = await fixture("<my-app></my-app>");
  });

  it("renders a h1", () => {
    const h1 = element.shadowRoot!.querySelector("h1")!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal("My app");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
