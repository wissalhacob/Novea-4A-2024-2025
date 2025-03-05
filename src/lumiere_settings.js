import * as THREE from 'three';
import * as dat from 'dat.gui';

// Vérifie si THREEx est défini
var THREEx = THREEx || {};
THREEx.DayNight = {};

// Définition de la phase actuelle
THREEx.DayNight.currentPhase = function (sunAngle) {
    if (Math.sin(sunAngle) > Math.sin(0)) {
        return 'day';
    } else if (Math.sin(sunAngle) > Math.sin(-Math.PI / 6)) {
        return 'twilight';
    } else {
        return 'night';
    }
};

// 🌌 Création du ciel étoilé
THREEx.DayNight.StarField = function () {
    var texture = new THREE.TextureLoader().load('src/galaxy_starfield.png');
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        color: 0x808080,
    });
    var geometry = new THREE.SphereGeometry(1000, 64, 64);
    var mesh = new THREE.Mesh(geometry, material);
    this.object3d = mesh;

    this.update = function (sunAngle) {
        var phase = THREEx.DayNight.currentPhase(sunAngle);
        mesh.visible = phase === 'night';
        mesh.rotation.y = sunAngle / 5;
    };
};

// ☀️ Lumière directionnelle du Soleil
THREEx.DayNight.SunLight = function () {
    var light = new THREE.DirectionalLight(0xffffff, 1);
    this.object3d = light;

    this.update = function (sunAngle) {
        light.position.set(0, Math.sin(sunAngle) * 90000, Math.cos(sunAngle) * 90000);
        var phase = THREEx.DayNight.currentPhase(sunAngle);
        light.intensity = phase === 'day' ? 1.5 : (phase === 'twilight' ? 0.5 : 0);
    };
};

// 🌞 Soleil visible
THREEx.DayNight.SunSphere = function () {
    var geometry = new THREE.SphereGeometry(10, 32, 32); // Soleil plus petit
    var material = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
    var mesh = new THREE.Mesh(geometry, material);
    var sunLight = new THREE.PointLight(0xffdd44, 2, 1000);
    mesh.add(sunLight);
    this.object3d = mesh;
    this.sunLight = sunLight;

    this.update = function (sunAngle) {
        mesh.position.set(0, Math.sin(sunAngle) * 400, Math.cos(sunAngle) * 400);
        sunLight.position.copy(mesh.position);
        var phase = THREEx.DayNight.currentPhase(sunAngle);
        mesh.visible = phase !== 'night';
        sunLight.intensity = phase === 'day' ? 2 : (phase === 'twilight' ? 0.5 : 0);
    };
};

// 🌄 Création du dôme du ciel
THREEx.DayNight.Skydom = function () {
    var geometry = new THREE.SphereGeometry(700, 64, 32);
    var material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vWorldPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(h, 0.6), 0.0)), 1.0);
            }
        `,
        uniforms: {
            topColor: { value: new THREE.Color(0x0078ff) },
            bottomColor: { value: new THREE.Color(0xffdd55) },
        },
        side: THREE.BackSide,
    });
    var mesh = new THREE.Mesh(geometry, material);
    this.object3d = mesh;

    this.update = function (sunAngle) {
        var phase = THREEx.DayNight.currentPhase(sunAngle);
        if (phase === 'day') {
            material.uniforms.topColor.value.set(0x0078ff);
            material.uniforms.bottomColor.value.set(0xffdd55);
        } else if (phase === 'twilight') {
            material.uniforms.topColor.value.set(0xff8c00);
            material.uniforms.bottomColor.value.set(0x222244);
        } else {
            material.uniforms.topColor.value.set(0x000000);
            material.uniforms.bottomColor.value.set(0x000000);
        }
    };
};

// 🌅 Création du Système Jour/Nuit
export function create_lumiere_ui(scene, camera) {
    const gui = new dat.GUI();
    const params = {
        heure: 12,
        autoCycle: false,
        vitesseCycle: 0.01,
    };
    gui.add(params, 'heure', 0, 24, 0.1).name("Heure").onChange(updateLights).listen();
    gui.add(params, 'autoCycle').name("Cycle Automatique");
    
    let sunLight = new THREEx.DayNight.SunLight();
    let sunSphere = new THREEx.DayNight.SunSphere();
    let skyDome = new THREEx.DayNight.Skydom();
    let starField = new THREEx.DayNight.StarField();

    scene.add(sunLight.object3d);
    scene.add(sunSphere.object3d);
    scene.add(skyDome.object3d);
    scene.add(starField.object3d);

    function updateLights() {
        const sunAngle = ((params.heure - 6) / 24) * Math.PI * 2;
        sunLight.update(sunAngle);
        sunSphere.update(sunAngle);
        skyDome.update(sunAngle);
        starField.update(sunAngle);
    }

    function animateCycle() {
        if (params.autoCycle) {
            params.heure += params.vitesseCycle;
            if (params.heure >= 24) params.heure = 0;
            updateLights();
        }
        requestAnimationFrame(animateCycle);
    }

    updateLights();
    animateCycle();
}
export { THREEx };

