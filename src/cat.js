// Cat.js
import * as THREE from 'three';

export class Cat {
    constructor(scene, gltfLoader, zPositions, xOffset) {
        this.scene = scene;
        this.cats = [];
        this.mixers = [];
        this.init(gltfLoader, zPositions, xOffset);
    }

    init(gltfLoader, zPositions, xOffset) {
        gltfLoader.load('/models/source/cattt.glb', (catGltf) => {
            const cat = catGltf.scene;
            cat.scale.set(12, 12, 12);
            cat.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            const mixer = new THREE.AnimationMixer(cat);
            catGltf.animations.forEach(clip => mixer.clipAction(clip).play());
            this.mixers.push(mixer);

            zPositions.forEach((z, index) => {
                if (index !== 0) {
                    const catClone = this.createCatClone(cat, -xOffset - 10, z - 20);
                    this.scene.add(catClone);
                    this.cats.push(catClone);
                }

                const catCloneR = this.createCatClone(cat, xOffset + 10, z - 20);
                this.scene.add(catCloneR);
                this.cats.push(catCloneR);
            });
        });
    }

    createCatClone(cat, x, z) {
        const clone = cat.clone();
        clone.position.set(x, 0, z);
        clone.userData = {
            speed: 0.5 + Math.random() * 1.5,
            jumpHeight: 2 + Math.random() * 3,
            direction: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(),
            isJumping: false,
            jumpProgress: 0,
            originalY: clone.position.y
        };
        return clone;
    }

    update(deltaTime) {
        this.cats.forEach(cat => {
            const catData = cat.userData;
            cat.position.x += catData.direction.x * catData.speed * deltaTime;
            cat.position.z += catData.direction.z * catData.speed * deltaTime;

            if (Math.random() < 0.01) {
                catData.direction.set(
                    Math.random() - 0.5,
                    0,
                    Math.random() - 0.5
                ).normalize();
            }

            if (!catData.isJumping && Math.random() < 0.02) {
                catData.isJumping = true;
                catData.jumpProgress = 0;
                catData.originalY = cat.position.y;
            }

            if (catData.isJumping) {
                catData.jumpProgress += deltaTime * 2;
                if (catData.jumpProgress < Math.PI) {
                    const jumpValue = Math.sin(catData.jumpProgress) * catData.jumpHeight;
                    cat.position.y = catData.originalY + jumpValue;
                } else {
                    cat.position.y = catData.originalY;
                    catData.isJumping = false;
                }
            }

            if (catData.direction.x !== 0 || catData.direction.z !== 0) {
                cat.rotation.y = Math.atan2(catData.direction.x, catData.direction.z);
            }
        });

        this.mixers.forEach(mixer => mixer.update(deltaTime));
    }
}