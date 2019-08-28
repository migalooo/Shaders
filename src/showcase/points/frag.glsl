#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
/* uniform vec2 u_mouse; */
uniform float u_time; 

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.002, pct, st.y) - smoothstep( pct, pct+0.002, st.y);
}

void main() {
  const float PI = 3.1415926;
  vec2 st = gl_FragCoord.xy/u_resolution;

  float y = PI*(0.1*st.x);

  vec3 color = vec3(y);

  float pct = plot(st,y);

  color = (1.0-pct)*color+pct*vec3(0.0, 1.0, 0.0);

  gl_FragColor = vec4(color,1.0);
}
