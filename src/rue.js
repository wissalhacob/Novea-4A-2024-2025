<<<<<<< HEAD
import * as THREE from 'three';
import { create_panneaux_sol } from './panneaux_sol';
import { ajouterBrasLampadaire } from './ajouterBrasLampadaire.js';
import * as dat from 'dat.gui';
=======
import * as THREE from 'three'; 
import { create_panneaux_sol } from './panneaux_sol';
import { create_lampes } from './lampes';
>>>>>>> origin/main

export function createRoad(scene) {
    const textureLoader = new THREE.TextureLoader();

    // Création de la route
    const roadGeometry = new THREE.BoxGeometry(12, 0.1, 500);
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

<<<<<<< HEAD
  // Paramètres GUI
  const params = { 
      typeBras: "Combi Top1", 
      heure: 12, 
      densiteLumiere: 2,
      autoCycle: false
  };

  function createLampPost(x, z) {
    const group = new THREE.Group();

    // Création du poteau du lampadaire
    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 4;
    pole.castShadow = true;
    group.add(pole);

    // Ajout du panneau solaire
    const { solarPanel } = create_panneaux_sol(scene);
    solarPanel.scale.set(1.2, 1.2, 1.2); // 🔥 Augmentation de la taille du panneau
    group.add(solarPanel);
    group.solarPanel = solarPanel;

    // Ajouter le bras latéral sélectionné
    const brasLampadaire = ajouterBrasLampadaire(group, params.typeBras);
    group.brasLampadaire = brasLampadaire;

    group.position.set(x, 0, z);
    return group;
  }

  const lampPosts = [];
  for (let i = -20; i <= 20; i += 10) {
    const group = createLampPost(-5, i);
    scene.add(group);
    lampPosts.push(group);

    const groupRight = createLampPost(5, i);
    scene.add(groupRight);
    lampPosts.push(groupRight);
  }

  // Interface utilisateur (GUI)
  const gui = new dat.GUI();
  
  gui.add(params, 'typeBras', ["Combi Top1", "Combi Top2", "Combi Top3", "Combi Top5/5+", "Combi Top6"])
      .name("Choisir un Bras")
      .onChange(() => {
        lampPosts.forEach(lamp => {
          while (lamp.children.length > 2) { // Supprime l'ancien bras sans supprimer le panneau solaire
            lamp.remove(lamp.children[2]); 
          }
          lamp.brasLampadaire = ajouterBrasLampadaire(lamp, params.typeBras);
        });
      });

  const heureController = gui.add(params, 'heure', 0, 24, 0.1)
      .name("Heure")
      .onChange(() => {
        updateLampPostLights(params.heure, params.densiteLumiere);
      });

  gui.add(params, 'densiteLumiere', 0, 5, 0.1)
      .name("Densité Lumière")
      .onChange(() => {
        updateLampPostLights(params.heure, params.densiteLumiere);
      });

  gui.add(params, 'autoCycle')
      .name("Cycle Automatique");

  function updateLampPostLights(heure, densiteLumiere) {
    lampPosts.forEach(lamp => {
      if (lamp.brasLampadaire && lamp.brasLampadaire.update) {
        lamp.brasLampadaire.update(heure, densiteLumiere);
      }
    });
  }

  function animateCycle() {
    if (params.autoCycle) {
      params.heure += 0.05; // 🔥 Augmente progressivement l'heure
      if (params.heure >= 24) params.heure = 0; // 🔄 Revient à 0 quand 24h est atteinte

      // 🔥 Met à jour l'affichage GUI de l'heure automatiquement
      heureController.setValue(params.heure);

      updateLampPostLights(params.heure, params.densiteLumiere);
    }
    requestAnimationFrame(animateCycle);
  }

  animateCycle();
  updateLampPostLights(params.heure, params.densiteLumiere);
  return lampPosts;
=======
    // Création du sol
    const groundGeometry = new THREE.BoxGeometry(5000, 0.1, 5000);
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

        const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 30);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.25;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

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
        const lampPost = { group, lampe };
        lampPosts.push(lampPost);

        group.position.set(x, 0, z);
        return lampPost;
    }

    // Écouteur d'événement pour changer le type de lampe
    document.getElementById('lampType').addEventListener('change', function(event) {
        const selectedLampType = event.target.value;

        lampPosts.forEach(post => {
            // Supprime l'ancienne lampe du groupe
            post.group.remove(post.lampe);
            scene.remove(post.lampe);

            // Crée une nouvelle lampe et l'ajoute
            const newLampGroup = create_lampes(scene, selectedLampType);
            const { lampe } = newLampGroup;
            lampe.castShadow = true;
            lampe.receiveShadow = true;
            post.group.add(lampe);

            // Met à jour la référence de la lampe
            post.lampe = lampe;
        });
    });

    // Ajout des lampadaires initiaux
    for (let i = -20; i <= 20; i += 10) {
        const lampPostLeft = createLampPost(-5, i);
        scene.add(lampPostLeft.group);

        const lampPostRight = createLampPost(5, i);
        scene.add(lampPostRight.group);
    }
>>>>>>> origin/main
}




