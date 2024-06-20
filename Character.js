import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {
    constructor(scene, camera, name) {
        this.scene = scene;
        this.camera = camera;
        this.name = name;
        this.group = null;
        this.model = null;
        this.moveDistance = 0.1;

        this.jumpHeight = 1; // 점프 높이 설정
        this.isJumping = false; // 점프 상태 확인 변수
        this.jumpSpeed = 0.2; // 점프 속도 설정
        this.velocityY = 0; // y축 속도
        this.gravity = 0.01; // 중력

        this.cameraTargetPosition = new THREE.Vector3();

        this.init();
    }
    
    init() {
        const loader = new GLTFLoader();
        this.group = new THREE.Group();
        this.create_name(this.group);
        loader.load('./assets/ward.glb', (gltf) => {
            this.model = gltf.scene;
            this.model.scale.set(0.15, 0.15, 0.15);
            this.model.rotation.y = 1.6;
            this.model.position.y = -0.5;
            this.model.position.z = 3;
            this.group.add(this.model);
            this.scene.add(this.group);

            // Initialize camera target position
            this.cameraTargetPosition.copy(this.camera.position);

            this.animate(); // 애니메이션 루프 시작
        });

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('focusin', this.onFocusIn.bind(this));
        document.addEventListener('focusout', this.onFocusOut.bind(this));

        this.typing = false;
    }

    create_name(group) {
        const textCanvas = document.createElement('canvas');
        const texContext = textCanvas.getContext('2d');
        textCanvas.height = 150;
        textCanvas.width = 500;
        // 투명 배경 설정
        texContext.clearRect(0, 0, textCanvas.width, textCanvas.height);

        const canvasTexture = new THREE.CanvasTexture(textCanvas);
        texContext.fillStyle = 'black';
        texContext.font = 'bold 100px sans-serif';

        // 텍스트 중앙 정렬
        texContext.textAlign = 'center';
        texContext.textBaseline = 'middle';

        texContext.fillText(this.name, textCanvas.width / 2, textCanvas.height / 2 + 5);
        const name_geo = new THREE.PlaneGeometry(4, 1);
        canvasTexture.magFilter = THREE.NearestFilter;

        const name_mat = new THREE.MeshBasicMaterial({ map: canvasTexture, transparent: true, side: THREE.DoubleSide });
        const name = new THREE.Mesh(name_geo, name_mat);
        name.position.z = 3;
        name.position.y = 1.4;
        name.position.x = -0.1;
        group.add(name);
    }

    onKeyDown(event) {
        if (this.typing) return;
        switch (event.code) {
            case 'KeyW': // W key
                this.moveForward();
                break;
            case 'KeyS': // S key
                this.moveBackward();
                break;
            case 'KeyA': // A key
                this.moveLeft();
                break;
            case 'KeyD': // D key
                this.moveRight();
                break;
            case 'Space': // Space key for jump
                this.jump();
                break;
        }
    }

    onFocusIn(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            this.typing = true;
        }
    }

    onFocusOut(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            this.typing = false;
        }
    }

    moveForward() {
        if (this.model) {
            const forward = new THREE.Vector3(0, 0, -1);
            forward.normalize().multiplyScalar(this.moveDistance);
            this.group.position.add(forward);
        }
    }

    moveBackward() {
        if (this.model) {
            const backward = new THREE.Vector3(0, 0, 1);
            backward.normalize().multiplyScalar(this.moveDistance);
            this.group.position.add(backward);
        }
    }

    moveLeft() {
        if (this.model) {
            const left = new THREE.Vector3(-1, 0, 0);
            this.group.position.add(left.multiplyScalar(this.moveDistance));

            this.cameraTargetPosition.x = this.group.position.x;
        }
    }

    moveRight() {
        if (this.model) {
            const right = new THREE.Vector3(1, 0, 0);
            this.group.position.add(right.multiplyScalar(this.moveDistance));

            this.cameraTargetPosition.x = this.group.position.x;
        }
    }

    jump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.velocityY = this.jumpSpeed; // 점프 시작 속도 설정
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 점프 처리
        if (this.isJumping) {
            this.group.position.y += this.velocityY;
            this.velocityY -= this.gravity; // 중력 적용

            // 바닥에 도달하면 점프 종료
            if (this.group.position.y <= 0) {
                this.group.position.y = 0;
                this.isJumping = false;
                this.velocityY = 0;
            }
        }

        this.updateCameraPosition();
    }

    updateCameraPosition() {
        this.camera.position.lerp(this.cameraTargetPosition, 0.01);
    }
}
