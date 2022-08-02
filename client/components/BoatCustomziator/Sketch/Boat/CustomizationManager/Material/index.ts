import * as THREE from "three";

import fragmentShader from "./fragment.glsl";

interface Props {
  colorMap?: THREE.Texture;
  occlusionRoughnessMetallicMap: THREE.Texture;
  opacity?: number;
}

export default class Material extends THREE.MeshStandardMaterial {
  static isMeshStandardMaterial = true;
  /**
   *
   * @param occlusionRoughnessMetallicMap Texture with channels matching following:
   * `r` - Ambient occlusion
   * `g` - roughness
   * `b` - metalness
   * `a` - alpha
   * @param normalMap Tangent space normal map
   */
  constructor({ colorMap, occlusionRoughnessMetallicMap, opacity }: Props) {
    super({
      /** Load diffuse color as map */
      map: colorMap,
      /** Load custom map as roughness map */
      roughnessMap: occlusionRoughnessMetallicMap,
      aoMap: occlusionRoughnessMetallicMap,
      metalnessMap: occlusionRoughnessMetallicMap,
      opacity,
      transparent: opacity !== undefined && opacity < 1,
      envMapIntensity: 1.5,
      metalness: 1.5,
     // color : new THREE.Color(0.0,1.0,0.0)
    });
   // this.color.set(new THREE.Color(1.0,0.0,0.0));

    this.onBeforeCompile = (shader) => (shader.fragmentShader = fragmentShader);

  }

  setColor(color: THREE.ColorRepresentation) {
    this.color.set(color);
  }
}
