
#define SEA_BASE vec3(0.0, 0.05, 0.1)
#define SEA_WATER_COLOR vec3(0.8, 0.9, 0.6) * 0.6
#define SUN_DIR normalize(vec3(0, 1., 0.))
#define SUN_COLOR vec3(1., .7, .55)

varying vec3 vPosition;

uniform float uTime;
uniform float waveScale;
uniform float waveFrequency;
uniform float smallWaveScale;
uniform float smallWaveFrequency;
uniform float radius;

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
         smallWaveScale * getwaves(position.xy * smallWaveFrequency, 16);
}

vec3 getNormal(vec2 p) {
  const float eps = 0.001;
  const vec2 h = vec2(eps, 0);
  return normalize(vec3(sea(p - h.xy) - sea(p + h.xy), 2.0 * h.x,
                        sea(p - h.yx) - sea(p + h.yx)));
}
// lighting
float diffuse(vec3 n, vec3 l, float p) { return pow(dot(n, l) * 0.4 + 0.6, p); }
// sky
vec3 getSkyColor(vec3 rd) {

  vec3 sky = mix(vec3(.0, .1, .4), vec3(.3, .6, .8), 1.0 - rd.y);

  return sky;
}

vec3 getSeaColor(vec3 normal, vec3 cameraDirection) {
  float fresnel = 1.0 - max(dot(normal, -cameraDirection), 0.);
  // fresnel = clamp(fresnel, 0.1, 0.7);
  // fresnel = abs(fresnel);
  fresnel = pow(fresnel, 2.)*0.9  ;

  vec3 reflected = getSkyColor(reflect(cameraDirection, normal));
  vec3 refracted = vec3(SEA_BASE) + diffuse(normal, SUN_DIR, 100.0) *
                                        vec3(SEA_WATER_COLOR) * 0.25;

  // return vec3(reflected);
  return mix(refracted, reflected, fresnel);
}

void main() {
  vec3 color = getSeaColor(getNormal(vPosition.xz),
                           normalize(vPosition - cameraPosition));

  float opacity = 1. - smoothstep(0.8 * radius, radius, length(vPosition.xz));

  gl_FragColor = vec4(color, opacity);
}