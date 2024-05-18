import { AuthErrorCodes } from "firebase/auth";

/**
 * Fonction permettant de gérer les erreurs d'authentification de Firebase en les affichant visuellement à l'utilisateur.
 * @param {Object} error - L'objet d'erreur renvoyé par Firebase.
 */
export const erreurAuthentification = (error) => {
  const divConnexionErreur = document.querySelector('#ConnexionErreur');
  const ConnexionMessageErreur = document.querySelector('#ConnexionMessageErreur');

  divConnexionErreur.style.display = 'block';

  if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
    ConnexionMessageErreur.textContent = 'Mauvais identifiants';
  } 
  else if(error.code === AuthErrorCodes.EMAIL_EXISTS){
    ConnexionMessageErreur.textContent = 'Cette email a déjà un compte lié';
  }
  else if(error.code === AuthErrorCodes.INVALID_EMAIL){
    ConnexionMessageErreur.textContent = 'Cette email est invalide'; 
  }
  else if(error === AuthErrorCodes.UNVERIFIED_EMAIL){
    ConnexionMessageErreur.textContent = 'Cette email n\'a pas été vérifié'; 
  }
  else if(error.code === 'auth/missing-password'){
    ConnexionMessageErreur.textContent = 'Mot de passe manquant'; 
  }
  else if(error.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER){
    ConnexionMessageErreur.textContent = 'trop de tentative ressayer plus tard'; 
  }
  else {
    ConnexionMessageErreur.textContent = `Error: ${error.message}`;
  }
};

/**
 * Fonction effaçant les erreurs affichées à l'utilisateur.
 * @return {void}
 */
export const renitialisationErreurAuthentification = () => {
  const divConnexionErreur = document.querySelector('#ConnexionErreur');

  if(divConnexionErreur.style.display === 'block'){
    const ConnexionMessageErreur = document.querySelector('#ConnexionMessageErreur');

    ConnexionMessageErreur.textContent = '';
    divConnexionErreur.style.display = 'none';
  }
};

/**
 * Fonction affichant l'application une fois que l'utilisateur a été authentifié.
 * @return {void}
 */
export const applicationAffichage = () => {
  console.log("Application affiché");
};

/**
 * Fonction affichant l'état de connexion de l'utilisateur.
 * @param {Object} user - L'objet user renvoyé par Firebase.
 * @return {void}
 */
export const etatConnexion = (user) => {
  console.log(`Utilisateur connecter avec : ${user.email}`);
};

/**
 * Fonction affichant le formulaire de connexion si l'utilisateur n'est pas connecté.
 * @return {void}
 */
export const afficherFormulaireConnexion = () => {
  console.log("Show login form");
};
