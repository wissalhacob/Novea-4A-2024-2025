// Arbre.js
import * as THREE from 'three';

export class Arbre {
    constructor(scene, gltfLoader) {
        this.scene = scene;
        this.trees = [];
        this.init(gltfLoader);
    }

    init(gltfLoader) {
        gltfLoader.load('/models/source/trees.glb', (gltf) => {
            const tree = gltf.scene;
            tree.scale.set(8, 8, 8);
            tree.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Positionnement des arbres
            for (let z = -100; z <= 100; z += 100) {
                const leftTree = tree.clone();
                leftTree.position.set(-200, 0, z + 100);
                this.scene.add(leftTree);
                this.trees.push(leftTree);

                const rightTree = tree.clone();
                rightTree.position.set(200, 0, z + 100);
                this.scene.add(rightTree);
                this.trees.push(rightTree);
            }
        });
    }

    // Méthode pour ajouter des arbres supplémentaires si besoin
    addTree(x, z) {
        if (this.trees.length > 0) {
            const newTree = this.trees[0].clone();
            newTree.position.set(x, 0, z);
            this.scene.add(newTree);
            this.trees.push(newTree);
        }
    }

    // Méthode pour mettre à jour les arbres (si animation nécessaire)
    update(deltaTime) {
        // Pourrait être utilisé pour animer les arbres (feuilles qui bougent, etc.)
    }
}