import { auth } from "./index";
import { erreurAuthentification, applicationAffichage, etatConnexion, afficherFormulaireConnexion, renitialisationErreurAuthentification } from "./ui";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, AuthErrorCodes } from "firebase/auth";

  /**
   * Fonction de connexion utilisant une adresse e-mail et un mot de passe.
   * Cette fonction est déclenchée par le bouton de connexion.
   * @returns {void}
  */
  export const connexionEmailMotDePasse = async (event) => {
    try {
        event.preventDefault();

      const userIdentifiant = await signInWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtMotDePasse").value);
      const user = userIdentifiant.user;

      if (user.emailVerified) {
        applicationAffichage();
        etatConnexion(user);
      } else { 
        await signOut(auth);
        erreurAuthentification(AuthErrorCodes.UNVERIFIED_EMAIL);
      }
    } catch (error) {
      erreurAuthentification(error);
    }
  };
  

  /**
   * Fonction permettant à un utilisateur de créer un compte en utilisant une adresse e-mail et un mot de passe,
   * et lui envoie un e-mail de vérification.
   * @returns {void}
   */
  export const creerCompte = async (event) => {

    event.preventDefault();
    const emailVerificationRegex = /^[a-zA-Z0-9._%+-]+@(etu\.)?uqac\.ca$/;
    const motDePasseVerificationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if(emailVerificationRegex.test(document.querySelector("#txtEmail").value)){

      if(document.querySelector("#txtMotDePasse").value === document.querySelector("#txtConfirmerMotDePasse").value && !document.querySelector("#txtMotDePasse").value == '' && !document.querySelector("#txtConfirmerMotDePasse").value == ''){

        if (motDePasseVerificationRegex.test(document.querySelector("#txtMotDePasse").value)) {

          try {
            renitialisationErreurAuthentification()
            await createUserWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtMotDePasse").value);
            await sendEmailVerification(auth.currentUser);
            window.location.replace('https://truqac-test.web.app/?envoyer=' + encodeURIComponent(true.toString()));
          } catch (error) {
            erreurAuthentification(error);
          }}
            
        else{
          erreurAuthentification('auth/mdpTropFaible');
        }}

      else if(document.querySelector("#txtMotDePasse").value == '' && document.querySelector("#txtConfirmerMotDePasse").value == ''){
          erreurAuthentification('auth/missing-password');
        }

      else{
        erreurAuthentification('auth/mdpDifferent');
      }}

    else{
          erreurAuthentification(AuthErrorCodes.INVALID_EMAIL);
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