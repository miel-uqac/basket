import { auth } from "./index";
import { erreurAuthentification, applicationAffichage, etatConnexion, afficherFormulaireConnexion, renitialisationErreurAuthentification } from "./ui";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, AuthErrorCodes, applyActionCode } from "firebase/auth";
  /**
   * Fonction de connexion utilisant une adresse e-mail et un mot de passe.
   * Cette fonction est déclenchée par le bouton de connexion.
   * @returns {void}
  */
  export const connexionEmailMotDePasse = async (event) => {
    try {
        event.preventDefault();

      const btnConnexion = document.querySelector("#btnConnexion");

      if (btnConnexion.disabled) {
        return;
      }

      btnConnexion.disabled = true; 

      const userIdentifiant = await signInWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtMotDePasse").value);
      const user = userIdentifiant.user;

      if (user.emailVerified) {
        btnConnexion.disabled = false;
        applicationAffichage();
        etatConnexion(user);
      } else { 
        sessionStorage.setItem('currentUser', JSON.stringify({
          uid: user.uid,
          email: user.email
        }));
        await signOut(auth);
        erreurAuthentification(AuthErrorCodes.UNVERIFIED_EMAIL);
        btnConnexion.disabled = false;

      }
    } catch (error) {
      erreurAuthentification(error);
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

            btnCreationCompte.disabled = false;
            renitialisationErreurAuthentification();
            window.location.replace('https://truqac-test.web.app/auth/validation.html');
          } catch (error) {
            erreurAuthentification(error);
          }}
            
        else{
          erreurAuthentification('auth/mdpTropFaible');
          btnCreationCompte.disabled = false; 

        }}

      else if(document.querySelector("#txtMotDePasse").value == '' && document.querySelector("#txtConfirmerMotDePasse").value == ''){
          erreurAuthentification('auth/missing-password');
          btnCreationCompte.disabled = false; 

        }

      else{
        erreurAuthentification('auth/mdpDifferent');
        btnCreationCompte.disabled = false; 

      }}

    else{
          erreurAuthentification(AuthErrorCodes.INVALID_EMAIL);
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
          applicationAffichage();
          etatConnexion(user);
        } else {
          signOut(auth);
          afficherFormulaireConnexion();
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
    const txtValidationEmail = document.querySelector("#textValidationEmail"); 
    applyActionCode(auth,oobCode)
        .then(function() {
          txtValidationEmail.innerHTML = "Votre compte a été validé avec succès. Vous serez automatiquement redirigé vers la page d\'accueil.<br> Si vous n\'êtes pas redirigé, veuillez cliquer sur le bouton d\'accueil";
        })
        .catch(function(error) {
          txtValidationEmail.textContent = "Erreur lors de la validation de l'e-mail : " + error;
        });
}

export const nouveauLienVerification = async (event) =>{
  
  event.preventDefault();
  const btnEnvoyer = document.querySelector("#btnEnvoyer");

  if (btnEnvoyer.disabled) {
    return;
  }

  btnEnvoyer.disabled = true; 

  const emailVerificationRegex = /^[a-zA-Z0-9._%+-]+@(etu\.)?uqac\.ca$/;

  if(emailVerificationRegex.test(document.querySelector("#txtEmail").value)){
    try {

      const user = JSON.parse(sessionStorage.getItem('currentUser'));
        erreurAuthentification('auth/nouveauEmailEnvoyer');
        await sendEmailVerification(user); 
        sessionStorage.removeItem('currentUser');
        renitialisationErreurAuthentification();
        btnEnvoyer.disabled = false; 
        window.location.replace('https://truqac-test.web.app/auth/validation.html');
      
    } catch (error) {
      erreurAuthentification(error);
      btnEnvoyer.disabled = false; 

    }

  }
  else{
    erreurAuthentification(AuthErrorCodes.INVALID_EMAIL);
    btnEnvoyer.disabled = false; 

  }
}
