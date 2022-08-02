import * as THREE from "three";
import Camera from "../Camera";

import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

export default class Sky extends THREE.Mesh {
  declare material: THREE.ShaderMaterial;

  constructor(private camera: Camera) {
    super();
    /**
     * Assign geometry
     */
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    /**
     * Create material
     */
    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2() },
        uCameraPosition: { value: new THREE.Vector3() },
        uCameraDirection: { value: new THREE.Vector3() },
        uTime: { value: 0 },
      },
      // wireframe: true,
    });

    /**
     * Since it always has to be displayed don't bother checking it for culling
     */
    this.frustumCulled = false;
    this.matrixWorldNeedsUpdate = false;
  }

  handleResize(width: number, height: number, pixelRatio: number) {
    this.material.uniforms.uResolution.value
      .set(width, height)
      .multiplyScalar(pixelRatio);
  }

  update(time: number) {
    this.material.uniforms.uTime.value = time;
    /**
     * Update camera position and direction
     */
    (this.material.uniforms.uCameraPosition.value as THREE.Vector3).copy(
      this.camera.position
    );
    (this.material.uniforms.uCameraDirection.value as THREE.Vector3)
      .copy(this.camera.target)
      .sub(this.camera.position)
      .normalize();
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
