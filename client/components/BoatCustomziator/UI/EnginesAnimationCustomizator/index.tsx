import Sketch from "../../Sketch/index"
import style from "./style.module.scss";
import EnginesAnimationButtons from "../EnginesAnimationButtons"
import { useEffect, useRef, useState } from "react";
interface Props {
title:string
}

export default function EnginesAnimationCustomizator({
  title
}: Props) {
  const [upAnimationLimit, setUpAnimationLimit] = useState<boolean | null>(false);
  const [dowmAnimationLimit, setDownAnimationLimit] = useState<boolean | null>(false);

  let Animate = (isUp:boolean) => {

    if (isUp) {
      Sketch.EnginesAnimator.Animate(true)
      if (Sketch.EnginesAnimator.state >= Sketch.EnginesAnimator.maxStep) {
        setUpAnimationLimit(true);
      }else{ setDownAnimationLimit(false);}
    }else
    {
      Sketch.EnginesAnimator.Animate(false);
      if (Sketch.EnginesAnimator.state <= Sketch.EnginesAnimator.minStep) {
        setDownAnimationLimit(true);
      }else{ setUpAnimationLimit(false);}
    }
  }
  useEffect(() => {
    try {
      if (Sketch.EnginesAnimator.state >= Sketch.EnginesAnimator.maxStep) {
        setUpAnimationLimit(true);
      }
      if (Sketch.EnginesAnimator.state <= Sketch.EnginesAnimator.minStep) {
        setDownAnimationLimit(true);
      }
      
    } catch (error) {
      setDownAnimationLimit(true);
    }
    

  });

  return (
    <>
      <div className={style.directionButtonsSectionContainer}>
      {/* <span className={style.sectionTitle}>{title}</span> */}
      <div className={style.directionButtonsContainer}>
        <EnginesAnimationButtons IsUpDirection={true} limit={upAnimationLimit} OnAnimationRequested={Animate}></EnginesAnimationButtons>
        <EnginesAnimationButtons IsUpDirection={false} limit={dowmAnimationLimit} OnAnimationRequested={Animate}></EnginesAnimationButtons>
      </div>
      </div>
    </>
  );
}
