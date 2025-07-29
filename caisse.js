import { produits } from "https://tiffanydurr.github.io/StickiwiCaisse/data.js";

const produitsContainer = document.getElementById("produits");
const basketContainer = document.getElementById("panier");
const inputSearch = document.getElementById("search");

let dataProduits = [];
dataProduits = produits;
let dataBasket = [];
let total = 0;

function displayProduits() {
  produitsContainer.innerHTML = dataProduits
    .map(
      (produit) => `
    <div class="card" id="${produit.id}">
      <img src="${produit.image}"/>
      <div>
        <h1>${produit.titre}</h1>
        <span>${produit.prix} €</span>
      </div>
    </div>
  `
    )
    .join("");
}

displayProduits();

function search() {
  inputSearch.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = produits.filter((p) => p.id.toLowerCase().includes(value));
    produitsContainer.innerHTML = filtered
      .map(
        (produit) => `
      <div class="card" id="${produit.id}">
        <img src="${produit.image}"/>
        <div>
          <h1>${produit.titre}</h1>
          <span>${produit.prix} €</span>
        </div>
      </div>
    `
      )
      .join("");
    addToBasket(); // Ajoute les écouteurs à la nouvelle liste affichée
    if (filtered.length === 1 && value === filtered[0].id.toLowerCase()) {
      const event = new Event("click");
      document.getElementById(filtered[0].id).dispatchEvent(event);
      inputSearch.value = "";
      produitsContainer.innerHTML = "";
      dataProduits = produits;
      displayProduits();
      addToBasket();
    }
  });
}

search();

function addToBasket() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const targetId = card.id;
      const item = produits.find((p) => p.id === targetId);
      if (item) {
        const existing = dataBasket.find((p) => p.id === item.id);
        if (existing) {
          existing.quantite++;
        } else {
          const itemCopy = { ...item, quantite: 1 };
          dataBasket.push(itemCopy);
        }
        displayBasket();
      }
    });
  });
}

addToBasket();

function displayBasket() {
  basketContainer.innerHTML = dataBasket
    .map(
      (item) => `
    <div class="basketItem" id="${item.id}">
      <div class="liste-basket">

      <div class="ligne-1">
         <h1>${item.titre}</h1>
         <span class="prix-unitaire">${item.prix} €</span>
      </div>

      <div class="ligne-2">
        <div class="addornot">
        <button class="retirer" data-id="${item.id}">-</button>
        <span>Qte :${item.quantite}</span>
        <button class="ajouter" data-id="${item.id}">+</button>
        </div>
    <span class="prix-x-quantite"> ${(item.prix * item.quantite).toFixed(2)} €</span>
      </div>
     
  

  
      </div>
           
    </div>
  `
    )
    .join("");

  const boutonsAjouter = document.querySelectorAll(".ajouter");
  const boutonsRetirer = document.querySelectorAll(".retirer");

  boutonsAjouter.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = dataBasket.find((p) => p.id === id);
      if (item) item.quantite++;
      displayBasket();
    });
  });

  boutonsRetirer.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = dataBasket.find((p) => p.id === id);
      if (item && item.quantite > 1) item.quantite--;
      else if (item) dataBasket = dataBasket.filter((p) => p.id !== id);
      displayBasket();
    });
  });

  const prixTotal = dataBasket.reduce((acc, item) => acc + item.prix * item.quantite, 0);
  const prixAPayer = document.getElementById("prix-a-payer");
  if (prixAPayer) prixAPayer.textContent = ` ${prixTotal.toFixed(2)} €`;
}

function dateDisplay() {
  const now = new Date();
  const date = now.toLocaleDateString("fr-FR").slice(0, 8).replace(/\//g, "/");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const formatted = `${date} - ${hours}:${minutes}`;
  const dateConainter = document.getElementById("date");

  dateConainter.innerHTML = formatted;
}

const validerButton = document.querySelector(".valider");
const produitsToHide = document.querySelector(".produits");

validerButton.addEventListener("click", () => {
  produitsToHide.style.display = "none";
  validerButton.style.display = "none";

  dateDisplay();
  const retirerDIV = document.querySelectorAll(".retirer");
  const ajouterDIV = document.querySelectorAll(".ajouter");

  retirerDIV.forEach((retirer) => {
    retirer.style.display = "none";
  });

  ajouterDIV.forEach((ajouter) => {
    ajouter.style.display = "none";
  });
});

const inputTitre = document.getElementById("input-titre");
const inputPrix = document.getElementById("input-prix");
const btnAjouterPerso = document.getElementById("ajouter-personnalise");

btnAjouterPerso.addEventListener("click", () => {
  const titre = inputTitre.value.trim();
  const prix = parseFloat(inputPrix.value.trim().replace(",", "."));

  if (!titre || isNaN(prix)) return;

  const id = `perso-${Date.now()}`;
  const item = { id, titre, prix, image: "", quantite: 1 };

  dataBasket.push(item);
  displayBasket();

  inputTitre.value = "";
  inputPrix.value = "";
});

const totalAPayerDiv = document.querySelector(".totalapayer");
const inputSommeDonnee = document.getElementById("somme-donnee");
const sommeARendreDiv = document.getElementById("sommearendre");

function updateTotaux() {
  const prixTotal = dataBasket.reduce((acc, item) => acc + item.prix * item.quantite, 0);
  totalAPayerDiv.textContent = `${prixTotal.toFixed(2)} €`;

  const valeurEntree = parseFloat(inputSommeDonnee.value.trim().replace(",", "."));
  if (!isNaN(valeurEntree)) {
    const rendu = valeurEntree - prixTotal;
    if (rendu < 0) {
      sommeARendreDiv.textContent = `Manque : ${Math.abs(rendu).toFixed(2)} €`;
    } else {
      sommeARendreDiv.textContent = `À rendre : ${rendu.toFixed(2)} €`;
    }
  } else {
    sommeARendreDiv.textContent = "";
  }
}

inputSommeDonnee.addEventListener("input", updateTotaux);

const oldDisplayBasket = displayBasket;
displayBasket = function () {
  oldDisplayBasket();
  updateTotaux();
};
