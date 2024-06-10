import { AuthErrorCodes } from "firebase/auth";

/**
 * Fonction permettant de gérer les erreurs d'authentification de Firebase en les affichant visuellement à l'utilisateur.
 * @param {Object} error - L'objet d'erreur renvoyé par Firebase.
 */
export const erreurAuthentification = (error) => {

  var divConnexionErreur;
  var ConnexionMessageErreur;
  
  const connexionElement = document.querySelector("#connexion");
  const modifierMotDePasseElement = document.querySelector("#ModifierMotDePasse");
  const Inscription = document.querySelector("#Inscription") !== null;

  if (connexionElement.offsetParent !== null) {
    divConnexionErreur = document.querySelector("#ConnexionErreur");
    ConnexionMessageErreur = document.querySelector("#ConnexionMessageErreur");
  } else if (modifierMotDePasseElement.offsetParent !== null) {
    divConnexionErreur = document.querySelector("#ConnexionErreurNouveauMotDePasse");
    ConnexionMessageErreur = document.querySelector("#ConnexionMessageErreurNouveauMotDePasse");
  } else if(Inscription){
    divConnexionErreur = document.querySelector("#ConnexionErreur");
    ConnexionMessageErreur = document.querySelector("#ConnexionMessageErreur");
  }



  ConnexionMessageErreur.style.color = 'red';
  divConnexionErreur.style.display = 'block';

  if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
    ConnexionMessageErreur.textContent = 'Mauvais identifiants';
  } 
  else if(error.code === AuthErrorCodes.EMAIL_EXISTS){
    ConnexionMessageErreur.textContent = 'Cette e-mail a déjà un compte lié';
  }
  else if(error.code === AuthErrorCodes.INVALID_EMAIL){
    ConnexionMessageErreur.innerHTML = 'Adresse e-mail invalide'; 
  }
  else if(error === AuthErrorCodes.INVALID_EMAIL){
    ConnexionMessageErreur.innerHTML = 'Adresse e-mail invalide. Elle doit se terminer par @etu.uqac.ca ou @uqac.ca'; 
  }
  else if(error === AuthErrorCodes.UNVERIFIED_EMAIL){
    ConnexionMessageErreur.innerHTML = 'Votre compte n\'a pas encore été validé. Veuillez vérifier vos e-mails. Si vous n\'avez pas reçu d\'email : <a id="CompteNonVerifier" href="auth/envoyerEmail.html" >Cliquer-ici</a>';
  }
  else if(error.code === 'auth/missing-password' || error === 'auth/missing-password' ){
    ConnexionMessageErreur.textContent = 'Mot de passe manquant'; 
  }
  else if(error.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER){
    ConnexionMessageErreur.textContent = 'trop de tentative ressayer plus tard'; 
  }
  else if(error === 'auth/mdpDifferent'){
    ConnexionMessageErreur.textContent = 'Les mots de passe ne correspondent pas'; 
  }
  else if(error === 'auth/mdpTropFaible'){
    ConnexionMessageErreur.innerHTML = 'Mot de passe trop faible. Il doit comporter au minimum 6 caractères, une majuscule, une minuscule, un caractère spécial et un chiffre.'; 
  }
  else if(error === 'auth/emailEnvoyerEnCours'){
    ConnexionMessageErreur.style.color = 'gray';
    ConnexionMessageErreur.innerHTML = `Un email est en train d'être envoyé afin de confirmer votre adresse email. Veuillez attendre d'être redirigé.`; 
  }
  else if(error === 'auth/nouveauEmailEnvoyer'){
    ConnexionMessageErreur.style.color = 'gray';
    ConnexionMessageErreur.innerHTML = `Un email est en train d'être envoyé afin de confirmer votre adresse email si votre compte existe. Veuillez attendre d'être redirigé.`; 
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

export function fermerModale() {
  const modale = document.querySelector("#emailModal");
  modale.style.display = "none";
}


export function accueilPage() {
  window.location.replace('https://truqac-test.web.app');
}

export function afficherMotDePasse(checkbox,passwordInput) {
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  });

}
