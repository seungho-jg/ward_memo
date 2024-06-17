import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Character } from './Character';

export default class ThreeMain {
    constructor() {
        // scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 12;
        this.camera.position.y = 4;

        // raycaster
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // renderer
        this.canvas = document.querySelector('#three-canvas');
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

        // controls
        this.controller = new OrbitControls(this.camera, this.canvas);

        this.light = new THREE.DirectionalLight(0xffffff, 2.6);
        this.light.position.x = 0;
        this.light.position.z = 0;
        this.scene.add(this.light);
        
        this.ambientLigth = new THREE.AmbientLight('white', 1.9);
        this.scene.add(this.ambientLigth);

        const cubeTextureLoader = new THREE.CubeTextureLoader();
        this.envTex = cubeTextureLoader.setPath('./assets/cubemap/').load([
            'px.png', 'nx.png',
            'py.png', 'ny.png',
            'pz.png', 'nz.png'
        ]);
        this.scene.background = this.envTex;

        const grass_loader = new THREE.TextureLoader();
        this.textures = [
            grass_loader.load('./assets/grass_side.png'),
            grass_loader.load('./assets/grass_side.png'),
            grass_loader.load('./assets/grass_top.png'),
            grass_loader.load('./assets/mud.png'),
            grass_loader.load('./assets/grass_side.png'),
            grass_loader.load('./assets/grass_side.png')
        ];
        this.materials = this.textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
        this.textures.forEach(texture => texture.magFilter = THREE.NearestFilter);

        this.land = [];
        this.box_start_x = -50;
        this.box_start_z = -2;
        this.box_x = 1;
        this.box_z = 1;

        this.box_geo = new THREE.BoxGeometry(1, 1, 1);

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 100; j++) {
                const mesh = new THREE.Mesh(this.box_geo, this.materials);
                mesh.position.set(this.box_start_x + (j * this.box_x), -2, this.box_start_z + (i * this.box_z));
                this.scene.add(mesh);
                this.land.push(mesh);
            }
        }

        const brick_loader = new THREE.TextureLoader();
        this.base_texture = brick_loader.load('./assets/Brick_base.png');
        this.normal_texture = brick_loader.load('./assets/Brick_Normal.png');
        this.roughness_texture = brick_loader.load('./assets/Brick_Roughness.png');
        this.ao_texture = brick_loader.load('./assets/Brick_AO.png');

        this.brick_textures = [this.base_texture, this.normal_texture, this.roughness_texture, this.ao_texture];
        this.brick_textures.forEach(texture => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(3.9, 0.98);
        });

        this.wall_geo = new THREE.PlaneGeometry(100, 15);
        this.wall_mat = new THREE.MeshStandardMaterial({
            map: this.base_texture,
            normalMap: this.normal_texture,
            roughness: 0.1,
            roughnessMap: this.roughness_texture,
            metalness: 0.5,
            aoMap: this.ao_texture,
            aoMapIntensity: 1,
            envMap: this.envTex
        });
        this.wall = new THREE.Mesh(this.wall_geo, this.wall_mat);
        this.wall.position.z = -1.9;
        this.wall.position.y = 2.6;
        this.scene.add(this.wall);

        this.user = null;
    }

    createUser(name) {
        this.user = new Character(this.scene, this.camera, name);
    }
    
    draw() {
        this.renderer.render(this.scene, this.camera);
        if (this.user) {
            this.user.updateCameraPosition();
        }
        this.renderer.setAnimationLoop(() => this.draw());
    }

    setSize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    }

    checkIntersects(){

    }

    start() {
        window.addEventListener('resize', () => this.setSize());
        window.addEventListener('click', e => {
            this.mouse.x = e.clientX / this.canvas.clientWidth * 2 - 1;
            this.mouse.y = -(e.clientY / this.canvas.clientHeight * 2 - 1);
            console.log(this.mouse.x, this.mouse.y);
            checkIntersects();
        })
        this.draw();
    }
}
