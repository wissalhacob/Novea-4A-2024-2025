// Flamingo.js
import * as THREE from 'three';

export class Flamingo {
    constructor(scene, gltfLoader, x, z) {
        this.scene = scene;
        this.mixer = null;
        this.flamingo = null;
        this.actions = {};
        this.currentAction = null;
        this.walkSpeed = 0.5;
        this.init(gltfLoader, x, z);
    }

    init(gltfLoader, x, z) {
        gltfLoader.load('/models/source/flamingo.glb', (gltf) => {
            this.flamingo = gltf.scene;
            this.flamingo.scale.set(0.02, 0.02, 0.02);
            this.flamingo.position.set(x, 35, z);
            
            // Configuration des ombres et nommage des parties
            this.flamingo.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Gestion des animations
            if (gltf.animations?.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.flamingo);
                
                // Création des actions pour chaque animation
                gltf.animations.forEach((clip) => {
                    this.actions[clip.name] = this.mixer.clipAction(clip);
                });
                
                // Démarrer avec l'animation idle par défaut
                this.setAnimation('idle' in this.actions ? 'idle' : gltf.animations[0].name);
            }

            this.scene.add(this.flamingo);
            this.setupBehavior();
        });
    }

    setAnimation(name, fadeDuration = 0.2) {
        if (this.currentAction === name || !this.actions[name]) return;
        
        if (this.currentAction) {
            this.actions[this.currentAction].fadeOut(fadeDuration);
        }
        
        this.currentAction = name;
        const action = this.actions[name];
        
        action.reset()
             .setEffectiveTimeScale(1)
             .setEffectiveWeight(1)
             .fadeIn(fadeDuration)
             .play();
    }

    setupBehavior() {
        // Comportement aléatoire
        this.nextBehaviorTime = 0;
        this.currentBehavior = 'idle';
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        if (!this.flamingo) return;

        // Gestion des comportements
        this.nextBehaviorTime -= deltaTime;
        if (this.nextBehaviorTime <= 0) {
            this.changeRandomBehavior();
            this.nextBehaviorTime = 2 + Math.random() * 5; // Prochain changement dans 2-7 sec
        }

        // Exécution du comportement courant
        switch(this.currentBehavior) {
            case 'walking':
                this.flamingo.position.x += Math.sin(this.flamingo.rotation.y) * this.walkSpeed * deltaTime;
                this.flamingo.position.z += Math.cos(this.flamingo.rotation.y) * this.walkSpeed * deltaTime;
                break;
                
            case 'eating':
                // Animation de tête pour manger
                const head = this.flamingo.getObjectByName('head');
                if (head) {
                    head.rotation.x = Math.sin(Date.now() * 0.01) * 0.3;
                }
                break;
        }
    }

    changeRandomBehavior() {
        const behaviors = ['idle', 'walking', 'eating'];
        const newBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
        
        if (newBehavior !== this.currentBehavior) {
            this.currentBehavior = newBehavior;
            this.setAnimation(newBehavior);
            
            if (newBehavior === 'walking') {
                // Nouvelle direction aléatoire
                this.flamingo.rotation.y = Math.random() * Math.PI * 2;
                this.walkSpeed = 0.2 + Math.random() * 0.3;
            }
        }
    }
}