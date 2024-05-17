import { AuthErrorCodes } from "firebase/auth";

export const ErreurConnexion = (error) => {
  const divConnexionErreur = document.querySelector('#ConnexionErreur');
  const ConnexionMessageErreur = document.querySelector('#ConnexionMessageErreur');

  divConnexionErreur.style.display = 'block';
  
  if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
    ConnexionMessageErreur.textContent = 'Mauvais mot de passe';
  } else {
    ConnexionMessageErreur.textContent = `Error: ${error.message}`;
  }
};

export const hideLoginError = () => {
  const divLoginError = document.querySelector('#divLoginError');
  divLoginError.style.display = 'none';
};

export const showApp = () => {
  console.log("App is shown");
};

export const EtatConnexion = (user) => {
  console.log(`Utilisateur connecter avec : ${user.email}`);
};

export const showLoginForm = () => {
  console.log("Show login form");
};
