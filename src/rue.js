import * as THREE from 'three'; 
import { create_panneaux_sol } from './panneaux_sol';
import { create_lampes } from './lampes';
import { create_pole } from './poles';

export function createRoad(scene) {
    const textureLoader = new THREE.TextureLoader();

    // Création de la route
    const roadGeometry = new THREE.BoxGeometry(12, 0.1, 200);
    const roadTexture = textureLoader.load('/models/texture/route_texture.png');
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
    const groundTexture = textureLoader.load('/models/texture/ground_texture.png');
    groundTexture.repeat.set(500, 500);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Création des trottoirs
    const sidewalkGeometry = new THREE.BoxGeometry(2, 0.1, 200);
    const sidewalkTexture = textureLoader.load('/models/texture/sidewalk_texture.jpg');
    sidewalkTexture.wrapS = THREE.RepeatWrapping;
    sidewalkTexture.wrapT = THREE.RepeatWrapping;
    sidewalkTexture.minFilter = THREE.LinearFilter;
    sidewalkTexture.magFilter = THREE.LinearFilter;
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

    const lampPosts = [];

    function createLampPost(x, z) {
        const group = new THREE.Group();
        const { pole } = create_pole(scene, document.getElementById('Longueur').value);
        group.add(pole);

        document.getElementById('Longueur').addEventListener('change', function(event) {
            const newPoleLength = event.target.value;

            lampPosts.forEach(post => {
                post.group.remove(post.pole);
                scene.remove(post.pole);

                const { pole } = create_pole(scene, newPoleLength);
                post.group.add(pole);
                post.pole = pole;
                post.poleLength = newPoleLength;
            });
        });

        const { solarPanel } = create_panneaux_sol(scene, document.getElementById('Longueur').value);
        solarPanel.castShadow = true;
        solarPanel.receiveShadow = true;
        group.add(solarPanel);

        // **Ajout des lampes avec la gestion des formes de lumière**
        const selectedLampType = document.getElementById('lampType').value;
        const selectedLongueur = document.getElementById('Longueur').value;
        const selectedFormeLumiere = document.getElementById('formeLumiere').value;
        
        const { lampe } = create_lampes(scene, selectedLampType, selectedLongueur, selectedFormeLumiere);
        lampe.castShadow = true;
        lampe.receiveShadow = true;
        group.add(lampe);

        // Ajout des lampadaires
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

    // **Ajout des événements pour la mise à jour dynamique des lampadaires**
    document.getElementById('lampType').addEventListener('change', updateLamp);
    document.getElementById('Longueur').addEventListener('change', updateLamp);
    document.getElementById('formeLumiere').addEventListener('change', updateLamp);

    const lampsLeft = [];
    const lampsRight = [];

    // **Ajout des lampadaires à gauche et à droite**
    for (let i = -20; i <= 20; i += 10) {
        const lampPostLeft = createLampPost(-10, i);
        scene.add(lampPostLeft.group);
        lampsLeft.push(lampPostLeft);

        const lampPostRight = createLampPost(10, i);
        scene.add(lampPostRight.group);
        lampsRight.push(lampPostRight);
    }

    return { lampsLeft, lampsRight };
}
