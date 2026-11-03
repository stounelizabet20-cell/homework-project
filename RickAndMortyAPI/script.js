const API_URL = "https://rickandmortyapi.com/api/character";

const form = document.getElementById("search-form");
const nameInput = document.getElementById("name-input");
const statusSelect = document.getElementById("status-select");
const message = document.getElementById("message");
const characters = document.getElementById("characters");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

let currentPage = 1;
let totalPages = 1;

async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No characters found or server error");
  }
  return await response.json();
}

function buildUrl() {
  const params = new URLSearchParams();
  params.set("page", currentPage);
  if (nameInput.value.trim() !== "") {
    params.set("name", nameInput.value.trim());
  }
  if (statusSelect.value !== "") {
    params.set("status", statusSelect.value);
  }
  return API_URL + "?" + params.toString();
}

function showCharacter(character) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML =
    '<img src="' + character.image + '" alt="' + character.name + '">' +
    "<h3>" + character.name + "</h3>" +
    "<p>Status: " + character.status + "</p>" +
    "<p>Species: " + character.species + "</p>" +
    "<p>Gender: " + character.gender + "</p>" +
    "<p>Origin: " + character.origin.name + "</p>";
  characters.appendChild(card);
}

async function loadCharacters() {
  message.textContent = "Loading...";
  characters.innerHTML = "";
  try {
    const data = await getData(buildUrl());
    totalPages = data.info.pages;
    data.results.forEach(showCharacter);
    message.textContent = "Found " + data.info.count + " characters";
  } catch (error) {
    totalPages = 1;
    message.textContent = "Error: " + error.message;
  }
  updatePagination();
}

function updatePagination() {
  pageInfo.textContent = "Page " + currentPage + " of " + totalPages;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  currentPage = 1;
  loadCharacters();
});

statusSelect.addEventListener("change", function () {
  currentPage = 1;
  loadCharacters();
});

prevBtn.addEventListener("click", function () {
  currentPage--;
  loadCharacters();
});

nextBtn.addEventListener("click", function () {
  currentPage++;
  loadCharacters();
});

loadCharacters();