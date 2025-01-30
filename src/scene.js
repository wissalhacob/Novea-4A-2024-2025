import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

  // Lumières
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(15, 20, 15);  // Moved light higher
  light.castShadow = true;  // Enable shadow casting
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Ground plane to receive shadows
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.ShadowMaterial({ opacity: 0.5 });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = - Math.PI / 2; // Horizontal
  ground.position.y = -1; // Slightly below
  ground.receiveShadow = true;
  scene.add(ground);

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

  // Fonction d'animation
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();

  return { scene, camera, renderer };
}
