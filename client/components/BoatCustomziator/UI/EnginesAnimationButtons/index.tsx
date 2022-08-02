import Sketch from "../../Sketch/index"
import style from "./style.module.scss";

import { useEffect, useRef, useState } from "react";
interface Props {
IsUpDirection:boolean,
limit:boolean,
OnAnimationRequested:CallableFunction
}


export default function EnginesAnimationButtons({
  IsUpDirection,
  limit,
  OnAnimationRequested
}: Props) {
  const [animationLimit, setAnimationLimit] = useState<boolean | null>(false);

  return (
    <>
      <div className={`${limit?style.Disabled:style.AnimatoinButton}`} 
      style={{ backgroundImage: `url('media/${IsUpDirection?("up"):("down")}.jpg')`}} 
      onPointerDown={()=>{OnAnimationRequested(IsUpDirection)}}
      >
      </div>
    </>
  );
}
