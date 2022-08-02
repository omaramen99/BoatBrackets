#define PI 3.14159265359

uniform vec2 uResolution;
uniform vec3 uCameraPosition;
uniform vec3 uCameraDirection;
uniform float uTime;

/**** TWEAK *****************************************************************/
#define COVERAGE .5
#define THICKNESS 5.
#define ABSORPTION 1.020725
#define WIND vec3(0, 0, -uTime * .0001) 
#define FBM_FREQ 2.96434
 

#define STEPS 8
/******************************************************************************/

vec3 getRayDirection() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec3 u = normalize(cross(uCameraDirection, vec3(0, 1, 0)));
  vec3 v = normalize(cross(u, uCameraDirection));
  mat3 camera = mat3(u, v, uCameraDirection);
  return normalize(camera * vec3(uv, 1.));
}

struct Ray {
  vec3 origin;
  vec3 direction;
};
#define BIAS 1e-4 // small offset to avoid self-intersections

struct Sphere {
  vec3 origin;
  float radius;
};

struct Plane {
  vec3 direction;
  float distance;
};

struct Hit {
  float t;
  vec3 normal;
  vec3 origin;
};

bool intersectPlane(Ray ray, Plane plane) {
  float denom = dot(plane.direction, ray.direction);
  if (denom > 1e-6) {

    vec3 p0 = plane.direction * plane.distance;
    float t = dot(p0 - ray.origin, plane.direction) / denom;
    return t >= 0.;
  }

  return false;
}

float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 perm(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

float noise(vec3 p) {
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);

  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);

  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));

  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

  return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fbm(vec3 pos, float lacunarity) {
  vec3 p = pos;
  float t = 0.51749673 * noise(p);
  p *= lacunarity;
  t += 0.25584929 * noise(p);
  p *= lacunarity;
  t += 0.12527603 * noise(p);
  p *= lacunarity;
  t += 0.06255931 * noise(p);

  return t;
}

float get_noise(vec3 x) { return fbm(x, FBM_FREQ); }

float density(vec3 pos, vec3 offset, float t) {
  // signal
  vec3 p = pos * .0212242 + offset;
  float dens = get_noise(p);

  float cov = 1. - COVERAGE;
  dens -= cov;

  return clamp(dens, 0., 1.);
}

vec3 getSkyColor(vec3 rd) { 
  vec3 sky = mix(vec3(.0, .1, .4), vec3(.3, .6, .8), 1.0 - rd.y); 

  return sky;
}

vec4 getClouds(in Ray ray) {
  const float thickness = THICKNESS; // length(hit_2.origin - hit.origin);
  // const float r = 1. - ((atmosphere_2.radius - atmosphere.radius) /
  // thickness);
  const int steps = STEPS; // +int(32. * r);
  float march_step = thickness / float(steps);

  vec3 dir_step = ray.direction / ray.direction.y * march_step;
  vec3 pos = ray.origin + ray.direction * 400.;

  float T = 1.1;     // transmitance
  vec3 C = vec3(0.); // color
  float alpha = 0.;

  for (int i = 0; i < steps; i++) {
    float h = float(i) / float(steps);
    float dens = density(pos, WIND, h);

    float T_i = exp(-ABSORPTION * dens * march_step);
    T *= T_i;
    if (T < .01)
      break;

    C += T * (exp(h) / 1.25) * dens * march_step;
    alpha += (1. - T_i) * (1. - alpha);

    pos += dir_step;
    if (length(pos) > 1e3)
      break;
  }
  return vec4(C, alpha) *
         smoothstep(0., 0.25, dot(vec3(0., 1., 0.), normalize(pos)));
} 
void main() {
  Ray ray = Ray(uCameraPosition, getRayDirection());

  vec3 sky = getSkyColor(ray.direction);
  if (intersectPlane(ray, Plane(vec3(0., -1., 0.), 0.))) {
    gl_FragColor = vec4(sky, 1.);
    return;
  };

  vec4 clouds = getClouds(ray);

  gl_FragColor =
      vec4(mix(sky, clouds.rgb / (0.000001 + clouds.a), clouds.a), 1.);
}