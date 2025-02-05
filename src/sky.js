import * as THREE from 'three';
<<<<<<< HEAD
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GUI } from 'dat.gui';  // Assurez-vous d'importer le module GUI

export function createSky(scene, renderer) {
  let sky, sun;
  const gui = new GUI();

  gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '0';
    gui.domElement.style.right = '0';
    gui.domElement.style.zIndex = 15; 
  // Créer le ciel
  sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  sun = new THREE.Vector3();

  // Paramètres du GUI
  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
  };

  // Mise à jour du ciel en fonction des paramètres
  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
  }

  // Créer le GUI pour les paramètres du ciel

  gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
  gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
  gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
  gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
  gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
  gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
  gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);
  console.log(gui.domElement);  // Vérifiez si l'élément est créé

  guiChanged();  // Initialiser les valeurs du GUI

  // Retourner l'objet sky pour d'éventuelles manipulations futures
  return sky;
=======
import * as dat from 'dat.gui';

// Fonction pour ajouter des nuages avec contrôle utilisateur
export function create_sky_with_clouds(scene) {
    const gui = new dat.GUI();
    const params = {
        cloudDensity: 20, // Nombre de nuages
        cloudOpacity: 0.7, // Transparence des nuages
    };

    gui.add(params, 'cloudDensity', 5, 50, 1).name("Densité des Nuages").onChange(createClouds);
    gui.add(params, 'cloudOpacity', 0.1, 1.0, 0.05).name("Opacité des Nuages").onChange(updateCloudOpacity);

    const cloudTexture = new THREE.TextureLoader().load('./sky1.png');
    const clouds = [];

    function createClouds() {
        // Supprimer les anciens nuages
        clouds.forEach(cloud => scene.remove(cloud));
        clouds.length = 10;

        for (let i = 0; i < params.cloudDensity; i++) {
            const cloudMaterial = new THREE.SpriteMaterial({ 
                map: cloudTexture, 
                transparent: true, 
                opacity: params.cloudOpacity,
            });
            const cloud = new THREE.Sprite(cloudMaterial);

            cloud.position.set(
                (Math.random() - 0.5) * 100,
                30 + Math.random() * 10, // Hauteur ajustée
                (Math.random() - 0.5) * 150
            );
            cloud.scale.set(20 + Math.random() * 10, 10 + Math.random() * 5, 1);
            scene.add(cloud);
            clouds.push(cloud);
        }
    }

    function updateCloudOpacity() {
        clouds.forEach(cloud => cloud.material.opacity = params.cloudOpacity);
    }

    createClouds();
>>>>>>> origin/lumierecanvav2
}
