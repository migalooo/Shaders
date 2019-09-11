#ifdef GL_ES
precision mediump float;
#endif


uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;



float rand(vec2 p) {
	return fract(sin(p.x*12.9898)+sin(p.y*78.233)*43758.545);
}

vec2 rand2(vec2 p) {
	return vec2(rand(p),rand(p*2.));
}

vec2 randrange2(vec2 p, float a, float b) {
	return rand2(p) * (b - a) + a;
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	
	f = f * f * (3.0 - 2.0 * f);
	
	/*vec2 a = rand2(i);
	vec2 b = rand2(i+vec2(1.,0.));
	vec2 c = rand2(i+vec2(0.,1.));
	vec2 d = rand2(i+vec2(1.,1.));*/
	
	float a = rand(i);
	float b = rand(i+vec2(1.,0.));
	float c = rand(i+vec2(0.,1.));
	float d = rand(i+vec2(1.,1.));
	return mix(
		mix(a, b, f.x),
		mix(c, d, f.x),
		f.y);
}

#define hash(u) (rand2(u) * 2.0 - 1.0)
float gnoise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3. - 2. * f);
	float a = dot(hash(i), f);
	float b = dot(hash(i + vec2(1, 0)), f - vec2(1, 0));
	float c = dot(hash(i + vec2(0, 1)), f - vec2(0, 1));
	float d = dot(hash(i + vec2(1, 1)), f - vec2(1, 1));
	return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}



float fractalNoise(vec2 p) {	
	float color = 0.;
	for (float i = 0.; i  < 4.; i++) {
		float n = p.x > 0. ? gnoise(p*pow(2.,i)) : noise(p * pow(2., i));
		color +=  n/ pow(2.,(i+1.)/1.5);
	}
	return color / 3.;
}

float map(vec3 p) {
	return p.y - fractalNoise(p.xz)*2.;
}

vec3 normal(vec3 p) {
	vec2 e = vec2(0.001,0.);
	return normalize(vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)));
}

void main( void ) {

	vec2 uv = ( 2.*gl_FragCoord.xy- u_resolution.xy )/u_resolution.y;

	vec3 eye = vec3(0.,1.3,u_time);
	vec3 raydir = normalize(vec3(uv.x, uv.y-.5, 1.));
	vec3 p = eye;
	float hit = 0.;
	
	for (float i = 0.; i < 128.; i++) { 
		float d = map(p);
		if (abs(d) < 0.001) {
			hit = i;
			break;
		}
		p += d * raydir * 0.5;
	
	}
	
	vec3 lightdir = -normalize(vec3(.5,-1.,-.5));
	vec3 color;
  color = vec3(length(p - vec2(0.0, u_time).xxy)) * 0.1;
	gl_FragColor = vec4( color, 1.0 );

}
