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

function showSpinner() {
    const spinner = document.getElementById('spinner-overlay');
    if (spinner) {
        spinner.style.display = 'flex';
        spinner.classList.remove('hidden');
    }
}

function hideSpinner() {
    const spinner = document.getElementById('spinner-overlay');
    if (spinner) {
        spinner.classList.add('hidden');
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 300);
    }
}

export function createRoad(scene) {
    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();

    const road = createRoadMesh(textureLoader);
    scene.add(road);

    const ground = createGroundMesh(textureLoader);
    scene.add(ground);

    createSidewalks(textureLoader, scene);

    const lampsLeft = [];
    const lampsRight = [];
    const lampPosts = [];

    function createLampPost(x, z) {
        const group = new THREE.Group();
        const isRightSide = x > 0;
        group.rotation.y = isRightSide ? Math.PI / 2 : -Math.PI / 2;

        const longueur = document.getElementById('Longueur').value;
        const { pole } = create_pole(scene, longueur);
        group.add(pole);

        const { solarPanel } = create_panneaux_sol(scene, longueur);
        solarPanel.castShadow = true;
        solarPanel.receiveShadow = true;
        group.add(solarPanel);

        const selectedLampType = document.getElementById('lampType').value;
        const selectedFormeLumiere = document.getElementById('formeLumiere').value;
        const { lampe } = create_lampes(scene, selectedLampType, longueur, selectedFormeLumiere);
        lampe.castShadow = true;
        lampe.receiveShadow = true;
        group.add(lampe);

        const lampPost = { group, lampe, solarPanel, pole };
        lampPosts.push(lampPost);

        group.position.set(x, 0, z);
        return lampPost;
    }

    function updateLamp() {
        showSpinner();
        setTimeout(() => {
            try {
                const longueur = document.getElementById('Longueur').value;
                const type = document.getElementById('lampType').value;
                const forme = document.getElementById('formeLumiere').value;

                lampPosts.forEach(post => {
                    // Nettoyer anciens éléments
                    post.group.remove(post.pole);
                    post.group.remove(post.lampe);
                    post.group.remove(post.solarPanel);
                    scene.remove(post.pole);
                    scene.remove(post.lampe);
                    scene.remove(post.solarPanel);

                    // Recréer
                    const { pole } = create_pole(scene, longueur);
                    const { solarPanel } = create_panneaux_sol(scene, longueur);
                    const { lampe } = create_lampes(scene, type, longueur, forme);

                    lampe.castShadow = lampe.receiveShadow = true;
                    solarPanel.castShadow = solarPanel.receiveShadow = true;

                    post.group.add(pole);
                    post.group.add(solarPanel);
                    post.group.add(lampe);

                    post.pole = pole;
                    post.solarPanel = solarPanel;
                    post.lampe = lampe;
                });
            } catch (error) {
                console.error('Error during lamp update:', error);
            } finally {
                hideSpinner();
            }
        }, 50);
    }

    // Ajout des lampadaires
    for (let i = -20; i <= 20; i += 10) {
        const left = createLampPost(-10, i);
        scene.add(left.group);
        lampsLeft.push(left);

        const right = createLampPost(10, i);
        scene.add(right.group);
        lampsRight.push(right);
    }

    // Mise à jour dynamique
    ['lampType', 'Longueur', 'formeLumiere'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateLamp);
    });

    const zPositions = [-150, -30, 70, 700];
    const xOffset = 100;

    const villa = new Villa(scene, gltfLoader, zPositions, xOffset);
    const cat = new Cat(scene, gltfLoader, zPositions, xOffset);
    const arbre = new Arbre(scene, gltfLoader);

    const lady1 = new Lady(scene, gltfLoader, '/models/source/lady.glb', -xOffset, zPositions[0] - 20, zPositions[1] - 20, 5, Math.PI);
    const lady2 = new Lady(scene, gltfLoader, '/models/source/lady4.glb', -xOffset - 20, zPositions[1] - 20, zPositions[0] - 20, -5, 0);
    const boy = new Boy(scene, gltfLoader, xOffset + 15, zPositions[0] - 15, zPositions[1] - 15, 5);

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
}

// Fonctions mesh
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
