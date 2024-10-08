import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class counterApp extends DDDSuper(LitElement) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.counter = 0;
    this.min = 0;
    this.max = 999;
  }

  static get properties() {
    return {
      counter: { type: Number },
      min: { type: Number },
      max: { type: Number },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        font-size: var(--counter-app-font-size, var(--ddd-font-size-s));
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      div {
        padding: 0;
        margin: 0;
      }
      .counter-number {
        color: black;
        font-weight: bold;
      }
    `];
  }

  updated(changedProperties) {
    if (changedProperties.has("counter")) {
      const counterNumber = this.shadowRoot.querySelector(".counter-number");
      if (this.counter == this.min) {
        counterNumber.style.color = "blue";
      }
      else if (this.counter == this.max) {
        counterNumber.style.color = "purple";
      }
      else if (this.counter == 18) {
        counterNumber.style.color = "orange";
      }
      else if (this.counter == 21) {
        counterNumber.style.color = "green";
        this.makeItRain();
      }
      else if (counterNumber.style.color != "black") {
        counterNumber.style.color = "black";
      }
    }
  }

  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  render() {
    return html`
    <div id="counter-container">
      <confetti-container id="confetti">
        <p class="counter-number">${this.counter}</p>
      </confetti-container>

      <button
        class="minusBtn"
        @click="${this.decrease}"
        ?disabled="${this.counter == this.min}"
      >
        <b>-</b>
      </button>

      <button
        class="addBtn"
        @click="${this.increase}"
        ?disabled="${this.counter == this.max}"
      >
        <b>+</b>
      </button>
    </div>`;
  }

  increase() {
    this.counter += 1;
  }

  decrease() {
    this.counter -= 1;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(counterApp.tag, counterApp);