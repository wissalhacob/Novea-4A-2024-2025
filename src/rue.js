import * as THREE from 'three'; 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { create_panneaux_sol } from './panneaux_sol';
import { create_lampes } from './lampes';
import { create_pole } from './poles';
import { animationActive } from './person.js';
import { animationActiveCar } from './car.js';
import { positionZ } from './person.js';
import { positionZCar } from './car.js';
import { Cat } from './cat';
import { Villa } from './villa';
import { Lady } from './lady';
import { Boy } from './boy';
import { Arbre } from './arbre';
import { Flamingo } from './flamingo';

function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return -1; // Retourne -1 si la valeur est invalide
    let [hours, minutes] = timeStr.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
}

function showSpinner() {
    const spinner = document.getElementById('spinner-overlay');
    if (spinner) {
        spinner.style.display = 'flex';
        spinner.classList.remove('hidden');
    }
  }
  
  function hideSpinner() {
    const spinner = document.getElementById('spinner-overlay');
    if (spinner) {
        spinner.classList.add('hidden');
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 300);
    }
  }

export function createRoad(scene) {

    const gltfLoader = new GLTFLoader();
    const zPositions = [-150, -30, 70, 700];
    const xOffset = 100;
    
    // Initialize models with animation mixers
    const villa = new Villa(scene, gltfLoader, zPositions, xOffset);
    const cat = new Cat(scene, gltfLoader, zPositions, xOffset);
    const arbre = new Arbre(scene, gltfLoader);

    // Create characters with animations
    const lady1 = new Lady(
        scene, 
        gltfLoader, 
        '/models/source/lady.glb', 
        -xOffset, 
        zPositions[0] - 20, 
        zPositions[1] - 20, 
        5, 
        Math.PI
    );

    const lady2 = new Lady(
        scene,
        gltfLoader,
        '/models/source/lady4.glb',
        -xOffset - 20,
        zPositions[1] - 20,
        zPositions[0] - 20,
        -5,
        0
    );
    
    const boy = new Boy(
        scene,
        gltfLoader,
        xOffset + 15,
        zPositions[0] - 15,
        zPositions[1] - 15,
        5
    );

    // Create flamingos with animations
    const flamingos = [
        new Flamingo(scene, gltfLoader, 50, -80),
        new Flamingo(scene, gltfLoader, 50, 80),
        new Flamingo(scene, gltfLoader, 60, -70),
        new Flamingo(scene, gltfLoader, 60, 70),
        new Flamingo(scene, gltfLoader, 55, -90),
        new Flamingo(scene, gltfLoader, 55, 90),
        new Flamingo(scene, gltfLoader, 60, 60),
        new Flamingo(scene, gltfLoader, 55, -50),
        new Flamingo(scene, gltfLoader, 60, 60)
    ];

    // Collect all animation mixers
    const allMixers = [
        ...(cat.mixers || []),
        ...flamingos.map(f => f.mixer).filter(m => m),
        ...(lady1.mixer ? [lady1.mixer] : []),
        ...(lady2.mixer ? [lady2.mixer] : []),
        ...(boy.mixer ? [boy.mixer] : [])
    ].filter(m => m);

    const textureLoader = new THREE.TextureLoader();
    const lampsLeft = [];
    const lampsRight = [];
    
    const roadGeometry = new THREE.BoxGeometry(12, 0.1, 200);
    const roadTexture = textureLoader.load('/models/texture/route_texture.png');
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.minFilter = THREE.LinearFilter;
    roadTexture.magFilter = THREE.LinearFilter;
    roadTexture.repeat.set(1, 1);
    const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.y = 0.05;
    road.receiveShadow = true;
    scene.add(road);

    // Création du sol
    const groundGeometry = new THREE.BoxGeometry(1000, 0.1, 1000);
    const groundTexture = textureLoader.load('/models/texture/ground_texture.png');
    groundTexture.repeat.set(500, 500);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Création des trottoirs
    const sidewalkGeometry = new THREE.BoxGeometry(2, 0.1, 200);
    const sidewalkTexture = textureLoader.load('/models/texture/sidewalk_texture.jpg');
    sidewalkTexture.wrapS = THREE.RepeatWrapping;
    sidewalkTexture.wrapT = THREE.RepeatWrapping;
    sidewalkTexture.minFilter = THREE.LinearFilter;
    sidewalkTexture.magFilter = THREE.LinearFilter;
    sidewalkTexture.repeat.set(1, 100);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ map: sidewalkTexture });

    const sidewalkLeft = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    sidewalkLeft.position.set(-7, 0.05, 0);
    sidewalkLeft.receiveShadow = true;
    scene.add(sidewalkLeft);

    const sidewalkRight = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    sidewalkRight.position.set(7, 0.05, 0);
    sidewalkRight.receiveShadow = true;
    scene.add(sidewalkRight);

    const lampPosts = [];
    function createLampPost(x, z) {
        const group = new THREE.Group();
        const isRightSide = x > 0;
        group.rotation.y = isRightSide ? Math.PI/2 : -Math.PI/2;
        const { pole } = create_pole(scene, document.getElementById('Longueur').value);
        group.add(pole);

        document.getElementById('Longueur').addEventListener('change', function(event) {
            const newPoleLength = event.target.value;

            lampPosts.forEach(post => {
                post.group.remove(post.pole);
                scene.remove(post.pole);

                const { pole } = create_pole(scene, newPoleLength);
                post.group.add(pole);
                post.pole = pole;
                post.poleLength = newPoleLength;
            });
        });

        const { solarPanel } = create_panneaux_sol(scene, document.getElementById('Longueur').value);
        solarPanel.castShadow = true;
        solarPanel.receiveShadow = true;
        group.add(solarPanel);

        // **Ajout des lampes avec la gestion des formes de lumière**
        const selectedLampType = document.getElementById('lampType').value;
        const selectedLongueur = document.getElementById('Longueur').value;
        const selectedFormeLumiere = document.getElementById('formeLumiere').value;
        
        
        const { lampe  } = create_lampes(scene, selectedLampType, selectedLongueur, selectedFormeLumiere);
        lampe.castShadow = true;
        lampe.receiveShadow = true;
        group.add(lampe);
        
        
        const lampPost = { group, lampe, solarPanel };
        lampPosts.push(lampPost);

        

        group.position.set(x, 0, z);
        return lampPost;
    }

    function updateLamp() {
        showSpinner();
        setTimeout(() => {
            try {
        const selectedLampType = document.getElementById('lampType').value;
        const selectedLongueur = document.getElementById('Longueur').value;
        const selectedFormeLumiere = document.getElementById('formeLumiere').value;

        lampPosts.forEach(post => {
            post.group.remove(post.lampe);
            post.group.remove(post.solarPanel);
            scene.remove(post.lampe);
            scene.remove(post.solarPanel);

            const { lampe } = create_lampes(scene, selectedLampType, selectedLongueur, selectedFormeLumiere);
            const { solarPanel } = create_panneaux_sol(scene, selectedLongueur);

            lampe.castShadow = true;
            lampe.receiveShadow = true;
            solarPanel.castShadow = true;
            solarPanel.receiveShadow = true;

            post.group.add(lampe);
            post.group.add(solarPanel);
            post.lampe = lampe;
            post.solarPanel = solarPanel;
        });
    } catch (error) {
      console.error('Error during lamp update:', error);
    } finally {
      hideSpinner(); // Cacher le spinner une fois les opérations terminées
    }
  }, 50);
    }

    // **Ajout des événements pour la mise à jour dynamique des lampadaires**
    document.getElementById('lampType').addEventListener('change', () => {
        showSpinner();
        setTimeout(updateLamp, 50);
    });
    
    document.getElementById('Longueur').addEventListener('change', () => {
        showSpinner();
        setTimeout(updateLamp, 50);
    });
    
    document.getElementById('formeLumiere').addEventListener('change', () => {
        showSpinner();
        setTimeout(updateLamp, 50);
    });


    
    // **Ajout des lampadaires à gauche et à droite**
    for (let i = -20; i <= 20; i += 10) {
        const lampPostLeft = createLampPost(-10, i);
        scene.add(lampPostLeft.group);
        lampsLeft.push(lampPostLeft);

        const lampPostRight = createLampPost(10, i);
        scene.add(lampPostRight.group);
        lampsRight.push(lampPostRight);
    }
   

    let currentTime = "00:00"; 
    let timeDisplayElement = document.getElementById('timeDisplay');

    let startTimeInMinutes = 420; // 07:00
    let endTimeInMinutes = 1140; // 19:00

    setInterval(() => {
        if (timeDisplayElement && timeDisplayElement.innerText.trim() !== "") {
            currentTime = timeDisplayElement.innerText; 
            
            const currentTimeInMinutes = timeToMinutes(currentTime);
            if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
                lampsLeft.forEach((lampPost) => {                              
                        lampPost.lampe.userData.rectLight.intensity = 0;
                        lampPost.lampe.userData.spotLight.intensity = 0;
                    }   
                );
                lampsRight.forEach((lampPost) => {                 
                        lampPost.lampe.userData.rectLight.intensity = 0;
                        lampPost.lampe.userData.spotLight.intensity = 0;
                    }    
                );
            } else {
                lampsLeft.forEach((lampPost) => {                              
                        lampPost.lampe.userData.rectLight.intensity =6;
                        lampPost.lampe.userData.spotLight.intensity = 6;
                    }   
                );
                lampsRight.forEach((lampPost) => {                 
                        lampPost.lampe.userData.rectLight.intensity =6;
                        lampPost.lampe.userData.spotLight.intensity = 6;
                    }    
                );
            }

            for (let i = 1; i <= 5; i++) {
                ["mode", "start", "end", "power"].forEach(attr => {
                    document.getElementById(`${attr}${i}`).addEventListener("input", function () {
                        applyLightingMode(i);
                    });
                });
                applyLightingMode(i);
    
        }
        }
    } ,0.001);

    function applyLightingMode(phase) {
            
            const mode = document.getElementById(`mode${phase}`).value;
            const startTime = document.getElementById(`start${phase}`).value;
            const endTime = document.getElementById(`end${phase}`).value;
            const power = document.getElementById(`power${phase}`).value;
    
            const currentTimeInMinutes = timeToMinutes(currentTime);
            const startTimeInMinutes = timeToMinutes(startTime);
            const endTimeInMinutes = timeToMinutes(endTime);
        
            const isInTimeRange = (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes);

    
        if (mode === "detection" && isInTimeRange) {
            if (animationActive  ) {  
                            lampsLeft.forEach((lampPost) => {                              
                                    if (lampPost.group.position.z<= positionZ) { 

                                        lampPost.lampe.userData.rectLight.intensity =  (power / 100) * 12;
                                        lampPost.lampe.userData.spotLight.intensity =  (power / 100) * 12;
                                    }   
                                    else{
                                            lampPost.lampe.userData.rectLight.intensity =  0;
                                            lampPost.lampe.userData.spotLight.intensity = 0;
                                    }    
                            });
                    
                            lampsRight.forEach((lampPost) => {                 
                                    if (lampPost.group.position.z<= positionZ) { 
                                        lampPost.lampe.userData.rectLight.intensity =  (power / 100) * 12;
                                        lampPost.lampe.userData.spotLight.intensity =  (power / 100) * 12;
                                    }     
                                    else{

                                            lampPost.lampe.userData.rectLight.intensity =  0;
                                            lampPost.lampe.userData.spotLight.intensity = 0;
                                
                                    }    
                                        
                            });
                        }
            

                if (animationActiveCar ) {  
                    lampsLeft.forEach((lampPost) => {                              
                            if (lampPost.group.position.z >= positionZCar){ 
                                console.log(lampPost.group.position.z);
                                lampPost.lampe.userData.rectLight.intensity =  (power / 100) * 12;
                                lampPost.lampe.userData.spotLight.intensity =  (power / 100) * 12;
                            }  
                            else{
   
                                    lampPost.lampe.userData.rectLight.intensity =  0;
                                    lampPost.lampe.userData.spotLight.intensity = 0;
                            
                            }    
                                
                               
                    });
            
                    lampsRight.forEach((lampPost) => {                 
                            if (lampPost.group.position.z>= positionZCar) { 
                                lampPost.lampe.userData.rectLight.intensity =  (power / 100) * 12;
                                lampPost.lampe.userData.spotLight.intensity =  (power / 100) * 12;
                            }  
                            else{
 
                                    lampPost.lampe.userData.rectLight.intensity =  0;
                                    lampPost.lampe.userData.spotLight.intensity = 0;
                          
                            }    
                                     
                                
                    });
                }
                if (animationActive===false && animationActiveCar===false ){
                    lampsRight.forEach((lampPost) => { 
                        lampPost.lampe.userData.rectLight.intensity =  0;
                        lampPost.lampe.userData.spotLight.intensity = 0;
                          
                   });
                   lampsLeft.forEach((lampPost) => { 
                    lampPost.lampe.userData.rectLight.intensity =  0;
                    lampPost.lampe.userData.spotLight.intensity = 0;
                      
               });
                }
            
        }
        else if (mode === "Permanant" && isInTimeRange) {
            lampsLeft.forEach((lampPost) => {                              
                    lampPost.lampe.userData.rectLight.intensity =  (power / 100) * 12;
                    lampPost.lampe.userData.spotLight.intensity =  (power / 100) * 12;

                }   
            );
            lampsRight.forEach((lampPost) => {                 
                    lampPost.lampe.userData.rectLight.intensity =  (power / 100) * 12;
                    lampPost.lampe.userData.spotLight.intensity =  (power / 100) * 12;

                }    
            );
        }
        else if (mode=="Eteint" && isInTimeRange) {
            lampsLeft.forEach((lampPost) => {                              
                    lampPost.lampe.userData.rectLight.intensity =  0;
                    lampPost.lampe.userData.spotLight.intensity =  0;

                }   
            );
            lampsRight.forEach((lampPost) => {                 
                    lampPost.lampe.userData.rectLight.intensity =  0;
                    lampPost.lampe.userData.spotLight.intensity =  0;

                }    
            );
        }
           
            
    }
    
        setInterval(() => {
            if (timeDisplayElement && timeDisplayElement.innerText.trim() !== "") {
                currentTime = timeDisplayElement.innerText; 
                for (let i = 1; i <= 5; i++) {
                    ["mode", "start", "end", "power"].forEach(attr => {
                        document.getElementById(`${attr}${i}`).addEventListener("input", function () {
                            console.log(`${attr}${i}`);
                            console.log(document.getElementById(`${attr}${i}`).value);
                            console.log("applyLightingMode");
                                applyLightingMode(i); 
                        });
                    });
                    applyLightingMode(i);
            }
            }
        }
        , 0.001); 
        
        function updateAnimations(delta) {
            // Update all mixers
            allMixers.forEach(mixer => {
                if (mixer && typeof mixer.update === 'function') {
                    mixer.update(delta);
                }
            });
    
            // Update specific character behaviors
            if (cat && typeof cat.update === 'function') {
                cat.update(delta);
            }
            if (lady1 && typeof lady1.update === 'function') {
                lady1.update(delta, cat?.cats || []);
            }
            if (lady2 && typeof lady2.update === 'function') {
                lady2.update(delta, cat?.cats || []);
            }
            if (boy && typeof boy.update === 'function') {
                boy.update(delta, cat?.cats || []);
            }
            if (arbre && typeof arbre.update === 'function') {
                arbre.update(delta);
            }
            
            // Update flamingos
            flamingos.forEach(f => {
                if (f && typeof f.update === 'function') {
                    f.update(delta);
                }
            });
        }
    
        return {
            lampsLeft,
            lampsRight,
            mixers: allMixers,
            updateAnimations,  
            cleanup: () => {
                clearInterval(lightingUpdateInterval);
            } };
}
