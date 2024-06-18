import { auth } from "./index";
import { erreurAuthentification, applicationAffichage, etatConnexion, afficherFormulaireConnexion, renitialisationErreurAuthentification, AjoutAnimationChargementBlanc,renitialisationBouton,messageInterfaceUtilisateur,AjoutAnimationChargementBleu,afficherModalEmail,modifierModalEmail } from "./ui";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, AuthErrorCodes, applyActionCode,sendPasswordResetEmail,confirmPasswordReset, browserSessionPersistence,setPersistence } from "firebase/auth";
    


  /**
   * Fonction de connexion utilisant une adresse e-mail et un mot de passe.
   * Cette fonction est déclenchée par le bouton de connexion.
   * @returns {void}
  */
  export const connexionEmailMotDePasse = async (event) => {
    try {
        event.preventDefault();

      const btnConnexion = document.querySelector("#btnConnexion");
      btnConnexion.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
    </svg>` ;

      if (btnConnexion.disabled) {
        return;
      }

      btnConnexion.disabled = true; 

      await setPersistence(auth, browserSessionPersistence);

      const userIdentifiant = await signInWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtMotDePasse").value);
      const user = userIdentifiant.user;

      renitialisationErreurAuthentification();
      btnConnexion.innerHTML = 'Connexion';
      btnConnexion.disabled = false;
      applicationAffichage();
      if (user) {
        if (user.emailVerified) {
          surveillanceEtatAuthentification(userIdentifiant);
          window.location.replace('https://truqac-test.web.app/app/accueil.html');
        } else {
          window.location.replace('https://truqac-test.web.app/auth/emailNonVerifier.html');
        }
      }
    
    } catch (error) {
      erreurAuthentification(error);
      btnConnexion.innerHTML = 'Connexion';
      btnConnexion.disabled = false;
    }
  };
  

  /**
   * Fonction permettant à un utilisateur de créer un compte en utilisant une adresse e-mail et un mot de passe,
   * et lui envoie un e-mail de vérification.
   * @param {Event} event - L'événement de soumission du formulaire.
   * @returns {void}
  */
  export const creerCompte = async (event) => {

    event.preventDefault();

    // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
    const btnCreationCompte = document.querySelector("#btnCreerCompte");
    AjoutAnimationChargementBlanc(btnCreationCompte);
  
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

            // Création de l'utilisateur avec l'adresse e-mail et le mot de passe et envoie un e-mail de vérification à l'utilisateur.
            await createUserWithEmailAndPassword(auth, champEmail, champMotDePasse);
            await sendEmailVerification(auth.currentUser);
                     
            // Déconnexion de l'utilisateur actuel car createUserWithEmailAndPassword() le connecte automatiquement.
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
   * Fonction permettant de vérifier en tout temps l'état de connexion de l'utilisateur.
   * @returns {void}
   */
  export const surveillanceEtatAuthentification = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        if (user.emailVerified) {
          etatConnexion(user);
        } else {
          etatConnexion(user);

        }
      } else {
        afficherFormulaireConnexion();
      }
    });
  };

  /**
   * Fonction permettant de déconnecter l'utilisateur de l'application.
   * @returns {void}
   */
  export const deconnexion = async () => {
    await signOut(auth);
  };



  /**
   * Fonction pour vérifier l'email de l'utilisateur.
   * @param {string} oobCode - Code généré par Firebase pour vérifier l'email de l'utilisateur.
  */
  export function verifierEmailUtilisateur(oobCode) {

    // Sélectionne l'ID de la modal pour l'afficher pendant le traitement de la fonction ainsi que l'animation de chargement pour l'utilisateur.
    const modalID = document.querySelector("#modalID");
    
    // Affichage d'une animation de chargement en cercle sur la modal pendant le chargement.
    const txtPremier  = modalID.querySelector('#txtPremier');
    AjoutAnimationChargementBleu(txtPremier);

    // Modification du style de l'animation de chargement pour l'utilisateur.
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

export const motDePasseOublier = async (event) => {
  event.preventDefault();
  
  const btnEnvoyerLien = document.querySelector("#btnEnvoyerLien");
  btnEnvoyerLien.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
</svg>` ;

  if (btnEnvoyerLien.disabled) {
    return;
  }

  btnEnvoyerLien.disabled = true; 

  const emailVerificationRegex = /^[a-zA-Z0-9._%+-]+@(etu\.)?uqac\.ca$/;

  if (emailVerificationRegex.test(document.querySelector("#txtEmail").value)) {
    try {
      await sendPasswordResetEmail(auth, document.querySelector("#txtEmail").value);
      btnEnvoyerLien.disabled = false; 
      window.location.replace('https://truqac-test.web.app/index.html?motDePasseEnvoyer=true');
    } catch (error) {
      btnEnvoyerLien.disabled = false; 
      window.location.replace('https://truqac-test.web.app/index.html?motDePasseEnvoyer=true');
    }
  } else {
    btnEnvoyerLien.disabled = false; 
    window.location.replace('https://truqac-test.web.app/index.html?motDePasseEnvoyer=true');
  }
};




export const nouveauLienVerification = async (event) =>{
  
  event.preventDefault();
  const btnCompteNonVerifier = document.querySelector("#btnEnvoyerLien");
  btnCompteNonVerifier.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
</svg>` ;

  if (btnCompteNonVerifier.disabled) {
    return;
  }

  btnCompteNonVerifier.disabled = true; 

    try {

        await sendEmailVerification(auth.currentUser); 
        btnCompteNonVerifier.textContent = 'Envoyer un lien de vérification';
        btnCompteNonVerifier.disabled = false; 
        deconnexion();
        window.location.replace('https://truqac-test.web.app/?envoyer=true');
      
    } catch (error) {
      erreurAuthentification(error);
      btnCompteNonVerifier.textContent = 'Envoyer un lien de vérification';
      btnCompteNonVerifier.disabled = false; 

    }

}


  /**
   * Fonction permettant de modifier le mot de passe d'un utilisateur après validation des champs
   * et envoie une requête de réinitialisation au service d'authentification.
   * @param {Event} event L'événement de clic sur le bouton de modification de mot de passe.
   * @param {string} oobCode Le code unique pour la réinitialisation du mot de passe.
   * @returns {void}
   */
  export const modifierMotDePasse = async (event,oobCode) => {

    event.preventDefault();

    // Affichage d'une animation de chargement en cercle sur le bouton pendant le chargement.
    const btnChangerMotDePasse = document.querySelector("#btnChangerMotDePasse");
    AjoutAnimationChargementBlanc(btnChangerMotDePasse);
  
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
           // puis redirige l'utilisateur vers la page de confirmation.
            await confirmPasswordReset(auth, oobCode, document.querySelector("#txtNouveauMotDePasse").value);
            window.location.replace("https://truqac-test.web.app/?modificationMDP=true");

          } catch (error) {

            // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
            erreurAuthentification(error);
            renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe')
          }

        } 

      // Mot de passe ne respectant pas les critères minimum.
      else{

          // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
          erreurAuthentification('auth/mdpTropFaible');
          renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe')

        }
    }

    // Les champs mot de pase et confirmer le mot de passe sont vide.
    else if(champMotDePasse == '' && champConfirmerMotDePasse == ''){
        
        // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
        erreurAuthentification('auth/missing-password');
        renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe')

        }

    // Les champs mot de passe et confirmer mot de passe sont différent. 
    else{

        // En cas d'erreur lors de la modification du mot de passe, affiche l'erreur et réinitialise le bouton "ChangerMotDePasse" à son état par défaut.
        erreurAuthentification('auth/mdpDifferent');
        renitialisationBouton(btnChangerMotDePasse,'Réinitialiser le mot de passe')

      }
};


    export const initialiserEcouteurAuth = async () =>{
      auth.onAuthStateChanged(() => {
        if (auth.currentUser) {
          if (auth.currentUser.emailVerified) {
            window.location.replace('https://truqac-test.web.app/app/accueil.html');
          } else {
            window.location.replace('https://truqac-test.web.app/auth/emailNonVerifier.html');
          }
        }
      });
    }

    export const deconnexionRedirection = async (event) =>{
      event.preventDefault();
      const btnDeconnexion = document.querySelector("#deconnexion");
      btnDeconnexion.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
    </svg>` ;

      deconnexion();

      btnDeconnexion.textContent = 'Déconnexion' ;
      window.location.replace('https://truqac-test.web.app/');

    }

    export function ChargementPage() {
      const chargement = document.querySelector("#chargement");
      const emailNonVerifier = document.querySelector("#emailNonVerifier");
    
      chargement.innerHTML =  `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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

      const svgSpinner = document.querySelector("#svg-spinner");
      svgSpinner.style.height = '70px';

      chargement.style.display = 'block';

      auth.onAuthStateChanged(user => {
        if (user) {
          svgSpinner.style.height = '13px';
          chargement.innerHTML = ''; 
          chargement.style.display = 'none';
          emailNonVerifier.style.display = 'block';
        } else {

          window.location.replace('https://truqac-test.web.app/');
      }
      });
    }


/**
 * Gère le chargement de la page en fonction de l'état de l'authentification utilisateur.
 * Redirige l'utilisateur en fonction de son état d'authentification.
 */
export function gestionChargementPageAuthentification() {
  onAuthStateChanged(auth, user => {
    if (user) {
      if (user.emailVerified) {

        // Redirige l'utilisateur vers la page d'accueil s'il est connecté et son email est vérifié.
        window.location.replace('https://truqac-test.web.app/app/accueil.html');
      } else {
  
        // Redirige l'utilisateur vers la page d'email non vérifié s'il est connecté mais son email n'est pas vérifié.
        window.location.replace('https://truqac-test.web.app/auth/emailNonVerifier.html');  
      }
    }
  });
}