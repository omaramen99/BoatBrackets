import * as THREE from "three";
import { GLTF, GLTFLoader } from "./GLTFLoader";


import { CSS2DRenderer } from "@three/renderers/CSS2DRenderer";
import { EXRLoader } from "@three/loaders/EXRLoader";
import JSZip from "jszip";
import ZipLoader from 'zip-loader';
import EnginesAnimator from "./Boat/EnginesAnimator"


import Boat, { BoatTextures, CustomizationConfig } from "./Boat";
import Camera from "./Camera";
import Sea from "./Sea";
import { Utils } from "./Utils";
import Sky from "./Sky";

export interface Config extends CustomizationConfig {
  /** Path to Boat model */
  modelPath: string;
  /**
   * Path to Texture with channels matching following:
   * `r` - Ambient occlusion
   * `g` - roughness
   * `b` - metalness
   */
  occlusionRoughnessMetallicMapPath: string;
  /**
   * Path to base color Texture
   */
  mapPath: string;
  /**
   * Path Env map in .exr format
   */
  envMapPath: string;
  metallnessMapPath : string;
}

export default class Sketch extends THREE.Scene {
//metallnessMapPath
  public static EnginesAnimator :EnginesAnimator;

  camera: Camera;
  renderer: THREE.WebGLRenderer;
  loadingManager: THREE.LoadingManager;

  GLTFLoader: GLTFLoader;
  TextureLoader: THREE.TextureLoader;
  boat: Boat;
  sea: Sea;
  Textures: Utils.Cache<THREE.Texture>;
  GLTFs: Utils.Cache<GLTF>;
  EXRLoader: EXRLoader;
  PMREMGenerator: THREE.PMREMGenerator;
  CSS2DRenderer: CSS2DRenderer;
  sky: Sky;

  constructor(
    private readonly parentElement: HTMLElement,
    private config: Config
  ) {
    super();

    /**
     * Create Camera
     */
    this.camera = new Camera(
      40,
      this.parentElement.offsetWidth / this.parentElement.offsetHeight,
      this.parentElement
    );

    /**
     * Create Anchor point helper
     */
    const geometry = new THREE.SphereGeometry( 0.005 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 ,
      side:THREE.DoubleSide,
    transparent:true,
    opacity:0,
    } );
		material.depthTest = false;
		material.depthWrite = false;
    
    const sphere = new THREE.Mesh( geometry, material );
    sphere.renderOrder = 99999997;
    sphere.position.set(-0.680,0.2,0)
    this.add( sphere );



    /**
     * Create WebGL renderer 
     */
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.renderer.toneMapping = THREE.CineonToneMapping;

