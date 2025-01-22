import * as THREE from 'three'; // Importation de toutes les fonctionnalités nécessaires de Three.js

export function createScene() {
  // Création d'une nouvelle scène 3D
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Bleu ciel
  // Création d'une caméra perspective
  // - Champ de vision : 75°
  // - Ratio largeur/hauteur basé sur la taille de la fenêtre
  // - Distance de rendu minimum : 0.1, maximum : 1000
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Initialisation du renderer (moteur de rendu) avec WebGL
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio); // Ajuste la qualité en fonction du ratio d'écran
  renderer.setSize(window.innerWidth, window.innerHeight); // Définit la taille du rendu
  document.getElementById('render-target').appendChild(renderer.domElement); // Ajoute le rendu dans l'élément HTML

  // Ajout d'une lumière ponctuelle (source de lumière localisée)
  const light = new THREE.PointLight(0xffffff, 1, 100); // Couleur blanche, intensité 1, portée 100
  light.position.set(10, 10, 10); // Position de la lumière
  scene.add(light); // Ajout de la lumière à la scène
  
  // Ajout d'une lumière ambiante pour un éclairage général
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Couleur blanche, intensité 0.5
  scene.add(ambientLight); // Ajout à la scène

  // Variables pour la navigation de la caméra
  const DEG2RAD = Math.PI / 180; // Conversion des degrés en radians
  const AZIMUTH_SENSITIVITY = 0.2; // Sensibilité du mouvement horizontal de la caméra
  const ELEVATION_SENSITIVITY = 0.2; // Sensibilité du mouvement vertical de la caméra
  const ZOOM_SENSITIVITY = 0.002; // Sensibilité du zoom
  const MIN_CAMERA_RADIUS = 0.1; // Distance minimum entre la caméra et l'origine
  const MAX_CAMERA_RADIUS = 5; // Distance maximum entre la caméra et l'origine

  const cameraOrigin = new THREE.Vector3(0, 0, 0); // Point que la caméra regarde
  let cameraRadius = 10; // Distance initiale entre la caméra et l'origine
  let cameraAzimuth = 225; // Angle horizontal initial (azimut) de la caméra
  let cameraElevation = 45; // Angle vertical initial (élévation) de la caméra

  // Position initiale de la caméra
  camera.position.set(0, cameraRadius, 20);
  camera.lookAt(cameraOrigin);

  // Fonction pour mettre à jour la position de la caméra en fonction des paramètres
  function updateCameraPosition() {
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.add(cameraOrigin); // Centrer sur l'origine
    camera.lookAt(cameraOrigin); // Diriger la caméra vers l'origine
    camera.updateProjectionMatrix(); // Mettre à jour la matrice de projection
  }

  // Variables pour gérer l'interaction avec la souris
  let isMouseDown = false; // Indique si le clic gauche est maintenu
  let lastMouseX = 0; // Dernière position X de la souris
  let lastMouseY = 0; // Dernière position Y de la souris

  // Gestion du mouvement de la souris
  function onMouseMove(event) {
    if (isMouseDown) {
      const deltaX = event.clientX - lastMouseX; // Déplacement horizontal de la souris
      const deltaY = event.clientY - lastMouseY; // Déplacement vertical de la souris

      cameraAzimuth -= deltaX * AZIMUTH_SENSITIVITY; // Ajuste l'angle horizontal
      cameraElevation += deltaY * ELEVATION_SENSITIVITY; // Ajuste l'angle vertical

      // Limite l'élévation de la caméra entre -90° et 90°
      cameraElevation = Math.max(0, Math.min(90, cameraElevation));

      updateCameraPosition(); // Met à jour la position de la caméra
    }

    lastMouseX = event.clientX; // Met à jour la dernière position X
    lastMouseY = event.clientY; // Met à jour la dernière position Y
  }

  // Gestion du clic de souris
  function onMouseDown() {
    isMouseDown = true; // Active le suivi du mouvement
  }

  function onMouseUp() {
    isMouseDown = false; // Désactive le suivi du mouvement
  }

  // Gestion de la molette pour le zoom
  function onMouseScroll(event) {
    cameraRadius *= 1 + event.deltaY * ZOOM_SENSITIVITY; // Ajuste la distance de la caméra
    cameraRadius = Math.max(MIN_CAMERA_RADIUS, Math.min(MAX_CAMERA_RADIUS, cameraRadius)); // Limite le zoom
    updateCameraPosition(); // Met à jour la position de la caméra
  }

  // Gestion du redimensionnement de la fenêtre
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // Met à jour l'aspect de la caméra
    camera.updateProjectionMatrix(); // Met à jour la matrice de projection
    renderer.setSize(window.innerWidth, window.innerHeight); // Ajuste la taille du rendu
  }

  // Ajout des écouteurs d'événements pour l'interaction
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('wheel', onMouseScroll);
  window.addEventListener('resize', onResize);

  // Retourne les objets nécessaires (scène, caméra, et renderer)
  return { scene, camera, renderer };
}
