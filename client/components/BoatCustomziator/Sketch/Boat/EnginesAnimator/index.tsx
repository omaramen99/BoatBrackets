import * as THREE from "three";

export default class EnginesAnimator {

 public state :number;
 private scene : THREE.Scene;
 private stepsPerMotion : number;
 private stepAngle : number;
 private motionTime : number;
 private stepTime : number;
 public maxStep : number;
 public minStep : number;
 
 private EnginesNames : Array<string>;
 private A_LinkNames : Array<string>;
 private B_LinkNames : Array<string>;
 private P_LinkNames : Array<string>;
 private C_LinkNames : Array<string>;


 public anchorPoint : THREE.Vector3;
 //
 public A_anchorPoint : THREE.Vector3;
 public B_anchorPoint : THREE.Vector3;
 public C_anchorPoint : THREE.Vector3;
 public P_anchorPoint : THREE.Vector3;

  constructor(scene:THREE.Scene,A_LinkNames :Array<string>,B_LinkNames :Array<string>,P_LinkNames :Array<string>,C_LinkNames :Array<string>,EnginesNames :Array<string>,stepsPerMotion : number, motionTime:number,maxStep:number,minStep:number,motionAngle:number) {
    this.state = 0;
    this.scene = scene;
    this.stepsPerMotion = stepsPerMotion;
    this.stepAngle = motionAngle/stepsPerMotion;
    this.motionTime = motionTime;
    this.stepTime = this.motionTime/stepsPerMotion;
    this.maxStep = maxStep;
    this.minStep = minStep;
    this.A_LinkNames = A_LinkNames;
    this.B_LinkNames = B_LinkNames;
    this.P_LinkNames = P_LinkNames;
    this.C_LinkNames = C_LinkNames;
    this.EnginesNames = EnginesNames;
    // this.anchorPoint = new THREE.Vector3(-0.85,0.197,0);
    // this.A_anchorPoint = new THREE.Vector3(-0.85,0.194,0);
    this.anchorPoint = new THREE.Vector3(-0.825,0.2,0);
    this.A_anchorPoint = new THREE.Vector3(-0.825,0.19,0);
    // this.B_anchorPoint = new THREE.Vector3(-0.83,0.125,0);
    // this.P_anchorPoint = new THREE.Vector3(-0.83,0.125,0);
    this.B_anchorPoint = new THREE.Vector3(-0.8,0.11,0);
    this.P_anchorPoint = new THREE.Vector3(-0.8,0.11,0);
    this.C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
//-0.8,0.11,0
//-0.825,0.19,0
  }

  public Animate(up:boolean)
  {
    if (up) {
      this.UP();
    }else
    {
      this.DOWN();
    }
  }

