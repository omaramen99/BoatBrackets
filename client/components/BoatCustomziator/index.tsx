import { useEffect, useRef, useState } from "react";
import { Menu } from "react-feather";
import Sketch, { Config } from "./Sketch";


import EnginesAnimationCustomizator from "./UI/EnginesAnimationCustomizator"

import style from "./style.module.scss";
import StyleCustomizator from "./UI/StyleCustomizator";
import VisibilityCustomizator from "./UI/VisibilityCustomizator";

export interface BoatCustomizatorConfig {
  config: Config;
}
class CustomizationProps {
  public static HullType : string = "deeb_vee";
  public static TransomType : string = "full"; 
  public static SetBack : string = "211919";
  public static HullTypeString : string = "Deeb Vee";
  public static TransomTypeString : string = "Full"; 
  public static SetBackString : string = "211919"; 
}
export default function BoatCustomizator({ config }: BoatCustomizatorConfig) {
  const [activePlaceholder, setActivePlaceholder] = useState<string | null>(
    null
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<Sketch>();

  const [hullType, setHullType] = useState<string | null>("Deeb Vee");
  const [transomType, setTransomType] = useState<string | null>("Full");
  const [setBack, setSetBack] = useState<string | null>("211919");



  const [DeebVeeBtnClass, setDeebVeeBtnClass] = useState<string | null>("notDisabled");
  const [FlatBtnClass, setFlatBtnClass] = useState<string | null>("notDisabled");
  const [CatamaranBtnClass, setCatamaranBtnClass] = useState<string | null>("notDisabled");
  const [NotchedBtnClass, setNotchedBtnClass] = useState<string | null>("notDisabled");
  const [FullBtnClass, setFullBtnClass] = useState<string | null>("notDisabled");
  const [RubrailBtnClass, setRubrailBtnClass] = useState<string | null>("notDisabled");
  const [BtnClass171915, setBtnClass171915] = useState<string | null>("notDisabled");
  const [BtnClass211919, setBtnClass211919] = useState<string | null>("notDisabled");
  const [BtnClass211950, setBtnClass211950] = useState<string | null>("notDisabled");
  const [BtnClass261919, setBtnClass261919] = useState<string | null>("notDisabled");
  const [BtnClassR81618, setBtnClassR81618] = useState<string | null>("notDisabled");
  const [BtnClassR121922, setBtnClassR121922] = useState<string | null>("notDisabled");
  const [BtnClass171919, setBtnClass171919] = useState<string | null>("notDisabled");

  useEffect(() => {
    // const Sketch = require("./Sketch") as typeof _Sketch;
    const sketch = new Sketch(parentRef.current, config);
    /**
     * Update component state when any placeholder gets clicked
     */
    sketch.addEventListener("placeholderClick", ({ placeholderKey }) =>
      setActivePlaceholder(placeholderKey)
    );

    sketchRef.current = sketch;
    ActiveSetBackBtn("211919");
    ActiveTransomBtn("Full");
    ActiveHullBtn("Deeb Vee");

    return () => sketch.dispose();
  }, []);

  var ActivateAllBtns = () => 
  {
   if (DeebVeeBtnClass   !="active") setDeebVeeBtnClass("notDisabled");  
   if (FlatBtnClass      !="active") setFlatBtnClass("notDisabled");     
   if (CatamaranBtnClass !="active") setCatamaranBtnClass("notDisabled");
   if (NotchedBtnClass   !="active") setNotchedBtnClass("notDisabled");  
   if (FullBtnClass      !="active") setFullBtnClass("notDisabled");     
   if (RubrailBtnClass   !="active") setRubrailBtnClass("notDisabled");  
   if (BtnClass171915    !="active") setBtnClass171915("notDisabled");   
   if (BtnClass211919    !="active") setBtnClass211919("notDisabled");   
   if (BtnClass211950    !="active") setBtnClass211950("notDisabled");   
   if (BtnClass261919    !="active") setBtnClass261919("notDisabled");   
   if (BtnClassR81618    !="active") setBtnClassR81618("notDisabled");   
   if (BtnClassR121922   !="active") setBtnClassR121922("notDisabled");  
   if (BtnClass171919    !="active") setBtnClass171919("notDisabled");   
  } 
  var ActiveSetBackBtn = (btn) => 
  {
  
    setBtnClass171915("notDisabled");   
    setBtnClass211919("notDisabled");   
    setBtnClass211950("notDisabled");   
    setBtnClass261919("notDisabled");   
    setBtnClassR81618("notDisabled");   
    setBtnClassR121922("notDisabled");  
    setBtnClass171919("notDisabled");  
    
         if (btn == "171915")  {setBtnClass171915("active"); }
    else if (btn == "211919")  {setBtnClass211919("active"); }
    else if (btn == "211950")  {setBtnClass211950("active"); }
    else if (btn == "261919")  {setBtnClass261919("active"); }
    else if (btn == "R81618")  {setBtnClassR81618("active"); }
    else if (btn == "R121922"){setBtnClassR121922("active");}
    else if (btn == "171919")  {setBtnClass171919("active"); }
  }
  var ActiveTransomBtn = (btn) => 
  {
  
    setNotchedBtnClass("notDisabled");  
    setFullBtnClass("notDisabled");     
    setRubrailBtnClass("notDisabled");   
    
         if (btn == "Notched")  {setNotchedBtnClass("active"); }
    else if (btn == "Full")  {setFullBtnClass("active");    }
    else if (btn == "Rubrail")  {setRubrailBtnClass("active"); }

  }
  var ActiveHullBtn = (btn) => 
  {
  
    setDeebVeeBtnClass("notDisabled");  
    setFlatBtnClass("notDisabled");     
    setCatamaranBtnClass("notDisabled"); 
    
         if (btn == "Deeb Vee")  {setDeebVeeBtnClass("active");  }
    else if (btn == "Flat")     {setFlatBtnClass("active");     }
    else if (btn == "Catamaran")  {setCatamaranBtnClass("active");}

  }
  var DiactivateAllBtns = () => 
  {
    setDeebVeeBtnClass("disabled");  
    setFlatBtnClass("disabled");     
    setCatamaranBtnClass("disabled");
    setNotchedBtnClass("disabled");  
    setFullBtnClass("disabled");     
    setRubrailBtnClass("disabled");  
    setBtnClass171915("disabled");   
    setBtnClass211919("disabled");   
    setBtnClass211950("disabled");   
    setBtnClass261919("disabled");   
    setBtnClassR81618("disabled");   
    setBtnClassR121922("disabled");  
    setBtnClass171919("disabled");   
  } 
  var DiactivateAllSetBackBtns = () => 
  {

    setBtnClass171915("disabled");   
    setBtnClass211919("disabled");   
    setBtnClass211950("disabled");   
    setBtnClass261919("disabled");   
    setBtnClassR81618("disabled");   
    setBtnClassR121922("disabled");  
    setBtnClass171919("disabled");   
  } 
  var EditSetBack = () => 
  {
    ActivateAllBtns();
    //hullType
    //transomType
    //setBack
    if(hullType=="Deeb Vee"&&transomType=="Notched") {
      setBtnClass171919("disabled");
    }else if(hullType=="Deeb Vee"&&transomType=="Full")
    {
      setBtnClass171919("disabled");
    }else if(hullType=="Deeb Vee"&&transomType=="Rubrail")
    {
      setBtnClass171919("disabled");
    }else if(hullType=="Flat"&&transomType=="Notched")
    {
      setBtnClass171915("disabled");
    }else if(hullType=="Flat"&&transomType=="Full")
    {
      setBtnClass171915("disabled");
    }else if(hullType=="Flat"&&transomType=="Rubrail")
    {
      setBtnClass171915("disabled");
    }else if(hullType=="Catamaran"&&transomType=="Notched")
    {
      DiactivateAllSetBackBtns();
    }else if(hullType=="Catamaran"&&transomType=="Full")
    {
      setBtnClass211950('disabled');
      setBtnClass171919("disabled");
    }else if(hullType=="Catamaran"&&transomType=="Rubrail")
    {
      DiactivateAllSetBackBtns();
    }

  }

  var EditTransom = () => {

    ActivateAllBtns();
    //hullType
    //transomType
    //setBack
         if(hullType=="Deeb Vee"&&setBack=="171915"){

         }
    else if(hullType=="Deeb Vee"&&setBack=="211919"){

    }
    else if(hullType=="Deeb Vee"&&setBack=="211950"){

    }
    else if(hullType=="Deeb Vee"&&setBack=="261919"){

    }
    else if(hullType=="Deeb Vee"&&setBack=="R81618"){

    }
    else if(hullType=="Deeb Vee"&&setBack=="R121922"){

    }
    else if(hullType=="Deeb Vee"&&setBack=="171919"){
        setNotchedBtnClass("disabled");
        setRubrailBtnClass("disabled");
        setFullBtnClass("disabled");
    }
    else if(hullType=="Flat"&&setBack=="171915"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
      setFullBtnClass("disabled");
    }
    else if(hullType=="Flat"&&setBack=="211919"){

    }
    else if(hullType=="Flat"&&setBack=="211950"){

    }
    else if(hullType=="Flat"&&setBack=="261919"){

    }
    else if(hullType=="Flat"&&setBack=="R81618"){

    }
    else if(hullType=="Flat"&&setBack=="R121922"){

    }
    else if(hullType=="Flat"&&setBack=="171919"){

    }
    else if(hullType=="Catamaran"&&setBack=="171915"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
      
    }
    else if(hullType=="Catamaran"&&setBack=="211919"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
      
    }
    else if(hullType=="Catamaran"&&setBack=="211950"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
     
    }
    else if(hullType=="Catamaran"&&setBack=="261919"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
      
    }
    else if(hullType=="Catamaran"&&setBack=="R81618"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
      
    }
    else if(hullType=="Catamaran"&&setBack=="R121922"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
      
    }
    else if(hullType=="Catamaran"&&setBack=="171919"){
      setNotchedBtnClass("disabled");
      setRubrailBtnClass("disabled");
      
    }
  }

  var EditHull = () => {
    ActivateAllBtns();
    //hullType
    //transomType
    //setBack
              if(transomType=="Notched"&&setBack=="171915"){
                setCatamaranBtnClass("disabled");
                setFlatBtnClass("disabled");
              }
         else if(transomType=="Notched"&&setBack=="211919"){
                setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Notched"&&setBack=="211950"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Notched"&&setBack=="261919"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Notched"&&setBack=="R81618"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Notched"&&setBack=="R121922"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Notched"&&setBack=="171919"){
          setCatamaranBtnClass("disabled");
          setDeebVeeBtnClass("disabled");
         }
         else if(transomType=="Full"&&setBack=="171915"){
          setFlatBtnClass("disabled");
         }
         else if(transomType=="Full"&&setBack=="211919"){

         }
         else if(transomType=="Full"&&setBack=="211950"){
          setCatamaranBtnClass("disabled");
         }
         else if(transomType=="Full"&&setBack=="261919"){

         }
         else if(transomType=="Full"&&setBack=="R81618"){

         }
         else if(transomType=="Full"&&setBack=="R121922"){

         }
         else if(transomType=="Full"&&setBack=="171919"){
          setCatamaranBtnClass("disabled");
          setDeebVeeBtnClass("disabled");
         }
         else if(transomType=="Rubrail"&&setBack=="171915"){
          setCatamaranBtnClass("disabled");
          setFlatBtnClass("disabled");
         }
         else if(transomType=="Rubrail"&&setBack=="211919"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Rubrail"&&setBack=="211950"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Rubrail"&&setBack=="261919"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Rubrail"&&setBack=="R81618"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Rubrail"&&setBack=="R121922"){
          setCatamaranBtnClass("disabled");
                
         }
         else if(transomType=="Rubrail"&&setBack=="171919"){
          setCatamaranBtnClass("disabled");
          setDeebVeeBtnClass("disabled");
                
         }

 
  }
  var SetHull = (hullType,hullTypeString)=>
  {
    CustomizationProps.HullType = hullType;
    CustomizationProps.HullTypeString = hullTypeString;
    ActiveHullBtn(hullTypeString);
  }
  var SetTransom = (transomType,transomTypeString)=>
  {
    CustomizationProps.TransomType = transomType;
    CustomizationProps.TransomTypeString = transomTypeString;
    ActiveTransomBtn(transomTypeString);
  }
  var SetSetBack = (setBack,setBackString)=>
  {

    CustomizationProps.SetBack = setBack;
    CustomizationProps.SetBackString = setBackString;
    ActiveSetBackBtn(setBackString);
  }
  var UpdateBoat = ()=>
  {
    if (CustomizationProps.HullType == "catamaran" && CustomizationProps.TransomType == "full") {
      sketchRef.current?.boat.setVisibilityCustomizationOption_New([new RegExp(`${CustomizationProps.HullType}_${CustomizationProps.SetBack}`)])
      setHullType(CustomizationProps.HullTypeString);
      setTransomType(CustomizationProps.TransomTypeString);
      setSetBack(CustomizationProps.SetBackString);
    }else
    {
      sketchRef.current?.boat.setVisibilityCustomizationOption_New([new RegExp(`${CustomizationProps.HullType}_${CustomizationProps.TransomType}_${CustomizationProps.SetBack}`)])
      setHullType(CustomizationProps.HullTypeString);
      setTransomType(CustomizationProps.TransomTypeString);
      setSetBack(CustomizationProps.SetBackString);
    }
  }


  return (
<div className={style.PAGE}>

  {/* <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">Logo</a>
    </div>
  </nav> */}

  <div className={`container-fluid ${style.PageContainer}`}>

<div className={`${style.UiControlLayer} ${style.noselect}`}>
  <div className="container-fluid">
      <div className={`row ${style.navCont}`}>
        <div className={`col-9`}><span className={style.PageHeaderTytle}>Porta Bracket</span></div>
        <div className={`col-3`}><span className={style.PageHeaderHelpCont}><span className={style.PageHeaderHelp}>HELP</span><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg></span> </div>
      </div>
      <div className={`${style.HorzSep} row`}></div>
      <div className="row">
        <div className="col-4">
          <div className="row"><span className={style.BracketInfoTitle}>{setBack}</span></div>
          <div className="row">
            <div className="col-12">

            <div  className={style.BracketInfoLine}>Set-Back: 17"</div>
            </div>
            <div className="col-12">
            <div className={style.BracketInfoLine}>Vertical Lift: 12"</div>

            </div>
            <div className="col-12">

            <div className={style.BracketInfoLine}>Max HP: 300</div>
            </div>
            <div className="col-12">

            <div className={style.BracketInfoLine}>Required Width: 15"</div>
            </div>
            
            
            
            
          </div>
          </div>
        <div className="col-8">
          <div className={`row ${style.DropDownsContainer}`}>
            
            <div className={style.DropDownCont}>
            <div className={`${style.noselect} ${style.DropDowns} dropdown`}>
              <div className={`${style.dropDownContainer}  dropdown-toggle`}data-bs-toggle="dropdown" onClick={() => {EditHull()}}>
                <div className={style.dropDownHeader}>HULL TYPE</div>
                <div  className={`${style.dropDownTitle}`}><span className={style.dropDownTitleString}>{hullType}</span><span className={style.dropDownArrow}><i className={`fa-solid fa-chevron-down`}></i></span>
               </div>
              </div>
               <ul className="dropdown-menu">
            <li><a className={`${style.selectionButtonActive} dropdown-item ${DeebVeeBtnClass} ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetHull("deeb_vee","Deeb Vee"); UpdateBoat(); }}>Deeb Vee</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${FlatBtnClass     } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetHull("flat","Flat"); UpdateBoat(); }}>Flat</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${CatamaranBtnClass} ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetHull("catamaran","Catamaran"); UpdateBoat(); }}>Catamaran</a></li>
          </ul>
        </div>
      </div>
            
            
            <div className={style.DropDownCont}>
            <div className={`${style.noselect} ${style.DropDowns} dropdown`}>
              <div className={`${style.dropDownContainer}  dropdown-toggle`}data-bs-toggle="dropdown" onClick={() => {EditTransom()}}>
                <div className={style.dropDownHeader}>TRANSOM TYPE</div>
                <div  className={`${style.dropDownTitle}`}><span className={style.dropDownTitleString}>{transomType}</span><span className={style.dropDownArrow}><i className={`fa-solid fa-chevron-down`}></i></span>
               </div>
              </div>
               <ul className="dropdown-menu">
            <li><a className={`${style.selectionButtonActive} dropdown-item ${NotchedBtnClass  } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetTransom("notched","Notched"); UpdateBoat(); }}>Notched</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${FullBtnClass     } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetTransom("full","Full"); UpdateBoat(); }}>Full</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${RubrailBtnClass  } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetTransom("rubrail","Rubrail"); UpdateBoat(); }}>Rubrail</a></li>
          </ul>
        </div>
      </div> 
            
           
            <div className={style.DropDownCont}>
            <div className={`${style.noselect} ${style.DropDowns} dropdown`}>
              <div className={`${style.dropDownContainer}  dropdown-toggle`}data-bs-toggle="dropdown" onClick={()=>{EditSetBack()}}>
                <div className={style.dropDownHeader}>SET BACK</div>
                <div  className={`${style.dropDownTitle}`}><span className={style.dropDownTitleString}>{setBack}</span><span className={style.dropDownArrow}><i className={`fa-solid fa-chevron-down`}></i></span>
               </div>
              </div>
               <ul className="dropdown-menu">
            <li><a className={`${style.selectionButtonActive} dropdown-item ${BtnClass171915   } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetSetBack("171915","171915"); UpdateBoat(); }}>171915</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${BtnClass211919   } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault();   SetSetBack("211919","211919"); UpdateBoat(); }}>211919</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${BtnClass211950   } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetSetBack("211950","211950"); UpdateBoat(); }}>211950</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${BtnClass261919   } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetSetBack("261919","261919"); UpdateBoat(); }}>261919</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${BtnClassR81618   } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetSetBack("R81618","R81618"); UpdateBoat(); }}>R81618</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${BtnClassR121922  } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetSetBack("R121922","R121922"); UpdateBoat(); }}>R121922</a></li>
            <li><a className={`${style.selectionButtonActive} dropdown-item ${BtnClass171919   } ${style.dropdownItem}`} draggable="false" href="#" onClick={(e)=>{e.preventDefault(); SetSetBack("171919","171919"); UpdateBoat(); }}>171919</a></li> 

          </ul>
        </div>
      </div>
            
          </div>
        </div>
      </div>
      {/* <div className={style.test}>
        <EnginesAnimationCustomizator title={'Engine Pose'}/>
      </div> */}


  </div>

</div>



    <div className={style.canvasContainer} ref={parentRef}></div>

    <div className={style.boatCustomizationLayer}>


      {/* <div className={style.test}>
        <EnginesAnimationCustomizator title={'Engine Pose'}/>
      </div> */}
      
    </div>
  </div> 

</div>
    // <div className={style.container}>
    //   <div className={style.headerContainer}>
    //     <div className={style.headerTitle}>Company Name</div>
    //     <Menu className={style.headerIcon} />
    //   </div>
    //   <div className={style.canvasContainer} ref={parentRef}></div>
    //   {/**
    //    * Show Placeholder configuration
    //    */}
    //   {activePlaceholder && (
    //     <div className={style.customizationContainer}>
    //       <div className={style.customizationHeader}>
    //         <div
    //           className={style.title}
    //         >{`Edit ${config.customization[activePlaceholder].placeholderLabel}`}</div>
    //         <button>Done</button>
    //       </div>

    //       {/**
    //        * Show Visibility customizator if any
    //        */}
    //       {activePlaceholder &&
    //         config.customization[
    //           activePlaceholder
    //         ].visibilityCustomization?.map((customization, index) => (
    //           <VisibilityCustomizator
    //             key={index}
    //             customization={customization}
    //             /**
    //              * Update Boat with selected customization option
    //              */
    //             onSelect={(option) =>
    //               sketchRef.current?.boat.setVisibilityCustomizationOption( 
    //                 customization,
    //                 option
    //               )
    //             }
    //           />
    //         ))}
    ////////////////////
    //{activePlaceholder &&
    //  config.customization[
    //    activePlaceholder
    //  ].visibilityCustomization?.map((customization, index) => (
    //    <VisibilityCustomizator
    //      key={index}
    //      customization={customization}
    //      /**
    //       * Update Boat with selected customization option
    //       */
    //      onSelect={(option) =>
    //        sketchRef.current?.boat.setVisibilityCustomizationOption_New(
    //          option.targetParts
    //        )
    //      }
    //    />
    //  ))} 
    //       {/**
    //        * Show Style customizator if any
    //        */}
    //       {activePlaceholder &&
    //         config.customization[activePlaceholder].styleCustomization?.map(
    //           (customization, index) => (
    //             <StyleCustomizator
    //               key={index}
    //               customization={customization}
    //               /**
    //                * Update Boat with selected customization option option
    //                */
    //               onSelect={(option) =>
    //                 sketchRef.current?.boat.setStyleCustomizationOption(
    //                   customization,
    //                   option
    //                 )
    //               }
    //             />
    //           )
    //         )}


    //        {/**
    //        * Show Animation Buttons if the activePlaceholder is Engine
    //        */}
    //       {activePlaceholder == "placeholder_engine"? (<EnginesAnimationCustomizator title={'Engine Pose'}/>):("")}



    //     </div>
    //   )}
    // </div>
  );
}
