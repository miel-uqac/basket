// Main principal, fichier où l'on détermine sur quelle page nous sommes et associons les fonctions aux éléments HTML en conséquence.

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator} from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import {connexionEmailMotDePasse,creerCompte,surveillanceEtatAuthentification, verifierEmailUtilisateur, nouveauLienVerification,motDePasseOublier, modifierMotDePasse, deconnexionRedirection,ChargementPage, gestionChargementPageAuthentification,gestionChargementPageApplication, suppresionCompte} from "./authentification";
import {fermerModale, afficherMotDePasse,afficherModalEmail,supprimerCompteBouton} from "./ui";

// Configuration application Web FireBase.
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

// Variable d'initialisation de l'application, l'authentification, et de la base de données.
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getDatabase(app);


// Connexion aux Emulateurs Firebase si l'application est exécutée en local.
if (location.hostname === "127.0.0.1") {
  connectAuthEmulator(auth, "http://127.0.0.1:5002");
  connectDatabaseEmulator(db, "127.0.0.1", 8001);
}

// Chargement du JavaScript après le chargement de la page HTML.
document.addEventListener('DOMContentLoaded', () => {

// Ensemble de variables permettant de reconnaître sur quelle page on se trouve et d'exécuter les processus adéquats.
  const pageConnexion = document.querySelector("#connexion") !== null;
  const pageInscription = document.querySelector("#inscription") !== null;
  const pageMotDePasseOublier = document.querySelector("#motDePasseOublier") !== null;
  const pageEmailNonVerifier = document.querySelector("#emailNonVerifier") !== null;
  const pageAccueilApp = document.querySelector("#accueil");
  const pageProfil = document.querySelector("#personneUtilisatrice");

  // Gestion des différentes pages et exécution des fonctionnalités associées.
  if(pageInscription){

    surveillanceEtatAuthentification();

    // Association de la fonction de création de compte au bouton correspondant.
    const btnCreationCompte = document.querySelector("#btnCreerCompte");
    btnCreationCompte.addEventListener("click", creerCompte);

    // Affichage du mot de passe à l'aide d'une case à cocher et de sa fonction associée.
    const caseCocher = document.querySelector('#afficherMotDePasse');
    var champMotDePasse = document.querySelector('#txtMotDePasse');
    afficherMotDePasse(caseCocher,champMotDePasse);

    // Affichage du mot de passe de confirmation à l'aide d'une case à cocher.
    champMotDePasse = document.querySelector('#txtConfirmerMotDePasse');    
    afficherMotDePasse(caseCocher,champMotDePasse);}
  
  else if(pageConnexion){

    gestionChargementPageAuthentification();

    surveillanceEtatAuthentification();

    // Récupération des paramètres d'URL pour gérer les différents processus sur la page de connexion.
    const urlParametres = new URLSearchParams(window.location.search);
    const envoyerEmail = urlParametres.get('envoyer');
    const mode = urlParametres.get('mode');
    const envoyerEmailPassword = urlParametres.get('motDePasseEnvoyer');
    const oobCode = urlParametres.get('oobCode');
    const modificationMDP = urlParametres.get('modificationMDP');

    // Sélectionne le bouton de fermeture de la modale d'information afin de lui associer sa fonction de fermeture.
    const fermerModal = document.querySelector("#fermer");

    // Sélection de l'ID de la modal.
    const modalID = 'modalID';

    fermerModal.addEventListener('click', function() {fermerModale(modalID);});

    // Affichage du mot de passe à l'aide d'une case à cocher et de sa fonction associée.
    const caseCocher = document.querySelector('#afficherMotDePasse');
    const champMotDePasse = document.querySelector('#txtMotDePasse');
    afficherMotDePasse(caseCocher,champMotDePasse);

    // Si la condition est respectée, nous sommes à la fin du processus d'envoi de l'email de vérification.
    if(envoyerEmail === 'true'){

      // Définition du texte à intégrer dans la modal.
      const txtPremier = 'Email de vérification envoyé avec succès !';
      const txtDeuxieme = 'Si vous ne le trouvez pas, vérifiez dans vos courriers indésirables.';

      afficherModalEmail(txtPremier,txtDeuxieme,modalID);

    }

    // Si la condition est respectée, nous sommes à la fin du processus d'envoi de l'email pour modifier le mot de passe.
    else if(envoyerEmailPassword === 'true'){
      
      // Définition du texte à intégrer dans la modal.
      const txtPremier = 'Email de réinitialisation du mot de passe envoyé avec succès !';
      const txtDeuxieme = 'Si vous ne le trouvez pas, vérifiez dans vos courriers indésirables.';

      afficherModalEmail(txtPremier,txtDeuxieme,modalID);

    }

    // Si la condition est respectée, nous sommes dans le processus de vérification de l'email de la personne utilisatrice.
    else if(mode === 'verifyEmail'){
        verifierEmailUtilisateur(oobCode);
    }

    // Si la condition est respectée, nous sommes dans le processus de réinitialisation du mot de passe de la personne utilisatrice.
    else if(mode === 'resetPassword'){
      
        // Si nous sommes dans le processus de réinitialisation du mot de passe.
        // Il faut enlever le formulaire de connexion car les deux sont sur la même page.
        // On sélectionne le formulaire de connexion et le formulaire de réinitialisation du mot de passe.
        const formulaireConnexion = document.querySelector("#connexion");
        const modifierMotDePass = document.querySelector("#modifierMotDePasse");

        // Masque le formulaire de connexion et affiche le formulaire de réinitialisation.
        formulaireConnexion.style.display = 'none';
        modifierMotDePass.style.display = 'block';

        // Affichage du nouveau mot de passe à l'aide d'une case à cocher et de sa fonction associée.
        let caseCocher = document.querySelector('#afficherNouveauMotDePasse');
        let champMotDePasse = document.querySelector('#txtNouveauMotDePasse');
        afficherMotDePasse(caseCocher,champMotDePasse);
    
        // Affichage du nouveau mot de passe de confirmation à l'aide d'une case à cocher et de sa fonction associée.
        caseCocher = document.querySelector('#afficherNouveauMotDePasse');
        champMotDePasse = document.querySelector('#txtConfirmerNouveauMotDePasse');
        afficherMotDePasse(caseCocher,champMotDePasse);

        // Sélectionne le bouton pour changer le mot de passe et lui associe sa fonction.
        const btnChangerMotDePasse = document.querySelector("#btnChangerMotDePasse");
        btnChangerMotDePasse.addEventListener('click', (event) => modifierMotDePasse(event, oobCode));

    }

    // Si la condition est respectée, nous sommes à la fin du processus de réinitialisation du mot de passe de la personne utilisatrice.
    else if(modificationMDP === 'true'){

      // Définition du texte à intégrer dans la modal.
      const txtPremier = 'Votre mot de passe a bien été changé !';
      const txtDeuxieme = '';
      afficherModalEmail(txtPremier,txtDeuxieme,modalID);

    }

    // Association de la fonction de connexion au bouton correspondant.
    const btnConnexion = document.querySelector("#btnConnexion");
    btnConnexion.addEventListener("click", connexionEmailMotDePasse);

  }
  else if(pageMotDePasseOublier){

    gestionChargementPageAuthentification();
    
    // Association de la fonction de mot de pase oublier au bouton correspondant.
    const btnEnvoyerLien = document.querySelector("#btnEnvoyerLien");
    btnEnvoyerLien.addEventListener('click',motDePasseOublier);

  }
  else if(pageEmailNonVerifier){

    // Association de la fonction pour envoyer un nouveau lien de vérification au bouton correspondant.
    const btnEnvoyerLien = document.querySelector("#btnEnvoyerLien");
    btnEnvoyerLien.addEventListener("click",nouveauLienVerification)

    // Association de la fonction pour se déconnecter au bouton correspondant.
    const btnDeconnexion = document.querySelector("#deconnexion");
    btnDeconnexion.addEventListener('click', (event) => deconnexionRedirection(event, btnDeconnexion));
    
    ChargementPage();
  }
  else if(pageAccueilApp){
    gestionChargementPageApplication();
  }
  else if(pageProfil){
    gestionChargementPageApplication();

    // Association de la fonction pour se déconnecter au bouton correspondant.
    const btnDeconnexion = document.querySelector("#btnDeconnexion");
    btnDeconnexion.addEventListener('click', (event) => deconnexionRedirection(event, btnDeconnexion));
   
    // Association de la fonction pour afficher la modal de confirmation de suppresion de son compte au bouton correspondant.
    const btnSupprimerCompte = document.querySelector("#supprimerCompte");
    btnSupprimerCompte.addEventListener('click',supprimerCompteBouton);

    // Sélectionne le bouton de fermeture de la modale d'information afin de lui associer sa fonction de fermeture.
    const fermerModal = document.querySelector("#fermer");

    // Sélection de l'ID de la modal.
    const modalID = 'modalID';
   
    fermerModal.addEventListener('click', function() {fermerModale(modalID);});

    // Association de la fonction pour se supprimer le compte au bouton correspondant.
    const btnSuppresion = document.querySelector("#supprimerConfirmation");
    btnSuppresion.addEventListener('click',suppresionCompte);
  }

});
