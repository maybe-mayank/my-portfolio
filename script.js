/* ---------- Theme toggle ---------- */
const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");

function updateThemeButton() {
  // The button names the theme you will switch TO
  themeButton.textContent = root.getAttribute("data-theme") === "dark" ? "Light" : "Dark";
}

themeButton.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) { /* storage may be blocked */ }
  updateThemeButton();
});
updateThemeButton();

/* ---------- Typing effect for the role line ---------- */
const typedEl = document.getElementById("typed");
const roles = ["Metallurgy student", "C, C++ and Python coder", "Web developer in the making", "JEE mentor"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function runTyping() {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIndex);

    let delay = deleting ? 40 : 80;
    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1600; // pause on the full word
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
}
if (!reducedMotion) runTyping();

/* ---------- Highlight the current section in the nav ---------- */
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((section) => observer.observe(section));

/* ---------- Tic Tac Toe ---------- */
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let cells = [];
let state = Array(9).fill("");
let player = "X";
let gameOver = false;

function buildBoard() {
  boardEl.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cell";
    btn.setAttribute("aria-label", "Square " + (i + 1) + ", empty");
    btn.addEventListener("click", () => play(i));
    boardEl.appendChild(btn);
    cells.push(btn);
  }
}

function play(i) {
  if (gameOver || state[i]) return;
  state[i] = player;
  cells[i].textContent = player;
  cells[i].classList.add(player.toLowerCase());
  cells[i].setAttribute("aria-label", "Square " + (i + 1) + ", " + player);

  const line = WIN_LINES.find((combo) => combo.every((idx) => state[idx] === player));
  if (line) {
    line.forEach((idx) => cells[idx].classList.add("win"));
    statusEl.textContent = "Player " + player + " wins!";
    gameOver = true;
  } else if (state.every(Boolean)) {
    statusEl.textContent = "It's a draw.";
    gameOver = true;
  } else {
    player = player === "X" ? "O" : "X";
    statusEl.textContent = "Player " + player + "'s turn";
  }
}

function resetGame() {
  state = Array(9).fill("");
  player = "X";
  gameOver = false;
  statusEl.textContent = "Player X's turn";
  buildBoard();
}

resetBtn.addEventListener("click", resetGame);
buildBoard();

/* ---------- Contact form (works with Netlify Forms) ---------- */
const form = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMsg.textContent = "Sending...";
  const data = new URLSearchParams(new FormData(form)).toString();
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });
    if (!response.ok) throw new Error("Request failed");
    formMsg.textContent = "Thanks! Your message was sent.";
    form.reset();
  } catch (error) {
    formMsg.textContent = "Could not send. Please email me at mayanksoni1407@gmail.com instead.";
  }
});
