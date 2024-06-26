// Fichier contenant toutes les fonctions concernant l'authentification de la personne utilisatrice.

import { auth } from "./index";
import { erreurAuthentification, etatConnexion, renitialisationErreurAuthentification, ajoutAnimationChargementBlanc,renitialisationBouton,messageInterfaceUtilisateur,ajoutAnimationChargementBleu,modifierModalEmail } from "./ui";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, applyActionCode,sendPasswordResetEmail,confirmPasswordReset, browserSessionPersistence,setPersistence } from "firebase/auth";
    


  /**
   * Fonction de connexion asynchrone utilisant une adresse e-mail et un mot de passe.
   * Cette fonction est déclenchée par le bouton de connexion.
   * @param {Event} event - L'objet d'événement déclenché par le clic sur le bouton de connexion.
   * @returns {void}
   */
  export const connexionEmailMotDePasse = async (event) => {

    const btnConnexion = document.querySelector("#btnConnexion");
    try {

      event.preventDefault();

      // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
      ajoutAnimationChargementBlanc(btnConnexion);

      // Si le bouton est déjà désactivé, on arrête ici pour éviter les traitements multiples.
      if (btnConnexion.disabled) {
        return;
      }

      // Désactive le bouton pour éviter les soumissions multiples.
      btnConnexion.disabled = true; 


      // Récupération et nettoyage de la valeur saisie dans les différents champs.
      const champEmail = document.querySelector("#txtEmail").value.trim();
      const champMotDePasse = document.querySelector("#txtMotDePasse").value.trim();

      // Définit la persistance de session de la personne utilisatrice. La personne utilisatrice restera connecté uniquement pour cette session(page web).
      await setPersistence(auth, browserSessionPersistence);

      // Connexion avec l'e-mail et le mot de passe et récupération de ces informations.
      const userIdentifiant = await signInWithEmailAndPassword(auth, champEmail, champMotDePasse);
      const user = userIdentifiant.user;

      // Réinitialisation de l'interface avant de rediriger la personne utilisatrice.
      renitialisationErreurAuthentification();
      renitialisationBouton(btnConnexion,'Connexion');

      // Redirection en fonction du statut de vérification de l'e-mail.
      if (user) {
        if (user.emailVerified) {
          window.location.replace('https://truqac-test.web.app/app/accueil.html');
        }
        else {
          window.location.replace('https://truqac-test.web.app/auth/emailNonVerifier.html');
        }
      }
    
    } catch (error) {

      // En cas d'erreur lors de la création de la connexion, affiche l'erreur et réinitialise le bouton "Connexion" à son état par défaut.
      erreurAuthentification(error);
      renitialisationBouton(btnConnexion,'Connexion');
    }
  };
  

  /**
   * Fonction asynchrone permettant à une personne utilisatrice de créer un compte en utilisant une adresse e-mail et un mot de passe,
   * et lui envoie un e-mail de vérification.
   * @param {Event} event - L'événement de soumission du formulaire.
   * @returns {void}
   */
  export const creerCompte = async (event) => {

    event.preventDefault();

    // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
    const btnCreationCompte = document.querySelector("#btnCreerCompte");
    ajoutAnimationChargementBlanc(btnCreationCompte);
  
    // Si le bouton est déjà désactivé, on arrête ici pour éviter les traitements multiples.
    if (btnCreationCompte.disabled) {
      return;
    }

    // Désactive le bouton pour éviter les soumissions multiples.
    btnCreationCompte.disabled = true; 

    // Expressions régulières pour la validation de l'e-mail et du mot de passe.
    const emailVerificationRegex = /^[a-zA-Z0-9._%+-]+@(etu\.)?uqac\.ca$/;
    const motDePasseVerificationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Récupération et nettoyage de la valeur saisie dans les différents champs.
    const champEmail = document.querySelector("#txtEmail").value.trim();
    const champMotDePasse = document.querySelector("#txtMotDePasse").value.trim();
    const champConfirmerMotDePasse = document.querySelector("#txtConfirmerMotDePasse").value.trim();


    // Vérification de l'e-mail.
    if(emailVerificationRegex.test(champEmail)){

      // Vérification si les mots de passe correspondent et ne sont pas vides.
      if(champMotDePasse === champConfirmerMotDePasse && !champMotDePasse == '' && !champConfirmerMotDePasse == ''){

        // Validation du mot de passe.
        if (motDePasseVerificationRegex.test(champMotDePasse)) {

          try {

            renitialisationErreurAuthentification();

            // Affiche un message de chargement.
            messageInterfaceUtilisateur('auth/emailEnvoyerEnCours');

            // Création de la personne utilisatrice avec l'adresse e-mail et le mot de passe et envoie un e-mail de vérification à la personne utilisatrice.
            await createUserWithEmailAndPassword(auth, champEmail, champMotDePasse);
            await sendEmailVerification(auth.currentUser);
                     
            // Déconnexion de la personne utilisatrice actuel car createUserWithEmailAndPassword() le connecte automatiquement.
            deconnexion();
            
            // Redirection vers la page avec le paramètre d'envoi réussi.
            window.location.replace('https://truqac-test.web.app/index.html?envoyer=true');

          } catch (error) {

            // En cas d'erreur lors de la création de compte, affiche l'erreur et réinitialise le bouton "Créer compte" à son état par défaut.
            erreurAuthentification(error);
            renitialisationBouton(btnCreationCompte,'Créer compte')

          }}
            
        // Mot de passe ne respectant pas les critères minimum.
        else{
          
          // En cas d'erreur lors de la création de compte, affiche l'erreur et réinitialise le bouton "Créer compte" à son état par défaut.
          erreurAuthentification('auth/mdpTropFaible');
          renitialisationBouton(btnCreationCompte,'Créer compte')

        }}

      // Les champs mot de pase et confirmer le mot de passe sont vide.
      else if(champMotDePasse == '' && champConfirmerMotDePasse == ''){

          // En cas d'erreur lors de la création de compte, affiche l'erreur et réinitialise le bouton "Créer compte" à son état par défaut.
          erreurAuthentification('auth/missing-password');
          renitialisationBouton(btnCreationCompte,'Créer compte')

        }

      // Les champs mot de passe et confirmer mot de passe sont différent. 
      else{

        // En cas d'erreur lors de la création de compte, affiche l'erreur et réinitialise le bouton "Créer compte" à son état par défaut.
        erreurAuthentification('auth/mdpDifferent');
        renitialisationBouton(btnCreationCompte,'Créer compte')}
    }
    // Le champ de l'e-mail ne correspond pas à celui attendu.
    else{

          // En cas d'erreur lors de la création de compte, affiche l'erreur et réinitialise le bouton "Créer compte" à son état par défaut.
          erreurAuthentification('auth/invalid-email');
          renitialisationBouton(btnCreationCompte,'Créer compte')}
  };


  /**
   * Fonction asynchrone permettant de vérifier en tout temps l'état de connexion de la personne utilisatrice.
   * @returns {void}
   */
  export const surveillanceEtatAuthentification = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        if (user.emailVerified) {
          etatConnexion(user);
        } 
        else {
          etatConnexion(user);
        }
      } 
      else {
        console.log('pas connecter');
      }
    });
  };


  /**
   * Fonction asynchrone permettant de déconnecter de la personne utilisatrice de l'application.
   * @returns {void}
   */
  export const deconnexion = async () => {
    await signOut(auth);
  };


  /**
   * Fonction pour vérifier l'email de la personne utilisatrice.
   * @param {string} oobCode - Code généré par Firebase pour vérifier l'email de la personne utilisatrice.
   * @returns {void}
  */
  export function verifierEmailUtilisateur(oobCode) {

    // Sélectionne l'ID de la modal pour l'afficher pendant le traitement de la fonction ainsi que l'animation de chargement pour la personne utilisatrice.
    const modalID = document.querySelector("#modalID");
    
    // Affichage d'une animation de chargement en cercle sur la modal pendant le chargement.
    const txtPremier  = modalID.querySelector('#txtPremier');
    ajoutAnimationChargementBleu(txtPremier);

    // Modification du style de l'animation de chargement pour la personne utilisatrice.
    const svgsSpinner = document.querySelector('#svg-spinner');
    svgsSpinner.style.height = '40px';

    modalID.style.display = 'block';

    const modalIDString = 'modalID';
    
    // Appelle la fonction applyActionCode pour vérifier l'email avec le code spécifié.
    applyActionCode(auth,oobCode)
        .then(function() {

          // Si la vérification réussit, met à jour les textes de la modal.
          const txtPremier  = 'Votre compte a été vérifié avec succès.';
          const txtDeuxieme = '';

          modifierModalEmail(txtPremier,txtDeuxieme,modalIDString);


        })
        .catch(function(error) {
          
          // En cas d'erreur lors de la validation de l'email, met à jour les textes de la modal avec l'erreur.
          const txtPremier = "Erreur lors de la validation de l'e-mail : " + error;
          const txtDeuxieme = ''; 
          modifierModalEmail(txtPremier,txtDeuxieme,modalIDString);
        });
  }


  /**
   * Fonction asynchrone pour gérer l'envoi d'un e-mail de réinitialisation de mot de passe.
   * @param {Event} event - L'événement de soumission du formulaire (pour empêcher le comportement par défaut).
   * @returns {void}
   */
  export const motDePasseOublier = async (event) => {
    event.preventDefault();
  
    // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
    const btnEnvoyerLien = document.querySelector("#btnEnvoyerLien");
    ajoutAnimationChargementBlanc(btnEnvoyerLien);
  

    // Si le bouton est déjà désactivé, on arrête ici pour éviter les traitements multiples.
    if (btnEnvoyerLien.disabled) {
      return;
    }

    // Désactive le bouton pour éviter les soumissions multiples.
    btnEnvoyerLien.disabled = true; 


    // Expressions régulières pour la validation de l'e-mail.
    const emailVerificationRegex = /^[a-zA-Z0-9._%+-]+@(etu\.)?uqac\.ca$/;

    // Récupération et nettoyage de la valeur saisie dans les différents champs.
    const champEmail = document.querySelector("#txtEmail").value.trim();

    if (emailVerificationRegex.test(champEmail)) {
      try {

        // Appel de la fonction firebase d'envoi de l'e-mail de réinitialisation du mot de passe.
        await sendPasswordResetEmail(auth, champEmail);
      
        // Réinitialisation du bouton après l'envoi réussi.
        renitialisationBouton(btnEnvoyerLien,'Envoyer un lien');

        // Redirection vers la page indiquant que le lien a été envoyé.
        window.location.replace('https://truqac-test.web.app/index.html?motDePasseEnvoyer=true');
      } catch (error) {

        // En cas d'erreur lors de l'envoi de l'e-mail, redirige vers la page indiquant que le lien n'a pas pu être envoyé. (Mesure de sécurité)
        // Réinitialisation du bouton.
        renitialisationBouton(btnEnvoyerLien,'Envoyer un lien');
        window.location.replace('https://truqac-test.web.app/index.html?motDePasseEnvoyer=true');
        }
      } 
    else {

      // En cas d'erreur lors de l'envoi de l'e-mail, redirige vers la page indiquant que le lien n'a pas pu être envoyé. (Mesure de sécurité)
      // Réinitialisation du bouton.
      renitialisationBouton(btnEnvoyerLien,'Envoyer un lien');
      window.location.replace('https://truqac-test.web.app/index.html?motDePasseEnvoyer=true');
    }
  };


  /**
   * Fonction asynchrone pour envoyer un nouveau lien de vérification de l'e-mail de la personne utilisatrice actuellement connecté.
   * @param {Event} event - L'événement de soumission du formulaire (pour empêcher le comportement par défaut).
   * @returns {void}
   */
  export const nouveauLienVerification = async (event) =>{
  
    event.preventDefault();

    // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
    const btnCompteNonVerifier = document.querySelector("#btnEnvoyerLien");
    ajoutAnimationChargementBlanc(btnCompteNonVerifier);

    // Si le bouton est déjà désactivé, on arrête ici pour éviter les traitements multiples.
    if (btnCompteNonVerifier.disabled) {
      return;
    }

    // Désactive le bouton pour éviter les soumissions multiples.
    btnCompteNonVerifier.disabled = true; 

    try {

        // Envoyer un e-mail de vérification à la personne utilisatrice actuellement connecté.
        await sendEmailVerification(auth.currentUser); 

        // Réinitialise le bouton après l'envoi réussi du lien de vérification.
        renitialisationBouton(btnCompteNonVerifier,'Envoyer un lien de vérification');

        // Déconnecter la personne utilisatrice après l'envoi du lien de vérification afin de se reconnecter.
        deconnexion();

        // Redirection vers la page indiquant que le lien a été envoyé.
        window.location.replace('https://truqac-test.web.app/?envoyer=true');
      
    } catch (error) {

      // En cas d'erreur lors de l'envoie de l'email, affiche l'erreur et réinitialise le bouton "Créer compte" à son état par défaut.
      erreurAuthentification(error);
      renitialisationBouton(btnCompteNonVerifier,'Envoyer un lien de vérification');
    }
  }


  /**
   * Fonction asynchrone permettant de modifier le mot de passe de la personne utilisatrice après validation des champs
   * et envoie une requête de réinitialisation au service d'authentification.
   * @param {Event} event L'événement de clic sur le bouton de modification de mot de passe.
   * @param {string} oobCode Le code unique pour la réinitialisation du mot de passe.
   * @returns {void}
   */
  export const modifierMotDePasse = async (event,oobCode) => {

    event.preventDefault();

    // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
    const btnChangerMotDePasse = document.querySelector("#btnChangerMotDePasse");
    ajoutAnimationChargementBlanc(btnChangerMotDePasse);
  
    // Si le bouton est déjà désactivé, on arrête ici pour éviter les traitements multiples.
    if (btnChangerMotDePasse.disabled) {
      return;
    }

    // Désactive le bouton pour éviter les soumissions multiples.
    btnChangerMotDePasse.disabled = true; 

    // Expressions régulières pour la validation du mot de passe.
    const motDePasseVerificationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Récupération et nettoyage de la valeur saisie dans les différents champs.
    const champMotDePasse = document.querySelector("#txtNouveauMotDePasse").value.trim();
    const champConfirmerMotDePasse = document.querySelector("#txtConfirmerNouveauMotDePasse").value.trim();

    // Vérification si les mots de passe correspondent et ne sont pas vides.
    if(champMotDePasse === champConfirmerMotDePasse && !champMotDePasse == '' && !champConfirmerMotDePasse == ''){

      // Validation du mot de passe.
      if (motDePasseVerificationRegex.test(champMotDePasse)) {
        try {

            // Attend la confirmation de réinitialisation du mot de passe par le service d'authentification,
            // puis redirige la personne utilisatrice vers la page de confirmation.
            await confirmPasswordReset(auth, oobCode, document.querySelector("#txtNouveauMotDePasse").value);
            window.location.replace("https://truqac-test.web.app/?modificationMDP=true");

        }catch (error) {

            // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
            erreurAuthentification(error);
            renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe');
          }
      } 

      // Mot de passe ne respectant pas les critères minimum.
      else{

        // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
        erreurAuthentification('auth/mdpTropFaible');
        renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe');
      }
    }

    // Les champs mot de pase et confirmer le mot de passe sont vide.
    else if(champMotDePasse == '' && champConfirmerMotDePasse == ''){
        
        // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
        erreurAuthentification('auth/missing-password');
        renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe');
    }

    // Les champs mot de passe et confirmer mot de passe sont différent. 
    else{

        // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
        erreurAuthentification('auth/mdpDifferent');
        renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe');
      }
  };

  /**
   * Fonction asynchrone pour gérer la déconnexion de la personnage utilisatrice et redirige vers la page d'accueil.
   * @param {Event} event - L'événement de soumission du formulaire (pour empêcher le comportement par défaut).
   * @param {string} deconnexionID - L'ID du bouton de déconnexion sur lequel ajouter l'animation de chargement.
   * @returns {void}
   */
  export const deconnexionRedirection = async (event,deconnexionID) =>{
    event.preventDefault();

    // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
    ajoutAnimationChargementBlanc(deconnexionID);

    // Appele à fonction de déconnexion de la personne utilisatrice.
    deconnexion();

    // Rétablir le texte du bouton avant la redirection.
    renitialisationBouton(deconnexionID,'Déconnexion');

    // Redirige la personne utilisatrice vers la page d'accueil après la déconnexion.
    window.location.replace('https://truqac-test.web.app/');
  }


  /**
   * Fonction pour gérer le chargement initial de la page, vérifier l'état de l'authentification de l'utilisateur
   * et afficher les éléments appropriés en conséquence.
   * @param {string} pageHTMLID - L'ID de l'élément HTML à afficher lorsque l'utilisateur est authentifié.
   * @returns {void}
   */
  export function gestionChargementPageApplication(pageHTMLID) {

    // Sélectionne l'élément de chargement et le formulaire de la page.
    const chargement = document.querySelector("#chargement");
    const pageHTML = document.querySelector(`#${pageHTMLID}`);

    
    // Affichage d'une animation de chargement en cercle sur le bouton pendant que Firebase indique si la personne utilisatrice est connecté ou non.
    ajoutAnimationChargementBlanc(chargement);

    // Agrandissement de l'animation de chargement en cercle et l'affiche au milieu de la page.
    const svgSpinner = document.querySelector("#svg-spinner");
    svgSpinner.style.height = '70px';
    chargement.style.display = 'block';

    // Si la personne utilisatrice est connectée, on affiche le formulaire de la page.
    // Sinon, si la personne utilisatrice est connectée mais n'a pas d'email vérifié, on la redirige vers la page adéquate.
    // Sinon, on redirige la personne utilisatrice vers la page de connexion.
    auth.onAuthStateChanged(user => {
      if (user) {

        if(!user.emailVerified){

          // Redirection de la personne utilisatrice vers la page destinées aux comptes non vérifiés.
          window.location.replace('https://truqac-test.web.app/auth/emailNonVerifier.html');
          return;
        }

        // On remet l'animation de chargement à la taille initial.
        svgSpinner.style.height = '13px';

        // État de connexion de la personne utilisatrice trouvé par Firebase, donc on enlève l'animation de chargement de la page.
        chargement.innerHTML = ''; 
        chargement.style.display = 'none';

        // Affichage du formulaire pour l'email non vérifié.
        pageHTML.style.display = 'block';

      }else{
               
        // Redirection de la personne utilisatrice vers la page de connexion.
        window.location.replace('https://truqac-test.web.app/');
      }
    });
  }
  

  /**
   * Fonction pour gérer le chargement initial de la page, vérifier l'état de l'authentification de l'utilisateur
   * et afficher les éléments appropriés en conséquence uniquement de la page EmailNonVerifier.
   * @param {string} pageHTMLID - L'ID de l'élément HTML à afficher lorsque l'utilisateur est authentifié.
   * @returns {void}
   */
  export function gestionChargementPageEmailNonVerifier() {

    // Sélectionne l'élément de chargement et le formulaire de la page.
    const chargement = document.querySelector("#chargement");
    const pageHTML = document.querySelector("#emailNonVerifier");

    
    // Affichage d'une animation de chargement en cercle sur le bouton pendant que Firebase indique si la personne utilisatrice est connecté ou non.
    ajoutAnimationChargementBlanc(chargement);

    // Agrandissement de l'animation de chargement en cercle et l'affiche au milieu de la page.
    const svgSpinner = document.querySelector("#svg-spinner");
    svgSpinner.style.height = '70px';
    chargement.style.display = 'block';

    // Si la personne utilisatrice est connectée, on affiche le formulaire de la page.
    // Sinon, si la personne utilisatrice est connectée mais n'a pas d'email vérifié, on la redirige vers la page adéquate.
    // Sinon, on redirige la personne utilisatrice vers la page de connexion.
    auth.onAuthStateChanged(user => {
      if (user) {

        if(user.emailVerified){

          // Redirection de la personne utilisatrice vers la page destinées aux comptes vérifiés.
          window.location.replace('https://truqac-test.web.app/app/accueil.html');
          return;
        }

        // On remet l'animation de chargement à la taille initial.
        svgSpinner.style.height = '13px';

        // État de connexion de la personne utilisatrice trouvé par Firebase, donc on enlève l'animation de chargement de la page.
        chargement.innerHTML = ''; 
        chargement.style.display = 'none';

        // Affichage du formulaire pour l'email non vérifié.
        pageHTML.style.display = 'block';

      }else{
               
        // Redirection de la personne utilisatrice vers la page de connexion.
        window.location.replace('https://truqac-test.web.app/');
      }
    });
  }


  /**
   * Gère le chargement de la page en fonction de l'état de l'authentification la personne utilisatrice.
   * Redirige la personne utilisatrice en fonction de son état d'authentification dans le formulaire d'authentification.
   * @returns {void}
   */
  export function gestionChargementPageAuthentification() {
    onAuthStateChanged(auth, user => {
      if (user) {
        if (user.emailVerified) {

          // Redirige la personne utilisatrice vers la page d'accueil s'il est connecté et son email est vérifié.
          window.location.replace('https://truqac-test.web.app/app/accueil.html');
        } else {
  
          // Redirige la personne utilisatrice vers la page d'email non vérifié s'il est connecté mais son email n'est pas vérifié.
          window.location.replace('https://truqac-test.web.app/auth/emailNonVerifier.html');  
        }
      }
    });
  }


   /**
    * Supprime le compte de la personne utilisatrice actuellement connecté.
    * @returns {void}
    */
  export  function suppresionCompte() {
    const user = auth.currentUser;
    const suppresion = document.querySelector("#supprimerConfirmation");

    // Redirige la personne utilisatrice vers une nouvelle URL après la suppression réussie du compte.
    if (user) {
      user.delete().then(() => {

        // Affichage d'une animation de chargement en cercle sur le bouton.
        const btnSuppresionCompte = document.querySelector("#supprimerConfirmation");
        ajoutAnimationChargementBlanc(btnSuppresionCompte);

        // Rétablir le texte du bouton avant la redirection.
        renitialisationBouton(suppresion,'Supprimer');

        window.location.replace('https://truqac-test.web.app/');

      }).catch((error) => {

        // Affiche une erreur dans une modal en cas d'échec de la suppression du compte.
        const txtPremier = error.message;
        const txtDeuxieme = '';
        const modalID = 'modalID';

        modifierModalEmail(txtPremier,txtDeuxieme,modalID);

        // Rétablir le texte du bouton.
        renitialisationBouton(suppresion,'Supprimer');

      });
    }
  }