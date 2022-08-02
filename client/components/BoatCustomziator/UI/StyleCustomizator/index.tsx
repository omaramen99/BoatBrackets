import { StyleCustomization } from "@component/BoatCustomziator/Sketch/Boat/CustomizationManager";
import style from "./style.module.scss";

interface Props {
  customization: StyleCustomization;
  onSelect?: (option: StyleCustomization["options"][number]) => void;
}

export default function StyleCustomizator({ customization, onSelect }: Props) {
  return (
    <div className={style.container}>
      <div className={style.title}>{customization.label}</div>
      <div className={style.strip}>
        {customization.options.map((option, index) => (
          <div
            key={index}
            className={style.stripElement}
            style={{ backgroundColor: option.value }}
            onPointerDown={() => onSelect && onSelect(option)}
          ></div>
        ))}
      </div>
    </div>
  );
}
