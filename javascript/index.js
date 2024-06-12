import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator} from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import {connexionEmailMotDePasse,creerCompte,surveillanceEtatAuthentification, verifierEmailUtilisateur, nouveauLienVerification,motDePasseOublier, modifierMotDePasse, deconnexionRedirection,ChargementPage} from "./authentification";
import { accueilPage,fermerModale, afficherMotDePasse, etatConnexion} from "./ui";

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
  
  const connexion = document.querySelector("#connexion") !== null;
  const Inscription = document.querySelector("#Inscription") !== null;
  const validation = document.querySelector("#validation") !== null;
  const validationConfirmer = document.querySelector("#validationConfirmer") !== null;
  const nouveauLienEmailVerification = document.querySelector("#EmailVerification") !== null;
  const MotDePasseOublier = document.querySelector("#motDePasseOublier") !== null;
  const emailNonVerifier = document.querySelector("#emailNonVerifier") !== null;


  if(Inscription){
    surveillanceEtatAuthentification();

    const btnCreationCompte = document.querySelector("#btnCreerCompte");
    btnCreationCompte.addEventListener("click", creerCompte);

    
    var checkbox = document.querySelector('#AfficherMotDePasse');
    var passwordInput = document.querySelector('#txtMotDePasse');
    afficherMotDePasse(checkbox,passwordInput);

    passwordInput = document.querySelector('#txtConfirmerMotDePasse');    
    afficherMotDePasse(checkbox,passwordInput);

    
  }
  else if(connexion){
    surveillanceEtatAuthentification();

    const urlParametres = new URLSearchParams(window.location.search);
    const envoyerEmail = urlParametres.get('envoyer');
    const mode = urlParametres.get('mode');
    const envoyerEmailPassword = urlParametres.get('motDePasseEnvoyer');
    const oobCode = urlParametres.get('oobCode');
    const fermerModal = document.querySelector("#close");
    const modificationMDP = urlParametres.get('modificationMDP');

    fermerModal.addEventListener('click', fermerModale);

    const checkbox = document.querySelector('#AfficherMotDePasse');
    const passwordInput = document.querySelector('#txtMotDePasse');
    afficherMotDePasse(checkbox,passwordInput);

    if(envoyerEmail === 'true'){
      const emailModal = document.querySelector("#emailModal");
      const txtPremier = document.querySelector('#txtPremier');
      txtPremier.textContent = 'Email de vérification envoyé avec succès !';
      const txtDeuxieme = document.querySelector('#txtDeuxieme');
      txtDeuxieme.textContent = 'Si vous ne le trouvez pas, vérifiez dans vos courriers indésirables.';
      emailModal.style.display = 'block';
    }
    else if(envoyerEmailPassword === 'true'){
      const emailModal = document.querySelector("#emailModal");
      const txtPremier = document.querySelector('#txtPremier');
      txtPremier.textContent = 'Email de réinitialisation du mot de passe envoyé avec succès !';
      const txtDeuxieme = document.querySelector('#txtDeuxieme');
      txtDeuxieme.textContent = 'Si vous ne le trouvez pas, vérifiez dans vos courriers indésirables.';
      emailModal.style.display = 'block';
    }
    else if(mode === 'verifyEmail'){
        verifierEmailUtilisateur(oobCode);
    }
    else if(mode === 'resetPassword'){
        const formulaireConnexion = document.querySelector("#connexion");
        const ModifierMotDePasse = document.querySelector("#ModifierMotDePasse");
        const btnChangerMotDePasse = document.querySelector("#btnChangerMotDePasse");

        formulaireConnexion.style.display = 'none';
        ModifierMotDePasse.style.display = 'block';

        let checkbox = document.querySelector('#AfficherNouveauMotDePasse');
        let passwordInput = document.querySelector('#txtNouveauMotDePasse');
        afficherMotDePasse(checkbox,passwordInput);
    
        checkbox = document.querySelector('#AfficherNouveauMotDePasse');
        passwordInput = document.querySelector('#txtConfirmerNouveauMotDePasse');
        afficherMotDePasse(checkbox,passwordInput);
        btnChangerMotDePasse.addEventListener('click', (event) => modifierMotDePasse(event, oobCode));

    }else if(modificationMDP === 'true'){
      const emailModal = document.querySelector("#emailModal");
      const txtPremier = document.querySelector('#txtPremier');
      txtPremier.textContent = 'Votre mot de passe a bien été changé !';
      const txtDeuxieme = document.querySelector('#txtDeuxieme');
      txtDeuxieme.textContent = '';
      emailModal.style.display = 'block';
    }
    // Ajout des divers fonctions à un bouton de l'interface
    const btnConnexion = document.querySelector("#btnConnexion");
    btnConnexion.addEventListener("click", connexionEmailMotDePasse);

  }
  else if(validation){
    surveillanceEtatAuthentification();

  }
  else if(MotDePasseOublier){
    console.log(MotDePasseOublier);
    
    const btnEnvoyerLien = document.querySelector("#btnEnvoyerLien");
    btnEnvoyerLien.addEventListener('click',motDePasseOublier);

  }
  else if(emailNonVerifier){
    surveillanceEtatAuthentification();

    const btnEnvoyerLien = document.querySelector("#btnEnvoyerLien");
    btnEnvoyerLien.addEventListener("click",nouveauLienVerification)

    const btnDeconnexion = document.querySelector("#deconnexion");
    btnDeconnexion.addEventListener("click",deconnexionRedirection);
    ChargementPage();
  }

});
