import { Shaders, GLSL } from 'gl-react';

const shaders = Shaders.create({
  mice: {
    frag: GLSL`
/** NOTES:
 *   Colors from https://www.uillinois.edu/OUR/brand/color_palettes
 */

/* Main Parameters */
#define ME_COLOR vec3(0.909, 0.290, 0.152)
#define PARTNER_COLOR vec3(0.309, 0.407, 0.596)
#define BACKGROUND_COLOR vec3(0.074, 0.160, 0.294)
#define USE_SHAPE Dot
#define SHARPNESS 150.0
#define SIZE 0.05
#define BACKGROUND_FADE 0.5

/* Dot Parameters */
#define DOT_RADIUS 3.0
#define DOT_SEPARATION 15.0

precision highp float;

uniform vec3 iResolution; // viewport resolution in pixels
uniform vec4 iMouse;      // shader playback time (in seconds) 
uniform float iTime;      // mouse pixel coords. xy: current (if MLB down), zw: click

/* Globals */
vec2 fragCoord;

/* Helpers */
float sigmoid(float x, float k, float x0) {
  return 1./(1. + exp(-k*(x - x0))); 
}


/* Gradient function */
vec3 getColor(in vec2 mouse1, in vec2 mouse2) {
  // Calculate distance to either mouse
  float d1 = length(fragCoord - mouse1);
  float d2 = length(fragCoord - mouse2);
  
  d1 /= length(iResolution.xy); // Normalize
  d2 /= length(iResolution.xy);
      
  float k1 = sigmoid(d1, SHARPNESS, SIZE);
  float k2 = sigmoid(d2, SHARPNESS, SIZE);
  
  vec3 bg = mix(BACKGROUND_COLOR, vec3(0), pow(min(d1, d2), BACKGROUND_FADE));
  vec3 c1 = mix(ME_COLOR, bg, k1);
  vec3 c2 = mix(PARTNER_COLOR, bg, k2);
  
  float k = sigmoid(0.5*(d1 - d2) + 0.5, 25., 0.5);
      
  vec3 c = mix(c1, c2, k);
  return c;
}


/* Shape Functions */
float None() {
  return 1.0;
}

float Dot(){ 
  // Distance from frag to a dot
  float r = length(mod(fragCoord, DOT_SEPARATION) - vec2(DOT_RADIUS));
  return step(r, DOT_RADIUS);
}


void main() {
  fragCoord = gl_FragCoord.xy;
  
  // Simulate mouse2 moving in a circle
  float theta = 2.5 * iTime;
  vec2 mouse2 = 100.0 * vec2(cos(theta), sin(theta)) + iResolution.xy/2.0;
  
  vec3 col = getColor(iMouse.xy, mouse2);
  col *= USE_SHAPE();
  
  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
    `,
  },
});

export default shaders;