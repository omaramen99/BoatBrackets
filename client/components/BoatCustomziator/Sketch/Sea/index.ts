import * as THREE from "three";
import Boat from "../Boat";
import { Utils } from "../Utils";

import fragmentShader from "./fragment.glsl";
import { Noise } from "./Noise";
import vertexShader from "./vertex.glsl";

export default class Sea extends THREE.Mesh {
  material: THREE.ShaderMaterial;
  testSphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  constructor(public readonly quality: number = 7) {
    super();

    this.geometry = new THREE.PlaneBufferGeometry(
      30,
      30,
      Math.pow(2, this.quality),
      Math.pow(2, this.quality)
    );
    this.rotateX(-Math.PI / 2);
    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      // side: THREE.DoubleSide,
      // wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        waveScale: { value: Noise.WAVE_SCALE },
        waveFrequency: { value: Noise.WAVE_FREQUENCY },
        smallWaveScale: { value: Noise.SMALL_WAVE_SCALE },
        smallWaveFrequency: { value: Noise.SMALL_WAVE_FREQUENCY },
        //@ts-ignore
        radius: { value: (this.geometry.parameters.width as number) / 2 },
      },
    });
  }

  update(time: number, boat: Boat, isDynamic : boolean) {
    
    
    if (isDynamic) {
      
        /** Update time uniform in shader */
        this.material.uniforms.uTime.value = time * Noise.WAVE_SPEED;
    
        const length = boat.size.x,
          width = boat.size.z;
    
        /**
         * Calculate sea elevation at four points of boat
         */
        const b = Noise.sea([-length / 2, 0], time),
          f = Noise.sea([length / 2, 0], time),
          r = Noise.sea([0, -width / 2], time),
          l = Noise.sea([0, width / 2], time);
        /**
         * Calculate angle between two opposite points and set it as an rotation for boat around corresponding axis
         */
         boat.rotation.z = Math.atan2(b - f, length);
         boat.rotation.x = Math.atan2(l - r, width);
    
        /**
         * set boat elevation to average of all points with little offset
         */
         boat.position.y = 0.022 + Utils.average(b, f, r, l);
        
      }else
      {
        
        boat.position.y = 0.12;
      }

  }

  /**
   * Dispose
   */
  dispose() {
    this.material.dispose();
    this.geometry.dispose();
  }
}
export { Noise };
