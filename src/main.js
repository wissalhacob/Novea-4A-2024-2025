// Importation des fonctions nécessaires depuis d'autres modules JavaScript.
// `createScene` est une fonction qui configure la scène 3D, la caméra et le renderer.

import { createScene } from './scene'; 


// Fonction principale qui initie et gère le rendu de la scène.
function main() {
  // Création de la scène, de la caméra et du renderer via la fonction `createScene`.
  // Ces éléments sont retournés sous forme d'un objet destructuré.
  const { scene, camera, renderer } = createScene();



  // Fonction d'animation appelée en boucle pour rendre la scène en continu.
  function animate() {
    // Affiche la scène dans le renderer en utilisant la caméra pour déterminer le point de vue.
    renderer.render(scene, camera);

    // Planifie l'exécution continue de la fonction `animate` grâce à `requestAnimationFrame`.
    // Cela permet d'obtenir une animation fluide (synchronisée avec le rafraîchissement de l'écran).
    requestAnimationFrame(animate);
  }

  // Démarre l'animation en appelant la fonction `animate`.
  animate();
}

// Appel de la fonction principale `main` pour lancer l'application.
main();
