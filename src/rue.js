import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { create_panneaux_sol } from './panneaux_sol';
import { create_lampes } from './lampes';
import { create_pole } from './poles';
import { Cat } from './cat';
import { Villa } from './villa';
import { Lady } from './lady';
import { Boy } from './boy';
import { Arbre } from './arbre';
import { Flamingo } from './flamingo';

export function createRoad(scene) {
    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();
    
    // Initialisation des éléments de base
    const road = createRoadMesh(textureLoader);
    scene.add(road);
    
    const ground = createGroundMesh(textureLoader);
    scene.add(ground);
    
    createSidewalks(textureLoader, scene);
    
    const { lampsLeft, lampsRight, updateLamp } = createLampPosts(scene);
    
    const zPositions = [-150, -30, 70, 700];
    const xOffset = 100;
    
    // Création des éléments avec les classes
    const villa = new Villa(scene, gltfLoader, zPositions, xOffset);
    const cat = new Cat(scene, gltfLoader, zPositions, xOffset);
    const arbre = new Arbre(scene, gltfLoader);
    
    // Création des personnages
    const lady1 = new Lady(
        scene, 
        gltfLoader, 
        '/models/source/lady.glb', 
        -xOffset, 
        zPositions[0] - 20, 
        zPositions[1] - 20, 
        5, 
        Math.PI
    );
    
    const lady2 = new Lady(
        scene,
        gltfLoader,
        '/models/source/lady4.glb',
        -xOffset - 20,
        zPositions[1] - 20,
        zPositions[0] - 20,
        -5,
        0
    );
    
    const boy = new Boy(
        scene,
        gltfLoader,
        xOffset + 15,
        zPositions[0] - 15,
        zPositions[1] - 15,
        5
    );

    // Création des flamants roses
    const flamingos = [
        new Flamingo(scene, gltfLoader, 50, -80),
        new Flamingo(scene, gltfLoader, 50, 80),
        new Flamingo(scene, gltfLoader, 60, -70),
        new Flamingo(scene, gltfLoader, 60, 70),
        new Flamingo(scene, gltfLoader, 55, -90),
        new Flamingo(scene, gltfLoader, 55, 90),
        new Flamingo(scene, gltfLoader, 60, 60),
        new Flamingo(scene, gltfLoader, 55, -50),
        new Flamingo(scene, gltfLoader, 60, 60),
      
    ];

    // Récupération de tous les mixers d'animation
    const allMixers = [
        ...cat.mixers,
        ...flamingos.map(f => f.mixer).filter(m => m),
        lady1.mixer, 
        lady2.mixer, 
        boy.mixer
    ].filter(m => m);

    return {
        lampsLeft,
        lampsRight,
        mixers: allMixers,
        updateCatAnimations: (delta) => cat.update(delta),
        updateLadyAnimation: (delta) => lady1.update(delta, cat.cats),
        updateLady2Animation: (delta) => lady2.update(delta, cat.cats),
        updateBoyAnimation: (delta) => boy.update(delta, cat.cats),
        updateTreeAnimations: (delta) => arbre.update(delta),
        updateFlamingoAnimations: (delta) => flamingos.forEach(f => f.update(delta))
    };

    // Fonctions helper pour la création des meshes
    function createRoadMesh(textureLoader) {
        const roadGeometry = new THREE.BoxGeometry(12, 0.1, 200);
        const roadTexture = textureLoader.load('/models/texture/route_texture.png');
        roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
        roadTexture.repeat.set(1, 1);
        const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.y = 0.05;
        road.receiveShadow = true;
        return road;
    }

    function createGroundMesh(textureLoader) {
        const groundGeometry = new THREE.BoxGeometry(1000, 0.1, 1000);
        const groundTexture = textureLoader.load('/models/texture/ground_texture.png');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.position.y = -0.05;
        ground.receiveShadow = true;
        return ground;
    }

    function createSidewalks(textureLoader, scene) {
        const sidewalkGeometry = new THREE.BoxGeometry(2, 0.1, 200);
        const sidewalkTexture = textureLoader.load('/models/texture/sidewalk_texture.jpg');
        sidewalkTexture.wrapS = sidewalkTexture.wrapT = THREE.RepeatWrapping;
        sidewalkTexture.repeat.set(1, 100);
        const sidewalkMaterial = new THREE.MeshStandardMaterial({ map: sidewalkTexture });

        const sidewalkLeft = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        sidewalkLeft.position.set(-7, 0.05, 0);
        sidewalkLeft.receiveShadow = true;
        scene.add(sidewalkLeft);

        const sidewalkRight = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        sidewalkRight.position.set(7, 0.05, 0);
        sidewalkRight.receiveShadow = true;
        scene.add(sidewalkRight);
    }

    function createLampPosts(scene) {
        const lampPosts = [];
        const lampsLeft = [];
        const lampsRight = [];
        
        function createLampPost(x, z) {
            const group = new THREE.Group();
            const { pole } = create_pole(scene, document.getElementById('Longueur').value);
            group.add(pole);

            const { solarPanel } = create_panneaux_sol(scene, document.getElementById('Longueur').value);
            solarPanel.castShadow = true;
            solarPanel.receiveShadow = true;
            group.add(solarPanel);

            const selectedLampType = document.getElementById('lampType').value;
            const selectedLongueur = document.getElementById('Longueur').value;
            const selectedFormeLumiere = document.getElementById('formeLumiere').value;
            const { lampe } = create_lampes(scene, selectedLampType, selectedLongueur, selectedFormeLumiere);
            lampe.castShadow = true;
            lampe.receiveShadow = true;
            group.add(lampe);

            const lampPost = { group, lampe, solarPanel };
            lampPosts.push(lampPost);
            group.position.set(x, 0, z);
            return lampPost;
        }

        function updateLamp() {
            const selectedLampType = document.getElementById('lampType').value;
            const selectedLongueur = document.getElementById('Longueur').value;
            const selectedFormeLumiere = document.getElementById('formeLumiere').value;

            lampPosts.forEach(post => {
                post.group.remove(post.lampe);
                post.group.remove(post.solarPanel);
                scene.remove(post.lampe);
                scene.remove(post.solarPanel);

                const { lampe } = create_lampes(scene, selectedLampType, selectedLongueur, selectedFormeLumiere);
                const { solarPanel } = create_panneaux_sol(scene, selectedLongueur);

                lampe.castShadow = true;
                lampe.receiveShadow = true;
                solarPanel.castShadow = true;
                solarPanel.receiveShadow = true;

                post.group.add(lampe);
                post.group.add(solarPanel);
                post.lampe = lampe;
                post.solarPanel = solarPanel;
            });
        }

        document.getElementById('lampType').addEventListener('change', updateLamp);
        document.getElementById('Longueur').addEventListener('change', updateLamp);
        document.getElementById('formeLumiere').addEventListener('change', updateLamp);

        for (let i = -20; i <= 20; i += 10) {
            const lampPostLeft = createLampPost(-10, i);
            scene.add(lampPostLeft.group);
            lampsLeft.push(lampPostLeft);

            const lampPostRight = createLampPost(10, i);
            scene.add(lampPostRight.group);
            lampsRight.push(lampPostRight);
        }

        return { lampsLeft, lampsRight, updateLamp, updateFlamingoAnimations: (delta) => flamingos.forEach(f => f.update(delta)) };
    }
}