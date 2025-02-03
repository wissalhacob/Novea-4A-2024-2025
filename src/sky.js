import * as THREE from 'three';
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
}
