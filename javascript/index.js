import { initializeApp } from "firebase/app";
import { ErreurConnexion, hideLoginError, Application, EtatConnexion, showLoginForm, RenitialisationErreurConnexion } from "./ui";
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Configuration application Web FireBase
const firebaseConfig = {
  apiKey: "AIzaSyBOV4kut3iU7qaJ2PTR84wR9C0rjsXU2wY",
  authDomain: "truqac-test.firebaseapp.com",
  databaseURL: "https://truqac-test-default-rtdb.firebaseio.com",
  projectId: "truqac-test",
  storageBucket: "truqac-test.appspot.com",
  messagingSenderId: "1009872737120",
  appId: "1:1009872737120:web:e550a518bb497492a20405",
  measurementId: "G-X3Z94L3PF6"
};

// Variable d'initialisation de l'application, l'authentification, et de la base de données
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// Chargement du JavaScript après le chargement de la page HTML
document.addEventListener('DOMContentLoaded', () => {

  // Fonction de connexion avec email et mot de passe rattaché au bouton de connexion
  const FonctionConnexionEmailMotDePasse = async () => {
    try {

      const userIdentifiant = await signInWithEmailAndPassword(auth, document.querySelector("#txtEmail").value, document.querySelector("#txtPassword").value);
      const user = userIdentifiant.user;

      if (user.emailVerified) {
        RenitialisationErreurConnexion();
        Application();
        EtatConnexion(user);
      } else {
        console.log('email pas vérifié');
        await signOut(auth);
      }
    } catch (error) {
      ErreurConnexion(error);
    }
  };

  const createAccount = async () => {
    const loginEmail = document.querySelector("#txtEmail").value;
    const loginPassword = document.querySelector("#txtPassword").value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
      await sendEmailVerification(auth.currentUser);
      console.log("Email de vérification envoyé !");
    } catch (error) {
      console.log(error);
      ErreurConnexion(error);
    }
  };

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        if (user.emailVerified) {
          Application();
          EtatConnexion(user);
          hideLoginError();
        } else {
          signOut(auth);
          showLoginForm();
          const lblAuthState = document.querySelector("#lblAuthState");
          lblAuthState.textContent = "Please verify your email before logging in.";
        }
      } else {
        showLoginForm();
        const lblAuthState = document.querySelector("#lblAuthState");
        lblAuthState.textContent = "You are not logged in";
      }
    });
  };

  const btnLogin = document.querySelector("#btnLogin");
  btnLogin.addEventListener("click", FonctionConnexionEmailMotDePasse);

  const buttonCreate = document.querySelector("#button");
  buttonCreate.addEventListener("click", createAccount);

  if (location.hostname === "127.0.0.1") {
    connectAuthEmulator(auth, "http://127.0.0.1:5002");
    connectDatabaseEmulator(db, "127.0.0.1", 8000);
  }

  monitorAuthState();

  const logout = async () => {
    await signOut(auth);
  };

  const btnLogout = document.querySelector("#btnLogout");
  btnLogout.addEventListener("click", logout);
});
