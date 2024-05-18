import { auth } from "./index";
import { erreurAuthentification, applicationAffichage, etatConnexion, renitialisationErreurAuthentification, afficherFormulaireConnexion } from "./ui";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, AuthErrorCodes } from "firebase/auth";

  /**
   * Fonction de connexion utilisant une adresse e-mail et un mot de passe.
   * Cette fonction est déclenchée par le bouton de connexion.
   * @returns {void}
  */
  export const connexionEmailMotDePasse = async () => {
    try {

      const userIdentifiant = await signInWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtPassword").value);
      const user = userIdentifiant.user;

      if (user.emailVerified) {
        renitialisationErreurAuthentification();
        applicationAffichage();
        etatConnexion(user);
      } else { 
        erreurAuthentification(AuthErrorCodes.UNVERIFIED_EMAIL);
        await signOut(auth);
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
  export const creerCompte = async () => {
    try {
      renitialisationErreurAuthentification();
      await createUserWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtPassword").value);
      await sendEmailVerification(auth.currentUser);
      console.log("Email de vérification envoyé !");
    } catch (error) {
      erreurAuthentification(error);
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
          renitialisationErreurAuthentification();
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