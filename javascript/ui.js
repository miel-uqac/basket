import { AuthErrorCodes } from "firebase/auth";

export const ErreurConnexion = (error) => {
  const divConnexionErreur = document.querySelector('#ConnexionErreur');
  const ConnexionMessageErreur = document.querySelector('#ConnexionMessageErreur');

  divConnexionErreur.style.display = 'block';
  console.log(error.code) 
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

export const RenitialisationErreurConnexion = () => {
  const divConnexionErreur = document.querySelector('#ConnexionErreur');

  if(divConnexionErreur.style.display === 'block'){
    const ConnexionMessageErreur = document.querySelector('#ConnexionMessageErreur');

    ConnexionMessageErreur.textContent = '';
    divConnexionErreur.style.display = 'none';
  }
  };

// ------------
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
