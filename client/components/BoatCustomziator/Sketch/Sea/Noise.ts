import * as THREE from "three";

/**
 * Exact replica of wave noise function from shader
 * Used for calculating sea elevation at specific points to calculate tilt angle of boat
 */
export namespace Noise {
  /**
   * Sea Controlling parameters
   * These are also Uniform values for shader
   */
  export const WAVE_SCALE = 0.15;
  export const WAVE_FREQUENCY = 0.25;
  export const SMALL_WAVE_SCALE = 0.04;
  export const SMALL_WAVE_FREQUENCY = -1;
  export const WAVE_SPEED = 0.001;

  export type vec2 = [x: number, y: number];

  const wavedxVec = new THREE.Vector2();
  function wavedx(
    position: THREE.Vector2,
    direction: THREE.Vector2,
    speed: number,
    frequency: number,
    timeshift: number
  ) {
    const x = direction.dot(position) * frequency + timeshift * speed;
    const wave = Math.exp(Math.sin(x) - 1);
    const dx = wave * Math.cos(x);
    return wavedxVec.set(wave, -dx);
  }

  const vec1 = new THREE.Vector2();
  const vec2 = new THREE.Vector2();
  function getWaves(_position: vec2, iterations: number, time: number) {
    const position = vec2.set(_position[0], _position[1]);
    let iter = 0.0;
    let phase = 6.0;
    let speed = 2.0;
    let weight = 1.0;
    let w = 0.0;
    let ws = 0.0;

    for (let i = 0; i < iterations; i++) {
      const p = vec1.set(Math.sin(iter), Math.cos(iter));
      const res = wavedx(position, p, speed, phase, time * Noise.WAVE_SPEED);
      position.add(p.normalize().multiplyScalar(res.y * weight * 0.048));
      w += res.x * weight;
      iter += 12.0;
      ws += weight;
      weight = THREE.MathUtils.lerp(weight, 0, 0.2);
      phase *= 1.18;
      speed *= 1.07;
    }
    return w / ws;
  }

  export function sea([x, y]: vec2, time: number) {
    return (
      getWaves([x * Noise.WAVE_FREQUENCY, y * Noise.WAVE_FREQUENCY], 8, time) *
        Noise.WAVE_SCALE +
      getWaves(
        [x * Noise.SMALL_WAVE_FREQUENCY, y * Noise.SMALL_WAVE_FREQUENCY],
        16,
        time
      ) *
        Noise.SMALL_WAVE_SCALE
    );
  }

  const vec4 = new THREE.Vector3();
  export function getNormal([x, y]: vec2, time: number) {
    const eps = 0.005;
    return vec4.set(
      sea([x - eps, y], time) - sea([x + eps, y], time),
      2 * eps,
      sea([x, y - eps], time) - sea([x, y + eps], time)
    );
  }
}
