
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  menuToggle.classList.toggle("open");
});


const signupForm = document.getElementById("signupForm");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault(); // empêche l'envoi réel
  modal.style.display = "flex"; // affiche le popup
});

closeModal.addEventListener("click", function () {
  modal.style.display = "none"; // ferme le popup
  window.location.href = "connexion.html"; // redirection vers la connexion
});
