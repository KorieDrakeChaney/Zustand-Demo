uniform float time;
uniform vec2 resolution;
uniform float wiggle;
varying vec2 vUv;
varying vec3 vNormal;

void main()	{
    vUv = uv;
    vec3 transformed = vec3(position);
    if (wiggle > 0.) {
    float theta = sin(time + position.y) / 2.0 * wiggle;
    float c = cos(theta);
    float s = sin(theta);
    mat3 m = mat3(c, 0, s, 0, 1, 0, -s, 0, c);
    transformed = transformed * m;
    vNormal = vNormal * m;
    }      

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
}