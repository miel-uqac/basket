import { AuthErrorCodes } from "firebase/auth";

export const ErreurConnexion = (error) => {
  const divConnexionErreur = document.querySelector('#ConnexionErreur');
  const ConnexionMessageErreur = document.querySelector('#ConnexionMessageErreur');

  divConnexionErreur.style.display = 'block';
  
  if (error.code === AuthErrorCodes.INVALID_PASSWORD || error.code === AuthErrorCodes.INVALID_EMAIL)
    ConnexionMessageErreur.textContent = 'Mauvais identifiant de connexion';
  else if(error.code === error.code === AuthErrorCodes.UNVERIFIED_EMAIL)
    ConnexionMessageErreur.textContent = 'Email pas vérifié';
};

export const RenitialisationErreurConnexion = () => {
  const divConnexionErreur = document.querySelector('#ConnexionErreur');
  divConnexionErreur.style.display = 'none';
  
  const ConnexionMessageErreur = document.querySelector('#ConnexionMessageErreur');
  ConnexionMessageErreur.textContent = '';
};


export const hideLoginError = () => {
  const divLoginError = document.querySelector('#divLoginError');
  divLoginError.style.display = 'none';
};

export const Application = () => {
  console.log("Application affiché");
};

export const EtatConnexion = (user) => {
  console.log(`Utilisateur connecter avec : ${user.email}`);
};

export const showLoginForm = () => {
  console.log("Show login form");
};
