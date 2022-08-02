import ReactDOM from "react-dom";
import { CSS2DObject } from "@three/renderers/CSS2DRenderer";

/**
 * Class for simply inserting react component as threejs objects
 */
export default abstract class ReactObject extends CSS2DObject {
  constructor() {
    super(document.createElement("div"));

    this.addEventListener("added", () => this.forceUpdate());
    this.addEventListener("removed", () => (this.mounted = false));
  }

  /**
   * Method returning JSX of React component which will be rendered
   */
  abstract render(): JSX.Element;
  mounted = false;

  /**
   * trigger State update in component
   */
  forceUpdate() {
    this.mounted = true;
    ReactDOM.render(this.render(), this.element);
  }

  /**
   * Add additional opacity parameter for animations
   * add setter/getter to work with gsap
   */
  get opacity() {
    return parseFloat(this.element.style.opacity || "1");
  }

  set opacity(value: number) {
    this.element.style.opacity = value.toString();
  }

  /**
   * For easy chaining
   */
  setOpacity(value: number) {
    this.opacity = value;
    return this;
  }

  setPosition({ x, y, z }: { [key in "x" | "y" | "z"]: number }) {
    this.position.set(x, y, z);
    return this;
  }

  setVisible(value: boolean) {
    if (!value) this.dispose();
    else if (!this.mounted) this.forceUpdate();
    this.element.style.visibility = value ? "visible" : "hidden";
    this.visible = value;
    return this;
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.element);
    this.mounted = false;
  }
}
