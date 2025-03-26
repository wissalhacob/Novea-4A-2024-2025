import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { createRoad } from './rue.js';

export function createSky(scene, renderer) {
  let sky = new Sky();
  sky.scale.setScalar(4000);
  scene.add(sky);
  const { lampsLeft, lampsRight } = createRoad(scene);

  let sun = new THREE.Vector3();
  let ambientLight = new THREE.AmbientLight(0x222222, 0.5);
  scene.add(ambientLight);

  let sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.set(0, 100, 0);
  scene.add(sunLight);

  const starsGeometry = new THREE.BufferGeometry();
  const starsVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  stars.visible = false;
  scene.add(stars);

  let effectController = {
    turbidity: 0.5,
    rayleigh: 0.2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: -900,
    azimuth: 180,
    exposure: 0.5,
    time: 0,
    cycleDuration: 60 * 1000 // 1 minute = 24h (30s jour + 30s nuit)
  };

  let previousAmbientColor = new THREE.Color();
  let previousSunColor = new THREE.Color();

  
  let timeContainer = document.createElement("div");
  timeContainer.id = "timeContainer";
  document.body.appendChild(timeContainer);

  let timeDisplay = document.createElement("span");
  timeDisplay.id = "timeDisplay";
  timeContainer.appendChild(timeDisplay);

  effectController.time = 0;

  function updateSky(deltaTime) {
    const cycleProgress = (effectController.time % effectController.cycleDuration) / effectController.cycleDuration;
    const adjustedCycleProgress = Math.pow(cycleProgress, 1.2); 
    const sinusoidalTime = Math.sin((adjustedCycleProgress - 0.25) * Math.PI * 2);

    effectController.elevation = -9000000 + 180 * sinusoidalTime;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(3, phi, theta);
    sky.material.uniforms['sunPosition'].value.copy(sun);

    let daylightFactor = Math.max(0, Math.sin(phi));

    sunLight.intensity = 0.3 + daylightFactor * 1.5;
    ambientLight.intensity = 0.2 + daylightFactor * 0.7;

    stars.visible = effectController.elevation < 0;

    scene.background = new THREE.Color(effectController.elevation < -10 ? 0x080820 :
                                       effectController.elevation < -2 ? 0x0a0a32 :
                                       effectController.elevation < 0 ? 0x1C1C3A : 0x1E90FF);

    const offsetHours = 0;
    let hours = Math.floor((cycleProgress * 24 + offsetHours) % 24);
    let minutes = Math.floor((cycleProgress * 1440) % 60);

    const formattedTime = `${hours.toString().padStart(1, "0")}:${minutes.toString().padStart(1, "0")}`;
    timeDisplay.innerText = formattedTime;
  }
  let isRunning = false;

  let lastTime = performance.now();

  function animateSky() {
    if (isRunning) {
    requestAnimationFrame(animateSky);

    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime) / 2000;
    lastTime = currentTime;

    updateSky(deltaTime);
    effectController.time += deltaTime * (effectController.cycleDuration / 60);
    if (effectController.time >= effectController.cycleDuration) {
      effectController.time = 0;
    }
  }
  }
  let runState = document.getElementById("buttonIcon");

  if (runState) { // Vérifier si l'élément existe
    runState.addEventListener("click", function () {
      if (runState.innerText.trim() === "▶") {
        isRunning = true;
        lastTime = performance.now();
        animateSky();
        runState.innerText = "■"; 
      } else {
        isRunning = false;
        runState.innerText = "▶"; 
      }
    });
  } 

  animateSky();
  return sky;
}
