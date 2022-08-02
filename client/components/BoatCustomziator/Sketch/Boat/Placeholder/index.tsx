import Boat, { CustomizationConfig } from "..";
import ReactObject from "../../ReactObject";
import EnginesAnimationCustomizator from "../../../UI/EnginesAnimationCustomizator"
import style from "./style.module.scss";

export default class Placeholder extends ReactObject {
  constructor(public readonly key: string, public readonly label: string) {
    super();
  }

  render(): JSX.Element {
    return (
      <div
        // className={style.placeholder}
        // onPointerDown={ }
      >

        <EnginesAnimationCustomizator title={'Engine Pose'}  />

      </div>
    );
  }
}
