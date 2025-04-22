// Villa.js
import * as THREE from 'three';

export class Villa {
    constructor(scene, gltfLoader, zPositions, xOffset) {
        this.scene = scene;
        this.init(gltfLoader, zPositions, xOffset);
    }

    init(gltfLoader, zPositions, xOffset) {
        gltfLoader.load('/models/source/villa.glb', (gltf) => {
            const villa = gltf.scene;
            villa.scale.set(4, 4, 4);
            this.applyRandomColors(villa);

            zPositions.forEach(z => {
                const leftVilla = this.createVillaClone(villa, -xOffset - 50, z - 5, Math.PI / 2);
                const rightVilla = this.createVillaClone(villa, xOffset + 60, z - 10, -Math.PI / 2);
                this.scene.add(leftVilla);
                this.scene.add(rightVilla);
            });
        });
    }

    applyRandomColors(object) {
        object.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                    roughness: 0.7,
                    metalness: 0.1
                });
            }
        });
    }

    createVillaClone(villa, x, z, rotationY) {
        const clone = villa.clone();
        clone.position.set(x, 0, z);
        clone.rotation.y = rotationY;
        return clone;
    }
}