    this.renderer.physicallyCorrectLights = true;
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setClearColor(0xffffff);
    this.parentElement.appendChild(this.renderer.domElement);
    const bracketPartName = "bracket_211920_";//`${bracketPartName}`
    const bracketScrewName = "bracket_screws_";//`${bracketScrewName}`
    var Animator = new EnginesAnimator(this,
      ["bracket_R121922_5_flat_notched_R121922","bracket_R81618_4_flat_notched_R81618","bracket_261919_4_flat_notched_261919","bracket_211950_3_flat_notched_211950","bracket_211920_6_flat_notched_211919","bracket_171919_5_flat_notched_171919",`bracket_171919_5_flat_rubrail_171919`,"bracket_211920_6_flat_rubrail_211919","bracket_211950_3_flat_rubrail_211950","bracket_261919_4_flat_rubrail_261919","bracket_R81618_4_flat_rubrail_R81618","bracket_R121922_5_flat_rubrail_R121922","bracket_171919_5_flat_full_171919","bracket_211920_6_flat_full_211919","bracket_211950_3_flat_full_211950","bracket_261919_4_flat_full_261919","bracket_R81618_4_flat_full_R81618","bracket_R121922_5_flat_full_R121922","bracket_171919_5001_deeb_vee_notched_171915","bracket_211920_6001_deeb_vee_notched_211919","bracket_211950_3002_deeb_vee_notched_211950","bracket_261919_4002_deeb_vee_notched_261919","bracket_R81618_4002_deeb_vee_notched_R81618","bracket_R121922_5002_deeb_vee_notched_R121922","bracket_171919_5_catamaran_171915","bracket_171919_6_catamaran_171915","bracket_211920_13_catamaran_211919","bracket_211920_6_catamaran_211919","bracket_261919_7_catamaran_261919","bracket_261919_4001_catamaran_261919","bracket_R81618_4001_catamaran_R81618","bracket_R81618_9_catamaran_R81618","bracket_R121922_5001_catamaran_R121922","bracket_R121922_9_catamaran_R121922","bracket_171919_5_deeb_vee_full_171915","bracket_211920_6_deeb_vee_full_211919","bracket_211950_3_deeb_vee_full_211950","bracket_261919_4_deeb_vee_full_261919","bracket_R81618_4_deeb_vee_full_R81618","bracket_R121922_5_deeb_vee_full_R121922","bracket_171919_5_deeb_vee_rubrail_171915","bracket_211920_6_deeb_vee_rubrail_211919","bracket_211950_3_deeb_vee_rubrail_211950","bracket_261919_4_deeb_vee_rubrail_261919","bracket_R81618_4_deeb_vee_rubrail_R81618","bracket_R121922_5_deeb_vee_rubrail_R121922"],
      ["bracket_R121922_1_flat_notched_R121922","bracket_R81618_5_flat_notched_R81618","bracket_261919_5_flat_notched_261919","bracket_211950_4_flat_notched_211950","bracket_211920_7_flat_notched_211919","bracket_171919_4_flat_notched_171919",`bracket_171919_4_flat_rubrail_171919`,"bracket_211920_7_flat_rubrail_211919","bracket_211950_4_flat_rubrail_211950","bracket_261919_5_flat_rubrail_261919","bracket_R81618_5_flat_rubrail_R81618","bracket_R121922_1_flat_rubrail_R121922","bracket_171919_4_flat_full_171919","bracket_211920_7_flat_full_211919","bracket_211950_4_flat_full_211950","bracket_261919_5_flat_full_261919","bracket_R81618_5_flat_full_R81618","bracket_R121922_1_flat_full_R121922","bracket_171919_4001_deeb_vee_notched_171915","bracket_211920_7001_deeb_vee_notched_211919","bracket_211950_4002_deeb_vee_notched_211950","bracket_261919_5002_deeb_vee_notched_261919","bracket_R81618_5002_deeb_vee_notched_R81618","bracket_R121922_1003_deeb_vee_notched_R121922","bracket_171919_4_catamaran_171915","bracket_171919_7_catamaran_171915","bracket_211920_12_catamaran_211919","bracket_211920_7_catamaran_211919","bracket_261919_6_catamaran_261919","bracket_261919_5001_catamaran_261919","bracket_R81618_5001_catamaran_R81618","bracket_R81618_8_catamaran_R81618","bracket_R121922_1_catamaran_R121922","bracket_R121922_8_catamaran_R121922","bracket_171919_4_deeb_vee_full_171915","bracket_211920_7_deeb_vee_full_211919","bracket_211950_4_deeb_vee_full_211950","bracket_261919_5_deeb_vee_full_261919","bracket_R81618_5_deeb_vee_full_R81618","bracket_R121922_1_deeb_vee_full_R121922","bracket_171919_4_deeb_vee_rubrail_171915","bracket_211920_7_deeb_vee_rubrail_211919","bracket_211950_4_deeb_vee_rubrail_211950","bracket_261919_5_deeb_vee_rubrail_261919","bracket_R81618_5_deeb_vee_rubrail_R81618","bracket_R121922_1_deeb_vee_rubrail_R121922"],
      ["bracket_R121922_piston2_flat_notched_R121922","bracket_R81618_piston2_flat_notched_R81618","bracket_261919_5_flat_notched_261919","bracket_211950_piston1_2_flat_notched_211950","bracket_211950_piston2_2_flat_notched_211950","bracket_211920_8_flat_notched_211919","bracket_171919_piston2_flat_notched_171919",`bracket_171919_screws_27_flat_rubrail_171919`,"bracket_211920_piston2_flat_rubrail_211919","bracket_211950_piston2_flat_rubrail_211950","bracket_211950_piston1_flat_rubrail_211950","bracket_261919_piston2_flat_rubrail_261919","bracket_R81618_piston2_flat_rubrail_R81618","bracket_R121922_piston2_flat_rubrail_R121922","bracket_171919_screws_27_flat_full_171919","bracket_211920_piston2_flat_full_211919","bracket_211950_piston1_flat_full_211950","bracket_211950_piston2_flat_full_211950","bracket_261919_piston2_flat_full_261919","bracket_R81618_piston2_flat_full_R81618","bracket_R121922_piston2_flat_full_R121922","bracket_171919_piston2001_deeb_vee_notched_171915","bracket_211920_piston2001_deeb_vee_notched_211919","bracket_211950_piston2_2002_deeb_vee_notched_211950","bracket_211950_piston1_2002_deeb_vee_notched_211950","bracket_261919_piston2002_deeb_vee_notched_261919","bracket_R81618_piston2002_deeb_vee_notched_R81618","bracket_R121922_piston2002_deeb_vee_notched_R121922","bracket_171919_piston2_catamaran_171915","bracket_171919_piston3_catamaran_171915","bracket_211920_piston3_catamaran_211919","bracket_211920_piston2_catamaran_211919","bracket_261919_piston3_catamaran_261919","bracket_261919_piston2001_catamaran_261919","bracket_R81618_piston2001_catamaran_R81618","bracket_R81618_piston3_catamaran_R81618","bracket_R121922_piston2001_catamaran_R121922","bracket_R121922_piston3_catamaran_R121922","bracket_171919_piston2_deeb_vee_full_171915","bracket_211920_piston2_deeb_vee_full_211919","bracket_211950_piston2_2_deeb_vee_full_211950","bracket_211950_piston1_2_deeb_vee_full_211950","bracket_261919_piston2_deeb_vee_full_261919","bracket_R81618_piston2_deeb_vee_full_R81618","bracket_R121922_piston2_deeb_vee_full_R121922","bracket_171919_piston2_deeb_vee_rubrail_171915","bracket_211920_piston2_deeb_vee_rubrail_211919","bracket_211950_piston2_2_deeb_vee_rubrail_211950","bracket_211950_piston1_2_deeb_vee_rubrail_211950","bracket_261919_piston2_deeb_vee_rubrail_261919","bracket_R81618_piston2_deeb_vee_rubrail_R81618","bracket_R121922_piston2_deeb_vee_rubrail_R121922"],
      ["bracket_R121922_4_flat_notched_R121922","bracket_R81618_3_flat_notched_R81618","bracket_261919_1_flat_notched_261919","bracket_211950_1_flat_notched_211950","bracket_211920_5_flat_notched_211919","bracket_171919_1_flat_notched_171919",`bracket_171919_caps_8_flat_rubrail_171919`,"bracket_211920_5_flat_rubrail_211919","bracket_211950_flat_rubrail_211950","bracket_261919_1_flat_rubrail_261919","bracket_R81618_3_flat_rubrail_R81618","bracket_R121922_4_flat_rubrail_R121922","bracket_171919_caps_8_flat_full_171919","bracket_211920_5_flat_full_211919","bracket_211950_flat_full_211950","bracket_261919_1_flat_full_261919","bracket_R81618_3_flat_full_R81618","bracket_R121922_4_flat_full_R121922","bracket_171919_1001_deeb_vee_notched_171915","bracket_211920_5001_deeb_vee_notched_211919","bracket_211950_1003_deeb_vee_notched_211950","bracket_261919_1003_deeb_vee_notched_261919","bracket_R81618_3002_deeb_vee_notched_R81618","bracket_R121922_4002_deeb_vee_notched_R121922","bracket_171919_1_catamaran_171915","bracket_171919_9_catamaran_171915","bracket_211920_14_catamaran_211919","bracket_211920_5_catamaran_211919","bracket_261919_10_catamaran_261919","bracket_261919_1_catamaran_261919","bracket_R81618_3001_catamaran_R81618","bracket_R81618_10_catamaran_R81618","bracket_R121922_4001_catamaran_R121922","bracket_R121922_10_catamaran_R121922","bracket_171919_1_deeb_vee_full_171915","bracket_211920_5_deeb_vee_full_211919","bracket_211950_1_deeb_vee_full_211950","bracket_261919_1_deeb_vee_full_261919","bracket_R81618_3_deeb_vee_full_R81618","bracket_R121922_4_deeb_vee_full_R121922","bracket_171919_1_deeb_vee_rubrail_171915","bracket_211920_5_deeb_vee_rubrail_211919","bracket_211950_1_deeb_vee_rubrail_211950","bracket_261919_1_deeb_vee_rubrail_261919","bracket_R81618_3_deeb_vee_rubrail_R81618","bracket_R121922_4_deeb_vee_rubrail_R121922"],
      ["single_engine_flat_notched_R121922","single_engine_flat_notched_R81618","single_engine_flat_notched_261919","single_engine_flat_notched_211950","single_engine_flat_notched_211919","single_engine_flat_notched_171919","single_engine_flat_rubrail_171919","single_engine_flat_rubrail_211919","single_engine_flat_rubrail_211950","single_engine_flat_rubrail_261919","single_engine_flat_rubrail_R81618","single_engine_flat_rubrail_R121922","single_engine_flat_full_171919","single_engine_flat_full_211919","single_engine_flat_full_211950","single_engine_flat_full_261919","single_engine_flat_full_R81618","single_engine_flat_full_R121922","single_engine_deeb_vee_notched_171915","single_engine_deeb_vee_notched_211919","single_engine_deeb_vee_notched_211950","single_engine_deeb_vee_notched_261919","single_engine_deeb_vee_notched_R81618","single_engine_deeb_vee_notched_R121922","single_engine_catamaran_171915","single_engine_catamaran_171915_001","single_engine_catamaran_211919_001","single_engine_catamaran_211919","single_engine_catamaran_261919","single_engine_catamaran_261919_001","single_engine_catamaran_R81618_001","single_engine_catamaran_R81618","single_engine_catamaran_R121922_001","single_engine_catamaran_R121922","single_engine_deeb_vee_full_171915","single_engine_deeb_vee_full_211919","single_engine_deeb_vee_full_211950","single_engine_deeb_vee_full_261919","single_engine_deeb_vee_full_R81618","single_engine_deeb_vee_full_R121922","single_engine_deeb_vee_rubrail_171915","single_engine_deeb_vee_rubrail_211919","single_engine_deeb_vee_rubrail_211950","single_engine_deeb_vee_rubrail_261919","single_engine_deeb_vee_rubrail_R81618","single_engine_deeb_vee_rubrail_R121922"],
      50,1000,2,0,15);
    Sketch.EnginesAnimator = Animator; 


