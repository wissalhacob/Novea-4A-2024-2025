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

  // 🌌 **Création des étoiles**
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
    elevation: 20,
    azimuth: 180,
    exposure: 0.5,
    time: 0,
    cycleDuration: 60 * 1000 // ⚡ Cycle complet de 24h en **1 minute** (60s)
  };

  let previousAmbientColor = new THREE.Color();
  let previousSunColor = new THREE.Color();

  // 📌 **Ajout du conteneur pour afficher l'heure**
  let timeContainer = document.createElement("div");
  timeContainer.id = "timeContainer";
  document.body.appendChild(timeContainer);

  let timeLabel = document.createElement("span");
  timeLabel.innerText = "Hour:";
  timeContainer.appendChild(timeLabel);

  let progressBar = document.createElement("div");
  progressBar.id = "progressBar";
  timeContainer.appendChild(progressBar);

  let progressFill = document.createElement("div");
  progressFill.id = "progressFill";
  progressBar.appendChild(progressFill);

  let timeDisplay = document.createElement("span");
  timeDisplay.id = "timeDisplay";
  timeContainer.appendChild(timeDisplay);

  // 📌 **Démarrer le cycle à 6h du matin**
  const startHour = 6; // Début du cycle à 6h du matin
  effectController.time = (startHour / 24) * effectController.cycleDuration;

  // 🔄 **Ajustement de la position initiale du soleil**
  const initialElapsedTime = (effectController.time % effectController.cycleDuration) / effectController.cycleDuration;
  const initialSinusoidalTime = Math.sin(initialElapsedTime * Math.PI * 2);
  effectController.elevation = 20 - 90 * initialSinusoidalTime;

  function updateSky(deltaTime) {
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sun);

    let daylightFactor = Math.max(0, Math.sin(phi));

    sunLight.intensity = 0.2 + daylightFactor * 1.2;
    ambientLight.intensity = 0.1 + daylightFactor * 0.6;

    let targetAmbientColor = new THREE.Color();
    let targetSunColor = new THREE.Color();

    if (effectController.elevation > 10) {
      targetSunColor.set(0x1E90FF);
    } else if (effectController.elevation > 0) {
      targetSunColor.set(0x1C1C3A);
    } else {
      targetSunColor.set(0x0a0a32);
    }

    lampsLeft.forEach(lampLeft => {
      if (lampLeft.lampe.update) {
        lampLeft.lampe.update(daylightFactor);
      }
    });
    lampsRight.forEach(lampRight => {
      if (lampRight.lampe.update) {
        lampRight.lampe.update(daylightFactor);
      }
    });

    if (effectController.elevation < 0) {
      targetAmbientColor.set(0x0a0a32);
    } else if (effectController.elevation < 10) {
      targetAmbientColor.set(0x1C1C3A);
    } else {
      targetAmbientColor.set(0x1E90FF);
    }

    renderer.toneMappingExposure = 0.3 + (daylightFactor * 0.7);

    ambientLight.color.lerpColors(previousAmbientColor, targetAmbientColor, deltaTime * 0.5);
    sunLight.color.lerpColors(previousSunColor, targetSunColor, deltaTime * 0.5);

    previousAmbientColor.copy(ambientLight.color);
    previousSunColor.copy(sunLight.color);

    stars.visible = effectController.elevation < 0;

    if (effectController.elevation < -10) {
      scene.background = new THREE.Color(0x0a0a32);
    } else if (effectController.elevation < 0) {
      scene.background = new THREE.Color(0x1C1C3A);
    } else {
      scene.background = new THREE.Color(0x1E90FF);
    }

    // 📌 **Mise à jour de l'heure dans le DOM**
    const totalSeconds = effectController.time % effectController.cycleDuration;
    const hours = Math.floor((totalSeconds / effectController.cycleDuration) * 24);
    const minutes = Math.floor(((totalSeconds / effectController.cycleDuration) * 1440) % 60);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    timeDisplay.innerText = formattedTime;

    const progressPercentage = (totalSeconds / effectController.cycleDuration) * 100;
    progressFill.style.width = `${progressPercentage}%`;
  }

  let lastTime = performance.now();

  function animateSky() {
    requestAnimationFrame(animateSky);

    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    const elapsedTime = (effectController.time % effectController.cycleDuration) / effectController.cycleDuration;
    const sinusoidalTime = Math.sin(elapsedTime * Math.PI * 2);

    effectController.elevation = 20 - 90 * sinusoidalTime;

    if (effectController.elevation > 30) {
      effectController.exposure = Math.min(1.2, effectController.exposure + 0.02);
    } else if (effectController.elevation <= 0) {
      effectController.exposure = 0.5;
    } else {
      effectController.exposure = 0.8;
    }

    updateSky(deltaTime);
    effectController.time += deltaTime * (effectController.cycleDuration / 60); // 🔄 Ajuste la vitesse du cycle
  }

  animateSky();
  return sky;
}
