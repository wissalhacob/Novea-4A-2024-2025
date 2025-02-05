import * as THREE from 'three'; // Importation de toutes les fonctionnalités nécessaires de Three.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Ajout de l'importation

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Bleu ciel
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('render-target').appendChild(renderer.domElement);

  // Lumières comme avant
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Initialisation d'OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.zoomSpeed = 0.5;
  controls.rotateSpeed = 1.0;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

  camera.position.set(0, 15, 20);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Fonction d'animation avec mise à jour des contrôles
  function animate() {
    controls.update(); // Mise à jour des contrôles (cela est nécessaire pour l'amortissement et les mouvements)
    renderer.render(scene, camera); // Rendu de la scène
    requestAnimationFrame(animate); // Boucle d'animation
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate(); // Démarre l'animation

  return { scene, camera, renderer };
}
