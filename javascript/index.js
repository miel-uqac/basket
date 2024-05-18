import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator} from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import {connexionEmailMotDePasse,creerCompte,surveillanceEtatAuthentification,deconnexion} from "./authentification";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// Connexion aux Emulateurs Firebase si l'application est exécutée en local
if (location.hostname === "127.0.0.1") {
  connectAuthEmulator(auth, "http://127.0.0.1:5002");
  connectDatabaseEmulator(db, "127.0.0.1", 8000);
}

// Chargement du JavaScript après le chargement de la page HTML
document.addEventListener('DOMContentLoaded', () => {

  surveillanceEtatAuthentification();

  // Ajout des divers fonctions à un bouton de l'interface
  const btnConnexion = document.querySelector("#btnConnexion");
  btnConnexion.addEventListener("click", connexionEmailMotDePasse);

  const btnCreationCompte = document.querySelector("#btnCreationCompte");
  btnCreationCompte.addEventListener("click", creerCompte);


  const btnDeconnexion = document.querySelector("#btnDeconnexion");
  btnDeconnexion.addEventListener("click", deconnexion);
});
