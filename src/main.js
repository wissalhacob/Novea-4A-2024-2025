import { createScene } from './scene';
import { createRoad } from './road';

// Fonction principale pour démarrer la scène
function main() {
  // Créer la scène en appelant la fonction createScene()
  const { scene, camera, renderer } = createScene();

  // Créer la route et l'ajouter à la scène
  createRoad(scene);

  // Fonction d'animation
  function animate() {
    // Vous pouvez ajouter d'autres animations ici si nécessaire
    renderer.render(scene, camera);
    requestAnimationFrame(animate); // Demande de la prochaine image
  }

  // Démarrer l'animation
  animate();

}

// Appeler la fonction main pour lancer le processus
main();
