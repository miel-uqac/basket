import { AuthErrorCodes } from "firebase/auth";

export const showLoginError = (error) => {
  const divLoginError = document.querySelector('#divLoginError');
  const lbLoginErrorMessage = document.querySelector('#lbLoginErrorMessage');

  divLoginError.style.display = 'block';
  
  if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
    lbLoginErrorMessage.textContent = 'Wrong password. Try again.';
  } else {
    lbLoginErrorMessage.textContent = `Error: ${error.message}`;
  }
};

export const hideLoginError = () => {
  const divLoginError = document.querySelector('#divLoginError');
  divLoginError.style.display = 'none';
};

export const showApp = () => {
  console.log("App is shown");
};

export const showLoginState = (user) => {
  console.log(`User is logged in: ${user.email}`);
};

export const showLoginForm = () => {
  console.log("Show login form");
};
