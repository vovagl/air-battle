import { Game } from "./core/Game.js";
import { Input } from "./core/Input.js";

const game = new Game();

const menu = document.getElementById("menu");
const ui = document.getElementById("move");
const startBtn = document.getElementById("start");
const rotateMessage = document.getElementById("rotateMessage");
let gameStarted = false;
let lastState = "";

function isMobileLayout() {
  return Math.min(
    window.innerWidth,
    window.innerHeight
  ) < 900;
}

function isPortrait() {
  return window.innerHeight > window.innerWidth;
}


function getMode() {
  return isMobileLayout() ? "touch" : "mouse";
}


function pauseGame() {
  if (!gameStarted) return;

  game.paused = true;

  if (game.app?.ticker) {
    game.app.ticker.stop();
  }
}


function resumeGame() {
  if (!gameStarted) return;

  if (!game.paused) return;

  game.paused = false;

  if (game.app?.ticker) {
    game.app.ticker.start();
  }
}


function updateUI() {
  const mobile = isMobileLayout();
  const portrait = isPortrait();
 
   const state =
    `${mobile}-${portrait}`;


  if (state === lastState) return;

  lastState = state;


if (!mobile) {
    ui.style.display = "none";
    rotateMessage.style.display = "none";
    resumeGame();
    return;
  }
  
  if (portrait) {

    ui.style.display = "flex";
    rotateMessage.style.display = "none";

    resumeGame();

  } else {

    ui.style.display = "none";
    rotateMessage.style.display = "flex";

    pauseGame();
  }
  if (game.app?.renderer) {

    game.app.renderer.resize(
      window.innerWidth,
      window.innerHeight * 0.9
    );
  }

}

window.addEventListener(
  "resize",
  updateUI
);

window.addEventListener(
  "orientationchange",
  () => {
    setTimeout(updateUI,300);
  }
);


updateUI();


startBtn.addEventListener("click", async () => {
  menu.style.display = "none";

  await game.init();

  const input = new Input();
  input.init(game.app.canvas, getMode());

  game.input = input;
  gameStarted = true;
  
  game.start();
  updateUI();
});