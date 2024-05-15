import { initializeApp } from "firebase/app";
import { showLoginError, hideLoginError, showApp, showLoginState, showLoginForm } from "./ui";
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const loginEmailPassword = async () => {
  const loginEmail = document.querySelector("#txtEmail").value;
  const loginPassword = document.querySelector("#txtPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    const user = userCredential.user;

    if (user.emailVerified) {
      console.log("User is logged in and email is verified");
      showApp();
      showLoginState(user);
    } else {
      console.log("Email is not verified");
      await signOut(auth); 
      alert("Please verify your email before logging in.");
      await sendEmailVerification(user);
    }
  } catch (error) {
    console.log(error);
    showLoginError(error);
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
    showLoginError(error);
  }
};

const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      if (user.emailVerified) {
        showApp();
        showLoginState(user);
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
btnLogin.addEventListener("click", loginEmailPassword);

const buttonCreate = document.querySelector("#buttonCreateAccount");
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
