import { produits } from "../data.js";

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
        <span>${produit.prix}0 €</span>
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
          <span>${produit.prix}0 €</span>
        </div>
      </div>
    `
      )
      .join("");
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
      <div>
        <h1>${item.titre}</h1>
        <span class="prix-unitaire">${item.prix}0 €</span>

        <button class="retirer" data-id="${item.id}">-</button>
        <span>${item.quantite}</span>
        <button class="ajouter" data-id="${item.id}">+</button>
        <span class="prix-x-quantite">${(item.prix * item.quantite).toFixed(2)} €</span>
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
  if (prixAPayer) prixAPayer.textContent = `${prixTotal.toFixed(2)} €`;
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
