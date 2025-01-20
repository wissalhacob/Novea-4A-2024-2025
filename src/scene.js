import * as THREE from 'three';

export function createScene() {
  // Scene and Renderer Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('render-target').appendChild(renderer.domElement);


  // Constants
  const DEG2RAD = Math.PI / 180;
  const AZIMUTH_SENSITIVITY = 0.2;
  const ELEVATION_SENSITIVITY = 0.2;
  const ZOOM_SENSITIVITY = 0.002;
  const MIN_CAMERA_RADIUS = 0.1;
  const MAX_CAMERA_RADIUS = 5;

  // Camera Initial State
  const cameraOrigin = new THREE.Vector3(0, 0, 0);
  let cameraRadius = 3;  // Initial distance from the center
  let cameraAzimuth = 225;
  let cameraElevation = 45;

  camera.position.set(0, cameraRadius, 10);
  camera.lookAt(cameraOrigin);

  // Update Camera Position
  function updateCameraPosition() {
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin);
    camera.updateProjectionMatrix();
  }

  // Event Handlers
  let isMouseDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  function onMouseMove(event) {
    if (isMouseDown) {
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;

      cameraAzimuth -= deltaX * AZIMUTH_SENSITIVITY;
      cameraElevation += deltaY * ELEVATION_SENSITIVITY;

      // Clamp the elevation to avoid extreme angles
      cameraElevation = Math.max(-90, Math.min(90, cameraElevation));

      updateCameraPosition();
    }

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }

  function onMouseDown() {
    isMouseDown = true;
  }

  function onMouseUp() {
    isMouseDown = false;
  }

  function onMouseScroll(event) {
    // Ajuster la distance en fonction du mouvement de la molette
    cameraRadius *= 1 + event.deltaY * ZOOM_SENSITIVITY;  // Inverser la direction du zoom
    cameraRadius = Math.max(MIN_CAMERA_RADIUS, Math.min(MAX_CAMERA_RADIUS, cameraRadius));
    updateCameraPosition();  // Mettre à jour la position de la caméra
}


  // Resize Handling
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Add Event Listeners
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('wheel', onMouseScroll);
  window.addEventListener('resize', onResize);

  // Return the scene and renderer for use in main.js
  return { scene, camera, renderer };
}
