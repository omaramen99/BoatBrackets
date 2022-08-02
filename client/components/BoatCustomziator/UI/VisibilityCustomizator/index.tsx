import { VisibilityCustomization } from "@component/BoatCustomziator/Sketch/Boat/CustomizationManager";
import style from "./style.module.scss";

interface Props {
  customization: VisibilityCustomization;
  onSelect?: (option: VisibilityCustomization["options"][number]) => void;
}

export default function VisibilityCustomizator({
  customization,
  onSelect,
}: Props) {
  return (
    <div className={style.container}>
      <div className={style.strip}>
        {customization.options.map((option, index) => (
          <div
            key={index}
            className={style.stripElement}
            style={{ backgroundImage: `url('${option.imageURL}')` }}
            onPointerDown={() => onSelect && onSelect(option)}
          ></div>
        ))}
      </div>
    </div>
  );
}
