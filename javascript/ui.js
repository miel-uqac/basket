// Fichier contenant toutes les fonctions de changement de design dynamique.

import { AuthErrorCodes } from "firebase/auth";

  /**
   * Fonction qui gère l'affichage visuel des erreurs d'authentification de Firebase.
   * @param {Object | string} error - L'objet d'erreur renvoyé par Firebase ou une chaîne de caractères identifiant l'erreur.
   * @returns {void}
   */
  export const erreurAuthentification = (error) => {

    // Initialisation des variables pour les éléments d'affichage des erreurs.
    let divErreur = '';
    let messageErreur = '';

    // Vérification de la présence des éléments HTML nécessaires pour déterminer sur quelle page nous sommes.
    const connexionElement = document.querySelector("#connexion");
    const connexionCheck = document.querySelector("#connexion") !== null;

    const modifierMotDePasseElementCheck = document.querySelector("#modifierMotDePasse") !== null;
    const modifierMotDePasseElement = document.querySelector("#modifierMotDePasse");

    const inscription = document.querySelector("#inscription") !== null;

    const emailNonVerifier = document.querySelector("#emailNonVerifier") !== null;

    // Détermination des éléments affichant les différentes erreurs en fonction du contexte d'affichage.
    // Nécessaire car les formulaires de connexion et de modification de mot de passe sont sur la même page ; un seul est affiché à la fois.
    if (connexionCheck && connexionElement.offsetParent !== null) {

      // Si le formulaire de connexion est affiché.
      divErreur = document.querySelector("#erreurInterface");
      messageErreur = document.querySelector("#messageErreur");

    } else if (modifierMotDePasseElementCheck && modifierMotDePasseElement.offsetParent !== null) {

      // Si le formulaire de modification de mot de passe est affiché.
      divErreur = document.querySelector("#erreurInterfaceNouveauMotDePasse");
      messageErreur = document.querySelector("#messageErreurNouveauMotDePasse");

    } else if(inscription){

      // Si nous somme sur la page du formulaire d'inscription.
      divErreur = document.querySelector("#erreurInterface");
      messageErreur = document.querySelector("#messageErreur");

    } else if(emailNonVerifier){

      // Si nous sommes sur la page du formulaire d'email non vérifié.
      divErreur = document.querySelector("#erreurInterface");
      messageErreur = document.querySelector("#messageErreur");
    }

    // Prépare l'affichage des messages d'erreur.
    divErreur.style.display = 'block';

    // Gestion des différents types d'erreurs Firebase (traduit/error.code) ou personnalisées(error).
    if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
      messageErreur.textContent = 'Identifiants de connexion incorrects (e-mail/Mot de passe)';
    } 
    else if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
      messageErreur.textContent = 'Cet e-mail est déjà associé à un compte';
    }
    else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
      messageErreur.innerHTML = 'Adresse e-mail invalide';
    }
    else if (error === 'auth/invalid-email') {
      messageErreur.innerHTML = 'Adresse e-mail invalide. Elle doit se terminer par @etu.uqac.ca ou @uqac.ca';
    }
    else if (error.code === 'auth/missing-password' || error === 'auth/missing-password') {
      messageErreur.textContent = 'Mot de passe manquant';
    }
    else if (error.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
      messageErreur.textContent = 'Trop de tentatives. Veuillez réessayer plus tard';
    }
    else if (error === 'auth/mdpDifferent') {
      messageErreur.textContent = 'Les mots de passe ne correspondent pas';
    }
    else if (error === 'auth/mdpTropFaible') {
      messageErreur.innerHTML = 'Mot de passe trop faible. Il doit comporter au minimum 6 caractères, une majuscule, une minuscule, un caractère spécial et un chiffre.';
    }
    else {
      messageErreur.textContent = `Erreur: ${error.message}`;
    }

  };


  /**
   * Affiche un message spécifique à la personne utilisatrice sur l'interface en fonction de l'identifiant du message fourni.
   * @param {string} msgID - Identifiant du message à afficher.
   * @returns {void}
   */
  export const messageInterfaceUtilisateur = (msgID) => {

    // Initialisation des variables pour les éléments d'affichage des messages pour la personne utilisatrice.
    let divInterfaceMessage = '';
    let message = '';

    // Sélection des éléments HTML où afficher les messages sur la page d'inscription.
    divInterfaceMessage = document.querySelector("#interfaceMessage");
    message = document.querySelector("#message");

    // Prépare le style et l'affichage pour la personne utilisatrice.
    divInterfaceMessage.style.display = 'block';

    // Affichage du message approprié en fonction de l'identifiant du message fourni
    if (msgID === 'auth/emailEnvoyerEnCours') {
      message.innerHTML = `Un e-mail est en cours d'envoi pour confirmer votre adresse e-mail. Veuillez patienter.`;
    }
  };


  /**
   * Fonction effaçant les erreurs affichées à la personne utilisatrice.
   * @return {void}
   */
  export const renitialisationErreurAuthentification = () => {
    const divErreur = document.querySelector('#erreurInterface');

    if(divErreur.style.display === 'block'){
      const messageErreur = document.querySelector('#messageErreur');

      messageErreur.textContent = '';
      divErreur.style.display = 'none';
    }
  };

  /**
   * Fonction effaçant les messages affichées à la personne utilisatrice.
   * @return {void}
   */
  export const renitialisationMessageUtilisateur = () => {
    const divInterfaceMessage = document.querySelector('#interfaceMessage');

    if(divInterfaceMessage.style.display === 'block'){
      const message = document.querySelector('#message');

      message.textContent = '';
      divInterfaceMessage.style.display = 'none';
    }
  };


  /**
   * Fonction affichant l'état de connexion de la personne utilisatrice.
   * @param {Object} user - L'objet user renvoyé par Firebase.
   * @return {void}
   */
  export const etatConnexion = (user) => {
    console.log(`la personne utilisatrice est connecter avec : ${user.email}`);
  };


  /**
   * Fonction pour fermer la modale.
   * Cette fonction sélectionne l'élément modal dans le DOM par son ID
   * et change son style pour le masquer en mettant 'display' à 'none'.
   * 
   * @param {string} modalID - L'ID de la modale à fermer.
   * @return {void}
   */
  export function fermerModale(modalID) {
    const modale = document.querySelector(`#${modalID}`);
    modale.style.display = "none";
  }


  /**
   * Active ou désactive l'affichage du mot de passe dans le champ spécifié en fonction de l'état de la case à cocher.
   * @param {HTMLElement} caseCocher - La case à cocher qui contrôle l'affichage du mot de passe.
   * @param {HTMLInputElement} champMotDePasse - Le champ de mot de passe où le texte doit être affiché ou masqué.
   * @returns {void}
   */
  export function afficherMotDePasse(caseCocher,champMotDePasse) {
    caseCocher.addEventListener('change', function() {
      if (this.checked) {
        champMotDePasse.type = 'text';
      } else {
        champMotDePasse.type = 'password';
      }
    });
  }

  /**
   * Fonction qui remplace le contenu HTML d'un élément par une animation de chargement blanc en forme de cercle.
   * @param {HTMLElement} ElementHTML - L'élément HTML sur lequel l'animation sera ajoutée.
   * @returns {void}
   */
  export function ajoutAnimationChargementBlanc(ElementHTML) {

    // Remplace le contenu de l'élément par une animation SVG de chargement blanc.
    ElementHTML.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="4" r="4" fill="#fff" />
      <circle cx="12.19" cy="7.86" r="3.7" fill="#fffbf2" />
      <circle cx="5.02" cy="17.68" r="3.4" fill="#fef7e4" />
      <circle cx="5.02" cy="30.32" r="3.1" fill="#fef3d7" />
      <circle cx="12.19" cy="40.14" r="2.8" fill="#feefc9" />
      <circle cx="24" cy="44" r="2.5" fill="#feebbc" />
      <circle cx="35.81" cy="40.14" r="2.2" fill="#fde7af" />
      <circle cx="42.98" cy="30.32" r="1.9" fill="#fde3a1" />
      <circle cx="42.98" cy="17.68" r="1.6" fill="#fddf94" />
      <circle cx="35.81" cy="7.86" r="1.3" fill="#fcdb86" />
    </svg>`;
  }


  /**
   * Fonction qui remplace le contenu HTML d'un élément par une animation de chargement bleu en forme de cercle.
   * @param {HTMLElement} ElementHTML - L'élément HTML sur lequel l'animation sera ajoutée.
   * @returns {void}
   */
  export function ajoutAnimationChargementBleu(ElementHTML) {

    // Remplace le contenu de l'élément par une animation SVG de chargement bleu.
    ElementHTML.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="4" r="4" fill="rgb(38, 114, 236)" />
      <circle cx="12.19" cy="7.86" r="3.7" fill="rgb(82, 143, 255)" />
      <circle cx="5.02" cy="17.68" r="3.4" fill="rgb(118, 167, 255)" />
      <circle cx="5.02" cy="30.32" r="3.1" fill="rgb(153, 191, 255)" />
      <circle cx="12.19" cy="40.14" r="2.8" fill="rgb(189, 214, 255)" />
      <circle cx="24" cy="44" r="2.5" fill="rgb(224, 237, 255)" />
      <circle cx="35.81" cy="40.14" r="2.2" fill="rgb(206, 229, 255)" />
      <circle cx="42.98" cy="30.32" r="1.9" fill="rgb(167, 207, 255)" />
      <circle cx="42.98" cy="17.68" r="1.6" fill="rgb(130, 184, 255)" />
      <circle cx="35.81" cy="7.86" r="1.3" fill="rgb(94, 160, 255)" />
    </svg>`;
  }


  /**
   * Réinitialise un bouton en remplaçant son contenu par le texte spécifié et en réactivant le bouton.
   * @param {HTMLElement} ElementBoutonHTML - Le bouton HTML à réinitialiser.
   * @param {string} texteParDefault - Le texte par défaut à afficher dans le bouton réinitialisé.
   * @returns {void}
   */
  export function renitialisationBouton(ElementBoutonHTML, texteParDefault) {
    // Remplace le contenu du bouton par le texte spécifié.
    ElementBoutonHTML.innerHTML = texteParDefault;
    // Réactive le bouton.
    ElementBoutonHTML.disabled = false;
  }

  /**
   * Fonction pour afficher la modale avec les messages appropriés.
   * @param {string} premierTexte - Le texte à afficher dans l'élément avec l'ID 'txtPremier'.
   * @param {string} deuxiemeTexte - Le texte à afficher dans l'élément avec l'ID 'txtDeuxieme'.
   * @param {string} modalId - L'ID de l'élément modal à afficher.
   * @return {void}
   */
  export function afficherModalEmail(premierTexte, deuxiemeTexte, modalId) {

      // Sélectionne l'élément avec l'ID de la modal.
      const modal = document.querySelector(`#${modalId}`);
      
      // Sélectionne les éléments de texte à mettre à jour
      const txtPremier = modal.querySelector('#txtPremier');
      const txtDeuxieme = modal.querySelector('#txtDeuxieme');
      
      // Met à jour les textes
      txtPremier.textContent = premierTexte;
      txtDeuxieme.textContent = deuxiemeTexte;
      
      // Rend la modal visible en changeant son style
      modal.style.display = 'block';
  }

  /**
   * Fonction pour modifier le texte de la modale avec les messages appropriés.
   * @param {string} premierTexte - Le texte à afficher dans l'élément avec l'ID 'txtPremier'.
   * @param {string} deuxiemeTexte - Le texte à afficher dans l'élément avec l'ID 'txtDeuxieme'.
   * @param {string} modalId - L'ID de l'élément modal à afficher.
   * @return {void}
   */
  export function modifierModalEmail(premierTexte, deuxiemeTexte, modalId) {

    // Sélectionne l'élément avec l'ID de la modal.
    const modal = document.querySelector(`#${modalId}`);
    
    // Sélectionne les éléments de texte à mettre à jour
    const txtPremier = modal.querySelector('#txtPremier');
    const txtDeuxieme = modal.querySelector('#txtDeuxieme');
    
    // Met à jour les textes
    txtPremier.textContent = premierTexte;
    txtDeuxieme.textContent = deuxiemeTexte;
  }

  /**
   * Initialise le processus de suppression de compte de la personne utilisatrice.
   * Affiche une modal de confirmation.
   * @returns {void}
   */
  export function supprimerCompteBouton(){

    // Animation de chargement au bouton de déconnexion
    const btnSupprimer = document.querySelector("#supprimerCompte");
    ajoutAnimationChargementBlanc(btnSupprimer);

    // Définition du texte à intégrer dans la modal.
    const modalID = 'modalID';
    const txtPremier = 'Voulez-vous supprimer définitivement votre compte ?';
    const txtDeuxieme = 'Toutes les données seront perdues.';
    
    afficherModalEmail(txtPremier,txtDeuxieme,modalID);

    // Réinitialise le texte et l'état du bouton après l'action de suppression.
    renitialisationBouton(btnSupprimer,'Supprimer compte');
  }