
let names = JSON.parse(localStorage.getItem("ruleta_names")) || [];
let hasSubmitted = localStorage.getItem("has_submitted") === "true";
const nameInput = document.getElementById("nameInput");
const submitBtn = document.getElementById("submitName");
const spinBtn = document.getElementById("spinButton");
const resetBtn = document.getElementById("resetButton");
const namesList = document.getElementById("namesList");
const message = document.getElementById("message");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas?.getContext("2d");
let angle = 0;
let spinning = false;

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
    if (spinning) return;
    if (names.length < 2) {
      alert("Necesitas al menos 2 participantes.");
      return;
    }
    spinWheel();
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

function drawWheel() {
  if (!canvas || !ctx) return;
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const arc = (2 * Math.PI) / names.length;
  names.forEach((name, i) => {
    const start = angle + i * arc;
    const end = start + arc;
    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? "#FFCC00" : "#FF6666";
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.fill();
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#000";
    ctx.font = "14px sans-serif";
    ctx.fillText(name, radius / 2, 0);
    ctx.restore();
  });
  // Dibuja puntero
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(radius - 10, -10);
  ctx.lineTo(radius + 10, -10);
  ctx.fill();
}

function spinWheel() {
  let velocity = Math.random() * 0.3 + 0.3; // Velocidad inicial
  spinning = true;
  const spin = () => {
    angle += velocity;
    velocity *= 0.98; // Frenado
    drawWheel();
    if (velocity > 0.002) {
      requestAnimationFrame(spin);
    } else {
      spinning = false;
      const arc = (2 * Math.PI) / names.length;
      const index = Math.floor((names.length - (angle % (2 * Math.PI)) / arc)) % names.length;
      const winner = names[index];
      alert("🎉 Ganador: " + winner);
    }
  };
  spin();
}

if (canvas && names.length > 0) drawWheel();
