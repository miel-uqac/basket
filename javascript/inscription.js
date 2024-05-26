import { app } from "./index";
import {creerCompte,surveillanceEtatAuthentification} from "./authentification";
import { retour } from "./ui";



// Chargement du JavaScript après le chargement de la page HTML
document.addEventListener('DOMContentLoaded', () => {
    app;

    surveillanceEtatAuthentification();

  
    const btnCreationCompte = document.querySelector("#btnCreerCompte");
    btnCreationCompte.addEventListener("click", creerCompte);


  
  });