const usernames = new Set(JSON.parse(localStorage.getItem("ruleta_users")) || []);
const usernameInput = document.getElementById("usernameInput");
const adminPanel = document.getElementById("adminPanel");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const winnerDiv = document.getElementById("winner");
const adminName = "Tugha_Roblox";

if (usernames.has(adminName)) adminPanel.style.display = "block";
drawWheel();

function addUser() {
  const name = usernameInput.value.trim();
  if (!name || usernames.size >= 200 || usernames.has(name)) return;
  usernames.add(name);
  localStorage.setItem("ruleta_users", JSON.stringify(Array.from(usernames)));
  if (name === adminName) adminPanel.style.display = "block";
  usernameInput.value = "";
  drawWheel();
}

function drawWheel() {
  const entries = Array.from(usernames);
  const angle = (2 * Math.PI) / entries.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < entries.length; i++) {
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.fillStyle = `hsl(${(i * 360) / entries.length}, 100%, 50%)`;
    ctx.arc(250, 250, 250, i * angle, (i + 1) * angle);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(i * angle + angle / 2);
    ctx.fillText(entries[i], 100, 0);
    ctx.restore();
  }
}

function spinWheel() {
  const entries = Array.from(usernames);
  if (entries.length === 0) return;
  const winner = entries[Math.floor(Math.random() * entries.length)];
  winnerDiv.innerText = `🎉 ¡Ganador: ${winner}! 🎉`;
  confetti();
}

function resetWheel() {
  usernames.clear();
  localStorage.removeItem("ruleta_users");
  drawWheel();
  winnerDiv.innerText = "";
}

function confetti() {
  for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = Math.random() * 100 + "%";
    div.style.left = Math.random() * 100 + "%";
    div.style.width = "10px";
    div.style.height = "10px";
    div.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    div.style.borderRadius = "50%";
    div.style.animation = "fall 1.5s linear forwards";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  }
}
