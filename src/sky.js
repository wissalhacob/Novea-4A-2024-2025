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

  // Stocke les couleurs précédentes pour une transition fluide
  let previousAmbientColor = new THREE.Color();
  let previousSunColor = new THREE.Color();

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

    if (effectController.elevation < 0) {
        targetAmbientColor.set(0x0a0a32);
    } else if (effectController.elevation < 10) {
        targetAmbientColor.set(0x202060);
    } else {
        targetAmbientColor.set(0xffffff);
    }

    // Interpolation des couleurs
    ambientLight.color.lerpColors(previousAmbientColor, targetAmbientColor, deltaTime * 0.5);
    sunLight.color.lerpColors(previousSunColor, targetSunColor, deltaTime * 0.5);

    previousAmbientColor.copy(ambientLight.color);
    previousSunColor.copy(sunLight.color);

    if (effectController.elevation < -10) {
        scene.background = new THREE.Color(0x000022);
    } else if (effectController.elevation < 0) {
        scene.background = new THREE.Color(0x202060);
    } else {
        scene.background = null;
    }
}

  let lastTime = performance.now();

  function animateSky() {
    requestAnimationFrame(animateSky);

    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime) / 1000; // Temps écoulé en secondes
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
    effectController.time += 120;
  }

  animateSky();
  return sky;
}
