import * as THREE from 'three'; 
import { create_panneaux_sol } from './panneaux_sol';
import { create_lampes } from './lampes';

export function createRoad(scene) {
    const textureLoader = new THREE.TextureLoader();

    // Création de la route
    const roadGeometry = new THREE.BoxGeometry(12, 0.1, 200);
    const roadTexture = textureLoader.load('/models/source/route_texture.png');
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.minFilter = THREE.LinearFilter;
    roadTexture.magFilter = THREE.LinearFilter;
    roadTexture.repeat.set(1, 1);
    const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.y = 0.05;
    road.receiveShadow = true;
    scene.add(road);

    // Création du sol
    const groundGeometry = new THREE.BoxGeometry(1000, 0.1, 1000);
    const groundTexture = textureLoader.load('/models/source/ground_texture.png');
    groundTexture.repeat.set(500, 500);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);



    const lampPosts = [];

    function createLampPost(x, z) {
        const group = new THREE.Group();

        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 4;
        pole.castShadow = true;
        pole.receiveShadow = true;
        group.add(pole);

        const { solarPanel } = create_panneaux_sol(scene);
        solarPanel.castShadow = true;
        solarPanel.receiveShadow = true;
        group.add(solarPanel);

        // Création de la lampe
        const lampGroup = create_lampes(scene, document.getElementById('lampType').value);
        const { lampe } = lampGroup;
        lampe.castShadow = true;
        lampe.receiveShadow = true;
        group.add(lampe);

        // Stocke la référence de la lampe dans l'objet lampPost
        const lampPost = { group, lampe, lampGroup };
        lampPosts.push(lampPost);

        group.position.set(x, 0, z);
        return lampPost;
    }  

    const lampsLeft = [];
    const lampsRight = [];

    // Ajout des lampadaires initiaux
    for (let i = -20; i <= 20; i += 10) {
        const lampPostLeft = createLampPost(-5, i);
        scene.add(lampPostLeft.group);
        lampsLeft.push(lampPostLeft);
        const lampPostRight = createLampPost(5, i);
        scene.add(lampPostRight.group);
        lampsRight.push(lampPostRight);
    }

    return { lampsLeft, lampsRight };
}