    /**
     * Create CSS2Drenderer for labels
     */
    this.CSS2DRenderer = new CSS2DRenderer({});
    this.parentElement.appendChild(this.CSS2DRenderer.domElement);

    /**
     * Create Loading Manager
     */
    this.loadingManager = new THREE.LoadingManager();

    /**
     * Create Loaders
     */
    this.GLTFLoader = new GLTFLoader(this.loadingManager);
    this.TextureLoader = new THREE.TextureLoader(this.loadingManager);
    this.EXRLoader = new EXRLoader(this.loadingManager);

    /**
     * Create PMREMGenerator for decoding .exr texture
     */
    this.PMREMGenerator = new THREE.PMREMGenerator(this.renderer);
    this.PMREMGenerator.compileEquirectangularShader();

    /**
     * Create Caches for storing textures and models
     */
    this.GLTFs = new Utils.Cache();
    this.Textures = new Utils.Cache();

    /**
     * Define Sketch run steps
     */
    this.preload().then(() => {
      this.create();
      this.handleResize();
      this.renderer.setAnimationLoop(this.update.bind(this));
    });
    /**
     * Add Listeners
     */
    window.addEventListener("resize", this.handleResize);
  }
   rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
  async preload() {


    var loader = new ZipLoader( './boat.zip' );
  
    loader.on( 'progress', function ( event ) {
     
      console.log( 'loading', event.loaded, event.total );
     
    } );
     
    loader.on( 'load', ( event ) => {
     
      console.log( 'loaded!' );
      console.log( loader.files );
      var LoadingManager = new THREE.LoadingManager();
      var GLTFLoaderr = new GLTFLoader(LoadingManager);
      GLTFLoaderr.parse(loader.files["boat.glb"].buffer.buffer ,'', (gltf) =>{
        this.GLTFs.set("boat", gltf)
      },(e)=>{console.log(e);
      }
      );
      
    } );
     
    await loader.load();

 
    // JSZip.loadAsync($file).then(function($content) {
    //   // if you return a promise in a "then", you will chain the two promises
    //   return $content.files["css/style.css"].async('text');
    //  }).then(function (txt) {
    //    alert(txt);
    //  });

    var ff = () =>
    {
      var LoadingManager = new THREE.LoadingManager();
      var GLTFLoaderr = new GLTFLoader(LoadingManager);
      GLTFLoaderr.parse(loader.files["boat.glb"].buffer.buffer ,'', (gltf) =>{
        this.GLTFs.set("boat", gltf)
      },(e)=>{console.log(e);
      }
      );
    }

    /**
     * Load Model
     */
    ////  this.GLTFLoader.load(this.config.modelPath, (gltf) =>{
    //// // this.GLTFs.set("boat", gltf)
    ////}
    ////);

    /**
     * Load Textures
     */
    this.TextureLoader.load(
      this.config.occlusionRoughnessMetallicMapPath,
      (texture) => this.Textures.set("occlusionRoughnessMetallicMap", texture)
    );
    this.TextureLoader.load(
      this.config.metallnessMapPath,
      (texture) => this.Textures.set("metallnessMapPath", texture)
    );


    this.TextureLoader.load(this.config.mapPath, (texture) =>
{
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
					//texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      this.Textures.set("map", texture)
}
    );
    this.EXRLoader.load(this.config.envMapPath, (texture) => {
      const cubeRenderTarget = this.PMREMGenerator.fromEquirectangular(texture);
      this.Textures.set("envMap", cubeRenderTarget.texture);
      texture.dispose();
    });

    /**
     * Wait Untill Everything is loaded
     */
    return new Promise<void>(
      (onLoad) =>
        (this.loadingManager.onLoad = () => {
          this.PMREMGenerator.dispose();
          onLoad();
        })
    );
  }

  create() {
    /**
     * Create Lights
     */
    // const pointLight = new THREE.PointLight(0xffffff, 0.02, 0);
    // pointLight.position.set(-0.5,1, 0);
    // this.add(pointLight);






    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 1, 0 );
    
    //spotLight.castShadow = true;
    
    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;
    
    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    // spotLight.shadow.camera.fov = 30;
    
    this.add( spotLight );








    /**
     * Set Env Map
     */
    this.environment = this.Textures.get("envMap");

    /**
     * Create Boat
     */
    this.boat = new Boat(
      this.GLTFs.get("boat"),
      {
        occlusionRoughnessMetallicMap: this.Textures.get(
          "occlusionRoughnessMetallicMap"
        ),
        map: this.Textures.get("map"),
        metallnessMapPath: this.Textures.get("metallnessMapPath"),
      },
      this.config
    );
    this.add(this.boat);

    /**
     * Update camera according to boat
     */
    this.camera.adjustToPoint(new THREE.Vector3(-0.680,0.2,0),this.boat);

    /**
     * Emit global click event on placeholder click
     */
    this.boat.addEventListener("placeholderClick", ({ placeholderKey }) =>
      this.dispatchEvent({ type: "placeholderClick", placeholderKey })
    
    );

    /**
     * Create Sea
     */
    this.sea = new Sea(6);
    this.add(this.sea);

    /**
     * Create Sky
     */
    this.sky = new Sky(this.camera);
    this.add(this.sky);
  }

  /**
   * Update stuff
   */
  update(time: number) {
    this.camera.update(this.boat);
    this.sea.update(time, this.boat, false); 
    this.sky.update(time);
    this.renderer.render(this, this.camera);

      this.CSS2DRenderer.render(this, this.camera);
      

  }

  handleResize = () => {
    /**
     * Get properties for resize
     */
    const width = this.parentElement.offsetWidth,
      height = this.parentElement.offsetHeight,
      pixelRatio = Math.min(2, window.devicePixelRatio);

    /** resize camera */
    this.camera.handleResize(width, height, pixelRatio);
    this.sky.handleResize(width, height, pixelRatio);

    /** resize renderer */
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(0.9);
    this.CSS2DRenderer.setSize(width, height);
  };

  dispose() {
    /**
     * Remove Listeners
     */
    window.removeEventListener("resize", this.handleResize);
    /**
     * Release Resources from GPU
     */
    //@ts-ignore
    this.children.forEach((child) => child.dispose && child.dispose());
    this.remove(...this.children);
    this.Textures.forEach(([_, texture]) => texture.dispose());
    this.renderer.dispose();
    /**
     * Remove canvas and css2dRenderer div element from DOM
     */
    this.parentElement.removeChild(this.renderer.domElement);
    this.parentElement.removeChild(this.CSS2DRenderer.domElement);
  }
}

module.exports = Sketch;
