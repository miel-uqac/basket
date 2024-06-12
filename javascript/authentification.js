import { auth } from "./index";
import { erreurAuthentification, applicationAffichage, etatConnexion, afficherFormulaireConnexion, renitialisationErreurAuthentification } from "./ui";
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
   * @returns {void}
   */
  export const creerCompte = async (event) => {

    event.preventDefault();
    const btnCreationCompte = document.querySelector("#btnCreerCompte");
    btnCreationCompte.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
  
    if (btnCreationCompte.disabled) {
      return;
    }

    btnCreationCompte.disabled = true; 

    const emailVerificationRegex = /^[a-zA-Z0-9._%+-]+@(etu\.)?uqac\.ca$/;
    const motDePasseVerificationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if(emailVerificationRegex.test(document.querySelector("#txtEmail").value)){

      if(document.querySelector("#txtMotDePasse").value === document.querySelector("#txtConfirmerMotDePasse").value && !document.querySelector("#txtMotDePasse").value == '' && !document.querySelector("#txtConfirmerMotDePasse").value == ''){

        if (motDePasseVerificationRegex.test(document.querySelector("#txtMotDePasse").value)) {

          try {

            erreurAuthentification('auth/emailEnvoyerEnCours');
            await createUserWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtMotDePasse").value);
            await sendEmailVerification(auth.currentUser);
            deconnexion();

            btnCreationCompte.innerHTML = 'Créer compte';
            btnCreationCompte.disabled = false;
            renitialisationErreurAuthentification();
            window.location.replace('https://truqac-test.web.app/index.html?envoyer=true');
          } catch (error) {
            btnCreationCompte.innerHTML = 'Créer compte';
            btnCreationCompte.disabled = false;
            erreurAuthentification(error);
          }}
            
        else{
          erreurAuthentification('auth/mdpTropFaible');
          btnCreationCompte.innerHTML = 'Créer compte';
          btnCreationCompte.disabled = false; 

        }}

      else if(document.querySelector("#txtMotDePasse").value == '' && document.querySelector("#txtConfirmerMotDePasse").value == ''){
          erreurAuthentification('auth/missing-password');
          btnCreationCompte.innerHTML = 'Créer compte';
          btnCreationCompte.disabled = false; 

        }

      else{
        erreurAuthentification('auth/mdpDifferent');
        btnCreationCompte.innerHTML = 'Créer compte';
        btnCreationCompte.disabled = false; 

      }}

    else{
          erreurAuthentification(AuthErrorCodes.INVALID_EMAIL);
          btnCreationCompte.innerHTML = 'Créer compte';
          btnCreationCompte.disabled = false; 

        }
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




  export function verifierEmailUtilisateur(oobCode) {
    const emailModal = document.querySelector("#emailModal");
    const txtPremier = document.querySelector('#txtPremier');
    const txtDeuxieme = document.querySelector('#txtDeuxieme');
    

    txtPremier.innerHTML =  `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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


    const svgsSpinner = document.querySelector('#svg-spinner');
    svgsSpinner.style.height = '40px';

    emailModal.style.display = 'block';




    
    applyActionCode(auth,oobCode)
        .then(function() {
          txtPremier.textContent = 'Votre compte a été vérifié avec succès.';
          txtDeuxieme.textContent = '';



        })
        .catch(function(error) {
          txtPremier.textContent = "Erreur lors de la validation de l'e-mail : " + error;
          txtDeuxieme.textContent = '';


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
   * Fonction permettant à un utilisateur de créer un compte en utilisant une adresse e-mail et un mot de passe,
   * et lui envoie un e-mail de vérification.
   * @returns {void}
   */
  export const modifierMotDePasse = async (event,oobCode) => {

    event.preventDefault();
    const btnChangerMotDePasse = document.querySelector("#btnChangerMotDePasse");
    btnChangerMotDePasse.innerHTML = `<svg id="svg-spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
  
    if (btnChangerMotDePasse.disabled) {
      return;
    }

    btnChangerMotDePasse.disabled = true; 

    const motDePasseVerificationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if(document.querySelector("#txtNouveauMotDePasse").value === document.querySelector("#txtConfirmerNouveauMotDePasse").value && !document.querySelector("#txtNouveauMotDePasse").value == '' && !document.querySelector("#txtConfirmerNouveauMotDePasse").value == ''){

      if (motDePasseVerificationRegex.test(document.querySelector("#txtNouveauMotDePasse").value)) {
        try {
            await confirmPasswordReset(auth, oobCode, document.querySelector("#txtNouveauMotDePasse").value);
            window.location.replace("https://truqac-test.web.app/?modificationMDP=true");
          } catch (error) {
            erreurAuthentification(error);
            btnChangerMotDePasse.innerHTML = 'Réinitialiser le mot de passe';
            btnChangerMotDePasse.disabled = false;
          }

        }   
        else{
          erreurAuthentification('auth/mdpTropFaible');
          btnChangerMotDePasse.innerHTML = 'Réinitialiser le mot de passe';
          btnChangerMotDePasse.disabled = false; 

        }
      }

      else if(document.querySelector("#txtNouveauMotDePasse").value == '' && document.querySelector("#txtConfirmerNouveauMotDePasse").value == ''){
        erreurAuthentification('auth/missing-password');
          btnChangerMotDePasse.innerHTML = 'Réinitialiser le mot de passe';
          btnChangerMotDePasse.disabled = false; 

        }

      else{
        erreurAuthentification('auth/mdpDifferent');
        btnChangerMotDePasse.innerHTML = 'Réinitialiser le mot de passe';
        btnChangerMotDePasse.disabled = false; 

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

      }
      });
    }
    

