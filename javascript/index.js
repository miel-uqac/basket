import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator} from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import {connexionEmailMotDePasse,creerCompte,surveillanceEtatAuthentification} from "./authentification";
import { fermerPopup } from "./ui";

// Configuration application Web FireBase
const firebaseConfig = {
  apiKey: "AIzaSyBOV4kut3iU7qaJ2PTR84wR9C0rjsXU2wY",
  authDomain: "truqac-test.firebaseapp.com",
  databaseURL: "https://truqac-test-default-rtdb.firebaseio.com",
  projectId: "truqac-test",
  storageBucket: "truqac-test.appspot.com",
  messagingSenderId: "1009872737120",
  appId: "1:1009872737120:web:e550a518bb497492a20405",
  measurementId: "G-X3Z94L3PF6"
};

// Variable d'initialisation de l'application, l'authentification, et de la base de données
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getDatabase(app);


// Connexion aux Emulateurs Firebase si l'application est exécutée en local
if (location.hostname === "127.0.0.1") {
  connectAuthEmulator(auth, "http://127.0.0.1:5002");
  connectDatabaseEmulator(db, "127.0.0.1", 8001);
}

// Chargement du JavaScript après le chargement de la page HTML
document.addEventListener('DOMContentLoaded', () => {
  
  const btnCreerCompte = document.querySelector("#btnCreerCompte") !== null;

  console.log(btnCreerCompte);
  if(btnCreerCompte){
    surveillanceEtatAuthentification();

    const btnCreationCompte = document.querySelector("#btnCreerCompte");
    btnCreationCompte.addEventListener("click", creerCompte);
    
  }
  else{
    surveillanceEtatAuthentification();

    const fermerPop = document.querySelector("#fermerPopup");
    fermerPop.addEventListener("click", fermerPopup)

    // Ajout des divers fonctions à un bouton de l'interface
    const btnConnexion = document.querySelector("#btnConnexion");
    btnConnexion.addEventListener("click", connexionEmailMotDePasse);


    const urlActuelle = window.location.href;
    const url = new URL(urlActuelle);

    const parametres = new URLSearchParams(url.search); 
    const popup = document.querySelector("#popup");



    if(parametres.has('envoyer')) {
      const parametre = parametres.get('envoyer');
      
      if(parametre === 'true'){
          popup.style.display = "block";
          
      }

    }


  }

});
