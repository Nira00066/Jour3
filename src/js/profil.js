// Afficher / cacher le formulaire de modification
const editBtn = document.querySelector(".profil-actions button"); // bouton modifier
const editForm = document.getElementById("editForm");
const cancelEdit = document.getElementById("cancelEdit");

editBtn.addEventListener("click", () => {
  editForm.classList.toggle("hidden");
});

cancelEdit.addEventListener("click", () => {
  editForm.classList.add("hidden");
});

document.querySelector(".logout").addEventListener("click", () => {
  alert("Vous êtes déconnecté !");
  window.location.href = "connexion.html";
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nom", document.getElementById("editNom").value);
  formData.append("prenom", document.getElementById("editPrenom").value);
  formData.append("email", document.getElementById("editEmail").value);
  const password = document.getElementById("editPassword").value;
  if (password) formData.append("password", password);
  const avatarFile = document.getElementById("editAvatar").files[0];
  if (avatarFile) formData.append("avatar", avatarFile);

  try {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      body: formData,
      // pas besoin de Content-Type, fetch gère multipart/form-data
    });
    const updatedUser = await res.json();
    displayUser(updatedUser); // mettre à jour la fiche profil
    editForm.classList.add("hidden");
  } catch (err) {
    console.error(err);
  }
});
