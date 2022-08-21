import { imageToTexture} from "./utils"

import {Scene, OrthographicCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, Clock, Color, DirectionalLight, TextureLoader, PlaneBufferGeometry, ShaderMaterial, Vector3, DoubleSide, Group, MathUtils, Vector2, Object3D, WebGLRenderTarget, UniformsUtils, PlaneGeometry, Vector, Box3} from "three"

import background from '../resources/bg.jpg'
import stars from '../resources/stars.png'
import ground from '../resources/ground.png'
import bear from '../resources/bear.png'
import leaves1 from '../resources/leaves1.png'
import leaves2 from '../resources/leaves2.png'

import ParticleFragment from "../shaders/layer/fragment.glsl";
import ParticleVertex from "../shaders/layer/vertex.glsl";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { BokehShader, BokehDepthShader } from 'three/examples/jsm/shaders/BokehShader2.js';
let target = new Vector3();

const postprocessing : any = { };
const movementVector = new Vector3();
const tempVector = new Vector3();


let timeout : any;
let vec = new Vector3();


export default class Background { 
    private renderer: WebGLRenderer;
    private camera: OrthographicCamera;
    private scene: Scene = new Scene();
    private clock : Clock = new Clock();
    private layer : Group = new Group();
    private mouse : Vector2 = new Vector2();
    constructor(canvas : HTMLCanvasElement){
        const width = window.innerWidth
        const height = window.innerHeight
        const aspect = width / height;
        const frustumSize = 1000;
        this.renderer = new WebGLRenderer({antialias : false, canvas, powerPreference: 'high-performance', stencil: false, alpha: false, depth: false});
        this.camera = new OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000);

        this.inititialize();
 
        const textures = imageToTexture([background, stars, ground, bear, leaves1, leaves2])
        const layers = [
            { texture: textures[0], z: 0, factor: 0.005},
            { texture: textures[1], z: 10, factor: 0.005 },
            { texture: textures[2], z: 20 },
            { texture: textures[3], z: 30, scaleFactor: 0.83 },
            { texture: textures[4], factor: 0.03, scaleFactor: 1, z: 40, wiggle: 0.24 },
            { texture: textures[5], factor: 0.04, scaleFactor: 1.3, z: 49, wiggle: 0.3 },
        ]

        layers.map(({ texture, factor = 0, scaleFactor = 1, wiggle = 0, z }, i) => {
            const plane = new Mesh(new PlaneBufferGeometry(1000, 1000), new ShaderMaterial({
                uniforms: {
                    movementVector : { value: new Vector3()},
                    factor : {value : factor},
                    wiggle : {value: wiggle},
                    scaleFactor : {value: scaleFactor * 1.05},
                    textr: {
                        value: texture
                    }
                },
                vertexShader: ParticleVertex,
                fragmentShader: ParticleFragment,
                side : DoubleSide
            }))
            plane.position.z = -750 + (z * 2);
            this.layer.add(plane);
        })


        this.scene.add(this.layer);

        this.camera.position.z = 1;
        requestAnimationFrame(this.update.bind(this));

    }

    inititialize():void { 
        this.scene = new Scene();
        const width = window.innerWidth
        const height = window.innerHeight;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(width, height, false);

        this.scene.background = new Color( 0x000000 );
        
        const light = new DirectionalLight( 0xffffff, 10 );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );

        document.addEventListener('resize', this.onResize.bind(this), false)

        document.addEventListener('pointermove', this.onMouseMove.bind(this))

		const renderPass = new RenderPass( this.scene, this.camera );

        const bokehPass = new BokehPass( this.scene, this.camera, {
            aspect : width / height,
            focus: 1,
            aperture: 0.25,
            maxblur: 0.00,
            width : width * 3,
            height : height * 3
        } );

        const composer = new EffectComposer( this.renderer );

        composer.addPass( renderPass );
        composer.addPass( bokehPass );

        this.renderer.autoClear = false;

        postprocessing.composer = composer;
        postprocessing.bokeh = bokehPass;

        postprocessing.bokeh_uniforms = UniformsUtils.clone( bokehPass.uniforms )

    }

    onMouseMove(event : MouseEvent){
        if(timeout != undefined){
            clearInterval(timeout);
        }
        timeout = setTimeout(() => { 

        }, 100)
        
        this.mouse.x = event.clientX - (window.innerWidth / 2);
        this.mouse.y = event.clientY - (window.innerHeight / 2);

        vec.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );
            
        vec.unproject( this.camera );
            
        vec.sub( this.camera.position ).normalize();
        movementVector.lerp(tempVector.set(vec.x, vec.y * 0.2, 0), 0.2)

        for(const child of this.layer.children){
            ((child as Mesh).material as ShaderMaterial).uniforms.movementVector.value =  movementVector;
            
        }
    }

    onResize():void {
        const width = window.innerWidth
        const height = window.innerHeight
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 1000;
  
        this.camera.left = frustumSize * aspect / - 2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = - frustumSize / 2;
      
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        postprocessing.composer.setSize( width, height );
     }

    update(){
        this.layer.position.x = MathUtils.lerp(this.layer.position.x, vec.x * 12.5, 0.2)
        this.layer.rotation.x = MathUtils.lerp(this.layer.rotation.x, vec.y / 15, 0.2)
        this.layer.rotation.y = MathUtils.lerp(this.layer.rotation.y, -vec.x / 15, 0.2);
        postprocessing.bokeh.uniforms.maxblur.value = Math.abs((this.mouse.x)) / 150000;

        postprocessing.composer.render();
        requestAnimationFrame(this.update.bind(this));
    }
}