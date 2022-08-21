 uniform float time;
uniform vec2 resolution;
uniform float factor;
uniform float scaleFactor;
uniform vec3 movementVector;
uniform sampler2D textr;
varying vec2 vUv;
void main()	{
    vec2 uv = vUv / scaleFactor + movementVector.xy * factor;
    vec4 color = texture2D(textr, uv);
    if (color.a < 0.1) discard;
    gl_FragColor = color;
}