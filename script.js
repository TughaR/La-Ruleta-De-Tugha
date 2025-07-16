
let names = JSON.parse(localStorage.getItem("ruleta_names")) || [];
let hasSubmitted = localStorage.getItem("has_submitted") === "true";
const nameInput = document.getElementById("nameInput");
const submitBtn = document.getElementById("submitName");
const spinBtn = document.getElementById("spinButton");
const resetBtn = document.getElementById("resetButton");
const namesList = document.getElementById("namesList");
const message = document.getElementById("message");

// Mostrar lista de nombres si es admin
if (namesList) {
  updateNameList();
}

if (submitBtn) {
  submitBtn.onclick = () => {
    const name = nameInput.value.trim();
    if (!name) {
      message.textContent = "Nombre no válido.";
      return;
    }
    if (hasSubmitted) {
      message.textContent = "Ya enviaste tu nombre.";
      return;
    }
    names.push(name);
    localStorage.setItem("ruleta_names", JSON.stringify(names));
    localStorage.setItem("has_submitted", "true");
    message.textContent = "¡Nombre enviado!";
    location.reload();
  };
}

if (spinBtn) {
  spinBtn.onclick = () => {
    if (names.length < 2) {
      alert("Necesitas al menos 2 participantes.");
      return;
    }
    const winner = names[Math.floor(Math.random() * names.length)];
    alert("🎉 Ganador: " + winner);
  };
}

if (resetBtn) {
  resetBtn.onclick = () => {
    if (confirm("¿Seguro que deseas reiniciar la ruleta?")) {
      localStorage.removeItem("ruleta_names");
      localStorage.removeItem("has_submitted");
      names = [];
      location.reload();
    }
  };
}

function updateNameList() {
  namesList.innerHTML = "";
  names.forEach((n) => {
    const li = document.createElement("li");
    li.textContent = n;
    namesList.appendChild(li);
  });
}