  private UP()
  {
    
    if (this.state < this.maxStep) {
      this.state++;
      var c = 0;
      var animationLoop = window.setInterval(()=>{
        if (c<this.stepsPerMotion) {
        for (let i = 0; i < this.EnginesNames.length; i++) {

           var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
           var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
           var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
           var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
           var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
          if (this.EnginesNames[i].includes("flat")) {
            _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
            _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
            _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
            _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
            _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
            // _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
          }else if(this.EnginesNames[i].includes("vee"))
          {

            _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
            _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
            _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
            _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
            _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
            
          }else if(this.EnginesNames[i].includes("catamaran"))
          {

            _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
            _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
            _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
            _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
            _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
            
          }
          else
          {
            _anchorPoint  = this.anchorPoint ;
           _A_anchorPoint = this.A_anchorPoint;
           _B_anchorPoint = this.B_anchorPoint;
           _P_anchorPoint = this.P_anchorPoint;
           _C_anchorPoint = this.C_anchorPoint;
          }




          var part_Engine = this.scene.getObjectByName(this.EnginesNames[i]) as THREE.Mesh;
         // var partt_Engine = this.scene.getObjectByName("bracket_screws_C_Link") as THREE.Mesh;
         
          var partt_Engine = this.scene.getObjectByName(this.C_LinkNames[i]) as THREE.Mesh;

          var bbox = new THREE.Box3().setFromObject(partt_Engine);
          var bbox_center = new THREE.Vector3((bbox.max.x + bbox.min.x) / 2,(bbox.max.y + bbox.min.y) / 2,(bbox.max.z + bbox.min.z) / 2);
          this.RotateEngineAroundPoint(part_Engine,_C_anchorPoint,new THREE.Vector3(0,0,1),-this.stepAngle);
          this.RotateEngineAroundPoint(part_Engine,bbox_center,new THREE.Vector3(0,0,1),this.stepAngle);
          if (this.EnginesNames[i].includes("211950")) {
            var EngineClone = this.scene.getObjectByName(`${this.EnginesNames[i]}_001`) as THREE.Mesh;


            var partt_Engine = this.scene.getObjectByName(this.C_LinkNames[i]) as THREE.Mesh;

            var bbox = new THREE.Box3().setFromObject(partt_Engine);
            var bbox_center = new THREE.Vector3((bbox.max.x + bbox.min.x) / 2,(bbox.max.y + bbox.min.y) / 2,(bbox.max.z + bbox.min.z) / 2);
            this.RotateEngineAroundPoint(EngineClone,_C_anchorPoint,new THREE.Vector3(0,0,1),-this.stepAngle);
            this.RotateEngineAroundPoint(EngineClone,bbox_center,new THREE.Vector3(0,0,1),this.stepAngle);
          }
        }
        for (let i = 0; i < this.C_LinkNames.length; i++)
        {

          var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
          var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
          var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         if (this.C_LinkNames[i].includes("flat")) {
          _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
          _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
          _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
          _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
           _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
           //_C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.C_LinkNames[i].includes("vee"))
         {
           _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
           _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
           _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
           //_C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.C_LinkNames[i].includes("catamaran"))
         {

           _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
           _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
           _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
           
         }else
         {
           _anchorPoint  = this.anchorPoint ;
          _A_anchorPoint = this.A_anchorPoint;
          _B_anchorPoint = this.B_anchorPoint;
          _P_anchorPoint = this.P_anchorPoint;
          _C_anchorPoint = this.C_anchorPoint;
         }






        var part_Engine = this.scene.getObjectByName(this.C_LinkNames[i]) as THREE.Mesh;
        //console.log(part_Engine);
        var bbox = new THREE.Box3().setFromObject(part_Engine);
        var bbox_center = new THREE.Vector3((bbox.max.x + bbox.min.x) / 2,(bbox.max.y + bbox.min.y) / 2,(bbox.max.z + bbox.min.z) / 2);
        this.RotateEngineAroundPoint(part_Engine,_C_anchorPoint,new THREE.Vector3(0,0,1),-this.stepAngle);
        this.RotateEngineAroundPoint(part_Engine,bbox_center,new THREE.Vector3(0,0,1),this.stepAngle);
        }
        for (let i = 0; i < this.A_LinkNames.length; i++) {

          var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
          var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
          var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         if (this.A_LinkNames[i].includes("flat")) {
          _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
          _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
          _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
          _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
           _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.A_LinkNames[i].includes("vee"))
         {
           _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
           _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
           _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.A_LinkNames[i].includes("catamaran"))
         {

           _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
           _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
           _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
           
         }else
         {
           _anchorPoint  = this.anchorPoint ;
          _A_anchorPoint = this.A_anchorPoint;
          _B_anchorPoint = this.B_anchorPoint;
          _P_anchorPoint = this.P_anchorPoint;
          _C_anchorPoint = this.C_anchorPoint;
         }



          var part_Engine = this.scene.getObjectByName(this.A_LinkNames[i]) as THREE.Mesh;
          this.RotateEngineAroundPoint(part_Engine,_A_anchorPoint,new THREE.Vector3(0,0,1),-this.stepAngle);
        }
        for (let i = 0; i < this.B_LinkNames.length; i++) {



          var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
          var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
          var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         if (this.B_LinkNames[i].includes("flat")) {
          _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
          _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
          _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
          _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
           _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.B_LinkNames[i].includes("vee"))
         {
           _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
           _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
           _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.B_LinkNames[i].includes("catamaran"))
         {

           _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
           _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
           _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
           
         }else
         {
           _anchorPoint  = this.anchorPoint ;
          _A_anchorPoint = this.A_anchorPoint;
          _B_anchorPoint = this.B_anchorPoint;
          _P_anchorPoint = this.P_anchorPoint;
          _C_anchorPoint = this.C_anchorPoint;
         }
          var part_Engine = this.scene.getObjectByName(this.B_LinkNames[i]) as THREE.Mesh;
          this.RotateEngineAroundPoint(part_Engine,_B_anchorPoint,new THREE.Vector3(0,0,1),-this.stepAngle);
        }
        for (let i = 0; i < this.P_LinkNames.length; i++) {

          var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
          var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
          var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
          var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         if (this.P_LinkNames[i].includes("flat")) {
          _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
          _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
          _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
          _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
           _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.P_LinkNames[i].includes("vee"))
         {
           _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
           _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
           _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
           _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
         }else if(this.P_LinkNames[i].includes("catamaran"))
         {

           _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
           _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
           _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
           _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
           
         }else
         {
           _anchorPoint  = this.anchorPoint ;
          _A_anchorPoint = this.A_anchorPoint;
          _B_anchorPoint = this.B_anchorPoint;
          _P_anchorPoint = this.P_anchorPoint;
          _C_anchorPoint = this.C_anchorPoint;
         }
          var part_Engine = this.scene.getObjectByName(this.P_LinkNames[i]) as THREE.Mesh;
          this.RotateEngineAroundPoint(part_Engine,_P_anchorPoint,new THREE.Vector3(0,0,1),-this.stepAngle*0.6);
        }
        
          c++;
        }else
        {
          window.clearInterval(animationLoop);
        }

      },this.stepTime);
    }
  }
  private DOWN()
  {
    
    if (this.state > this.minStep) {
      this.state--;
      var c = 0;
      var animationLoop = window.setInterval(()=>{
        if (c<this.stepsPerMotion) {

          for (let i = 0; i < this.EnginesNames.length; i++) {
            var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
            var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
            var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           if (this.EnginesNames[i].includes("flat")) {
            _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
            _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
            _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
            _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             // _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("vee"))
           {
             _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
             _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
             _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             // _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("catamaran"))
           {
 
             _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
             _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
             _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             
           }else
           {
             _anchorPoint  = this.anchorPoint ;
            _A_anchorPoint = this.A_anchorPoint;
            _B_anchorPoint = this.B_anchorPoint;
            _P_anchorPoint = this.P_anchorPoint;
            _C_anchorPoint = this.C_anchorPoint;
           }
            var part_Engine = this.scene.getObjectByName(this.EnginesNames[i]) as THREE.Mesh;
            //var partt_Engine = this.scene.getObjectByName("bracket_screws_C_Link") as THREE.Mesh;
            var partt_Engine = this.scene.getObjectByName(this.C_LinkNames[i]) as THREE.Mesh;
            var bbox = new THREE.Box3().setFromObject(partt_Engine);
            var bbox_center = new THREE.Vector3((bbox.max.x + bbox.min.x) / 2,(bbox.max.y + bbox.min.y) / 2,(bbox.max.z + bbox.min.z) / 2);
            this.RotateEngineAroundPoint(part_Engine,_C_anchorPoint,new THREE.Vector3(0,0,1),this.stepAngle);
            this.RotateEngineAroundPoint(part_Engine,bbox_center,new THREE.Vector3(0,0,1),-this.stepAngle);


            if (this.EnginesNames[i].includes("211950")) {
              var EngineClone = this.scene.getObjectByName(`${this.EnginesNames[i]}_001`) as THREE.Mesh;
  
  
              var partt_Engine = this.scene.getObjectByName(this.C_LinkNames[i]) as THREE.Mesh;
  
              var bbox = new THREE.Box3().setFromObject(partt_Engine);
              var bbox_center = new THREE.Vector3((bbox.max.x + bbox.min.x) / 2,(bbox.max.y + bbox.min.y) / 2,(bbox.max.z + bbox.min.z) / 2);
              this.RotateEngineAroundPoint(EngineClone,_C_anchorPoint,new THREE.Vector3(0,0,1),this.stepAngle);
              this.RotateEngineAroundPoint(EngineClone,bbox_center,new THREE.Vector3(0,0,1),-this.stepAngle);
            }
          }
          for (let i = 0; i < this.C_LinkNames.length; i++)
          {
            var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
            var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
            var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
          
          
            if (this.EnginesNames[i].includes("flat")) {
              _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
              _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
              _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
              _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             // _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("vee"))
           {
             _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
             _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
             _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("catamaran"))
           {
 
             _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
             _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
             _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             
           }else
           {
             _anchorPoint  = this.anchorPoint ;
            _A_anchorPoint = this.A_anchorPoint;
            _B_anchorPoint = this.B_anchorPoint;
            _P_anchorPoint = this.P_anchorPoint;
            _C_anchorPoint = this.C_anchorPoint;
           }
          var part_Engine = this.scene.getObjectByName(this.C_LinkNames[i]) as THREE.Mesh;
          //console.log(part_Engine);
          var bbox = new THREE.Box3().setFromObject(part_Engine);
          var bbox_center = new THREE.Vector3((bbox.max.x + bbox.min.x) / 2,(bbox.max.y + bbox.min.y) / 2,(bbox.max.z + bbox.min.z) / 2);
          this.RotateEngineAroundPoint(part_Engine,_C_anchorPoint,new THREE.Vector3(0,0,1),this.stepAngle);
          this.RotateEngineAroundPoint(part_Engine,bbox_center,new THREE.Vector3(0,0,1),-this.stepAngle);
          }
          for (let i = 0; i < this.A_LinkNames.length; i++) {
            var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
            var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
            var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           if (this.EnginesNames[i].includes("flat")) {
            _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
            _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
            _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
            _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
             _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("vee"))
           {
             _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
             _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
             _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("catamaran"))
           {
 
             _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
             _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
             _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             
           }else
           {
             _anchorPoint  = this.anchorPoint ;
            _A_anchorPoint = this.A_anchorPoint;
            _B_anchorPoint = this.B_anchorPoint;
            _P_anchorPoint = this.P_anchorPoint;
            _C_anchorPoint = this.C_anchorPoint;
           }
            var part_Engine = this.scene.getObjectByName(this.A_LinkNames[i]) as THREE.Mesh;
            this.RotateEngineAroundPoint(part_Engine,_A_anchorPoint,new THREE.Vector3(0,0,1),this.stepAngle);
          }
          for (let i = 0; i < this.B_LinkNames.length; i++) {
            var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
            var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
            var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           if (this.EnginesNames[i].includes("flat")) {
            _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
            _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
            _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
            _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
             _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("vee"))
           {
             _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
             _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
             _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.EnginesNames[i].includes("catamaran"))
           {
 
             _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
             _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
             _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             
           }else
           {
             _anchorPoint  = this.anchorPoint ;
            _A_anchorPoint = this.A_anchorPoint;
            _B_anchorPoint = this.B_anchorPoint;
            _P_anchorPoint = this.P_anchorPoint;
            _C_anchorPoint = this.C_anchorPoint;
           }
            var part_Engine = this.scene.getObjectByName(this.B_LinkNames[i]) as THREE.Mesh;
            this.RotateEngineAroundPoint(part_Engine,_B_anchorPoint,new THREE.Vector3(0,0,1),this.stepAngle);
          }
          for (let i = 0; i < this.P_LinkNames.length; i++) {
            var _anchorPoint   ;//= new THREE.Vector3(-0.825,0.2,0);
            var _A_anchorPoint ;//= new THREE.Vector3(-0.825,0.19,0);
            var _B_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _P_anchorPoint ;//= new THREE.Vector3(-0.8,0.11,0);
            var _C_anchorPoint ;//= new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           if (this.P_LinkNames[i].includes("flat")) {
            _anchorPoint   = new THREE.Vector3(-0.680,0.21,0);
            _A_anchorPoint = new THREE.Vector3(-0.680,0.19,0);
            _B_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
            _P_anchorPoint = new THREE.Vector3(-0.67,0.14,0);
             _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.P_LinkNames[i].includes("vee"))
           {
             _anchorPoint   = new THREE.Vector3(-0.670,0.22,0);
             _A_anchorPoint = new THREE.Vector3(-0.69,0.2,0);
             _B_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _P_anchorPoint = new THREE.Vector3(-0.69,0.14,0);
             _C_anchorPoint = new THREE.Vector3((this.A_anchorPoint.x + this.B_anchorPoint.x)/2,(this.A_anchorPoint.y + this.B_anchorPoint.y)/2,(this.A_anchorPoint.z + this.B_anchorPoint.z)/2);
           }else if(this.P_LinkNames[i].includes("catamaran"))
           {
 
             _anchorPoint   = new THREE.Vector3(-0.680,0.18,0);
             _A_anchorPoint = new THREE.Vector3(-0.68,0.16,0);
             _B_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _P_anchorPoint = new THREE.Vector3(-0.68,0.09,0);
             _C_anchorPoint = new THREE.Vector3((_A_anchorPoint.x + _B_anchorPoint.x)/2,(_A_anchorPoint.y + _B_anchorPoint.y)/2,(_A_anchorPoint.z + _B_anchorPoint.z)/2);
             
           }else
           {
             _anchorPoint  = this.anchorPoint ;
            _A_anchorPoint = this.A_anchorPoint;
            _B_anchorPoint = this.B_anchorPoint;
            _P_anchorPoint = this.P_anchorPoint;
            _C_anchorPoint = this.C_anchorPoint;
           }
            var part_Engine = this.scene.getObjectByName(this.P_LinkNames[i]) as THREE.Mesh;
            this.RotateEngineAroundPoint(part_Engine,_P_anchorPoint,new THREE.Vector3(0,0,1),this.stepAngle * 0.6);
          }
          
          c++;
        }else
        {
          window.clearInterval(animationLoop);
        }

      },this.stepTime);
    }
  }
  private RotateEngineAroundPoint(part_Engine, rotationPoint:THREE.Vector3, rotationAxis:THREE.Vector3, angle:number){
      const theta = 0.0174532925 * angle ;
      part_Engine.parent.localToWorld(part_Engine.position);
      part_Engine.position.sub(rotationPoint);
      part_Engine.position.applyAxisAngle(rotationAxis, theta);
      part_Engine.position.add(rotationPoint);
      part_Engine.parent.worldToLocal(part_Engine.position);
      part_Engine.rotateOnAxis(rotationAxis, theta);

}


}