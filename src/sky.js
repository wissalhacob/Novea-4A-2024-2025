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

  // ☀️ Ajout d'un soleil visible
  let sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffcc00, emissive: 0xffaa00 })
  );
  scene.add(sunMesh);

  let effectController = {
    turbidity: 0.8,
    rayleigh: 1,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 20,
    azimuth: 180,
    exposure: 0.5,
    time: 0,
    cycleDuration: 60 * 60 * 24
  };

  let previousAmbientColor = new THREE.Color();
  let previousSunColor = new THREE.Color();

  // 📌 Création des éléments HTML pour l'horloge et Chorouq/Ghoroub
  let clockElement = document.createElement("div");
  clockElement.id = "clock";
  clockElement.style.position = "absolute";
  clockElement.style.top = "10px";
  clockElement.style.left = "10px";
  clockElement.style.fontSize = "24px";
  clockElement.style.color = "#fff";
  clockElement.style.padding = "10px";
  clockElement.style.background = "rgba(0, 0, 0, 0.5)";
  clockElement.style.borderRadius = "5px";
  document.body.appendChild(clockElement);

  let sunEventElement = document.createElement("div");
  sunEventElement.id = "sunEvent";
  sunEventElement.style.position = "absolute";
  sunEventElement.style.top = "50px";
  sunEventElement.style.left = "10px";
  sunEventElement.style.fontSize = "20px";
  sunEventElement.style.color = "#ffcc00";
  sunEventElement.style.padding = "10px";
  sunEventElement.style.background = "rgba(0, 0, 0, 0.5)";
  sunEventElement.style.borderRadius = "5px";
  sunEventElement.innerText = "";
  document.body.appendChild(sunEventElement);

  function updateClock() {
    const totalSeconds = effectController.time % effectController.cycleDuration;
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    clockElement.innerText = `🕒 ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    // 📌 Détection du lever et coucher du soleil
    if (effectController.elevation > -5 && effectController.elevation < 5) {
      sunEventElement.innerText = "🌅 Lever du soleil (Chorouq)";
    } else if (effectController.elevation > -15 && effectController.elevation < -5) {
      sunEventElement.innerText = "🌇 Coucher du soleil (Ghoroub)";
    } else {
      sunEventElement.innerText = "";
    }
  }

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

    renderer.toneMappingExposure = effectController.exposure;

    let daylightFactor = Math.max(0, Math.sin(phi));

    sunLight.intensity = 0.2 + daylightFactor * 1.2;
    ambientLight.intensity = 0.1 + daylightFactor * 0.6;

    let targetAmbientColor = new THREE.Color();
    let targetSunColor = new THREE.Color();

    if (effectController.elevation > 10) {
      targetSunColor.set(0xffffff);
    } else if (effectController.elevation > 0) {
      targetSunColor.set(0xffd27f);
    } else {
      targetSunColor.set(0x222244);
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

    // 🎨 Changement des couleurs du ciel selon l'heure
    if (effectController.elevation < -5) {
      scene.background = new THREE.Color(0x0a0a32); // Nuit
      sunMesh.visible = false;
    } else if (effectController.elevation < 5) {
      scene.background = new THREE.Color(0xff8800); // Coucher ou lever du soleil
      sunMesh.material.color.set(0xff5522);
      sunMesh.visible = true;
    } else {
      scene.background = new THREE.Color(0x87ceeb); // Bleu ciel de jour
      sunMesh.material.color.set(0xffff00);
      sunMesh.visible = true;
    }

    sunMesh.position.copy(sun.clone().multiplyScalar(100));

    updateClock(); // 🕒 Mettre à jour l'horloge et Chorouq/Ghoroub
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
    effectController.time += 400;
  }

  animateSky();
  return sky;
}
