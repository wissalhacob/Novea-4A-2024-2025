// Boy.js
import * as THREE from 'three';

export class Boy {
    constructor(scene, gltfLoader, x, z, endZ, speed) {
        this.scene = scene;
        this.mixer = null;
        this.boy = null;
        this.isReturning = false;
        this.init(gltfLoader, x, z, endZ, speed);
    }

    init(gltfLoader, x, z, endZ, speed) {
        gltfLoader.load('/models/source/home.glb', (boyGltf) => {
            this.boy = boyGltf.scene;
            this.boy.scale.set(10, 10, 10);
            this.boy.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            if (boyGltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.boy);
                const clip = boyGltf.animations[0];
                this.mixer.clipAction(clip).play();
            }

            this.boy.position.set(x, 0, z);
            this.boy.userData = {
                startZ: z,
                endZ: endZ,
                speed: speed,
                originalX: x
            };
            this.boy.rotation.y = 0;

            this.scene.add(this.boy);
        });
    }

    update(deltaTime, cats) {
        if (!this.boy) return;

        const { endZ, speed, originalX, startZ } = this.boy.userData;

        this.boy.position.x = originalX;

        const minDistance = 20;
        const canMove = !cats.some(cat => {
            const dz = Math.abs(this.boy.position.z - cat.position.z);
            const dx = Math.abs(this.boy.position.x - cat.position.x);
            return dz < minDistance && dx < 10;
        });

        if (canMove) {
            if (!this.isReturning && this.boy.position.z < endZ) {
                this.boy.position.z += speed * deltaTime;
                this.boy.rotation.y = 0;
            }
            else if (this.isReturning && this.boy.position.z > startZ) {
                this.boy.position.z -= speed * deltaTime;
                this.boy.rotation.y = Math.PI;
            }
            
            if (!this.isReturning && this.boy.position.z >= endZ) {
                this.isReturning = true;
            }
            else if (this.isReturning && this.boy.position.z <= startZ) {
                this.isReturning = false;
            }
        }

        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}