// Lady.js
import * as THREE from 'three';

export class Lady {
    constructor(scene, gltfLoader, modelPath, x, z, endZ, speed, rotationY) {
        this.scene = scene;
        this.mixer = null;
        this.lady = null;
        this.init(gltfLoader, modelPath, x, z, endZ, speed, rotationY);
    }

    init(gltfLoader, modelPath, x, z, endZ, speed, rotationY) {
        gltfLoader.load(modelPath, (ladyGltf) => {
            this.lady = ladyGltf.scene;
            this.lady.scale.set(5, 5, 5);
            this.lady.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            if (ladyGltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.lady);
                const clip = ladyGltf.animations[0];
                this.mixer.clipAction(clip).play();
            }

            this.lady.position.set(x, 0, z);
            this.lady.userData = {
                endZ: endZ,
                speed: speed
            };
            this.lady.rotation.y = rotationY;

            this.scene.add(this.lady);
        });
    }

    update(deltaTime, cats) {
        if (!this.lady) return;

        const { endZ, speed } = this.lady.userData;

        const minDistance = 20;
        const canMove = !cats.some(cat => {
            const dz = Math.abs(this.lady.position.z - cat.position.z);
            const dx = Math.abs(this.lady.position.x - cat.position.x);
            return dz < minDistance && dx < 10;
        });

        if (canMove && ((speed > 0 && this.lady.position.z < endZ) || 
                       (speed < 0 && this.lady.position.z > endZ))) {
            this.lady.position.z += speed * deltaTime;
        }

        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}