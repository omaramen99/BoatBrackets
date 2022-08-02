
uniform float uTime;
uniform float waveScale;
uniform float waveFrequency;
uniform float smallWaveScale;
uniform float smallWaveFrequency;

varying vec3 vPosition;

vec2 wavedx(vec2 position, vec2 direction, float speed, float frequency,
            float timeshift) {
  float x = dot(direction, position) * frequency + timeshift * speed;
  float wave = exp(sin(x) - 1.0);
  float dx = wave * cos(x);
  return vec2(wave, -dx);
}

float getwaves(vec2 position, int iterations) {
  float iter = 0.0;
  float phase = 6.0;
  float speed = 2.0;
  float weight = 1.0;
  float w = 0.0;
  float ws = 0.0;
  for (int i = 0; i < iterations; i++) {
    vec2 p = vec2(sin(iter), cos(iter));
    vec2 res = wavedx(position, p, speed, phase, uTime);
    position += normalize(p) * res.y * weight * 0.048;
    w += res.x * weight;
    iter += 12.0;
    ws += weight;
    weight = mix(weight, 0.0, 0.2);
    phase *= 1.18;
    speed *= 1.07;
  }
  return w / ws;
}

float sea(vec2 position) {
  return getwaves(position.xy * waveFrequency, 8) * waveScale +
         smallWaveScale * getwaves(position.xy *  smallWaveFrequency, 16);
}

void main() {
  vec3 transformedPos = position;
  float n = sea(transformedPos.xy);

  transformedPos.z += n;

  vec4 mPosition = modelMatrix *  vec4(transformedPos, 1.);

  vPosition = mPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}