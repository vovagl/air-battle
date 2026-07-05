import { Application, Assets, Texture } from "pixi.js";
import { Player } from "../entities/Player.js";
import { Bullet } from "../entities/Bullet.js";
import { SpawnSystem } from "../systems/SpawnSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { UI } from "../ui/UI.js";
import { AudioManager } from "./AudioManager.js";
import { Input } from "./Input.js";

export class Game {
  constructor() {
    this.app = new Application();

    this.score = 0;
    this.bestScore = Number(localStorage.getItem("bestScore")) || 0;

    this.player = null;
    this.bullets = [];
    this.enemies = [];

    this.input = null;

    this.spawn = null;
    this.collision = null;

    this.ui = new UI();
    this.ui.init();
    this.ui.setScore(this.score, this.bestScore);

    this.audio = new AudioManager();

    this.frames = [];
    
    this.lastShoot = 0;
    this.shootDelay = 100;

    this.startedAudio = false;

    this.enemySpeed = 3;
    this.kills = 0;

    this.gameOver = false;

    this.paused = false;
  }

  
  initSounds() {
    const base = import.meta.env.BASE_URL;
    this.audio.load("flying", base + "sounds/flying.mp3", 1);
    this.audio.load("shoot", base + "sounds/shoot.mp3", 1);
    this.audio.load("explosion", base + "sounds/explosion.mp3", 1);
  }

  async init() {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight * 0.9,
      backgroundColor: 0x1099bb,
    });

    document.body.appendChild(this.app.canvas);

    await this.initSounds();
    await this.loadExplosion();

    this.audio.loop("flying");

    this.player = new Player(this.app);
    await this.player.init();

    this.spawn = new SpawnSystem(this.app, this.enemies, this);

    this.collision = new CollisionSystem(
      this.app,
      this.player,
      this.bullets,
      this.enemies,
      this.frames,
      this.audio,
      this
    );

    this.ui.init();
    this.ui.setScore(this.score, this.bestScore);
    this.app.stage.addChild(this.player.sprite);
  }
setControlMode(mode) {
  this.controlMode = mode;
}

pause() {
  if (!this.app?.ticker) return;

  this.app.ticker.stop();

}

resume() {
  if (!this.app?.ticker) return;

  this.app.ticker.start();
}

  start() {
    window.addEventListener(
      "pointerdown",
      () => {
        if (!this.startedAudio) {
          this.startedAudio = true;
        }
      },
      { once: true }
    );
    this.spawn.start();

    this.app.ticker.add(() => this.update());
  }

  shoot() {
    this.audio.play?.("shoot");
    const bullet = new Bullet(
    this.player.sprite.x,
    this.player.sprite.y-60 
  );

  this.bullets.push(bullet);

  this.app.stage.addChild(bullet.sprite);
  }

  async loadExplosion() {
    const sheet = await Assets.load(import.meta.env.BASE_URL + "images/explosion.png");

    const widths = [287, 383, 448, 440, 520, 480, 424];
    const h = 450;

    let x = 0;
    this.frames = [];

    for (let w of widths) {
      this.frames.push(
        new Texture({
          source: sheet.source,
          frame: { x, y: 0, width: w, height: h },
        })
      );
      x += w;
    }
  }

  update() {
  
    if (this.gameOver) return;
  if (!this.input || !this.player) return;

     if (!this.input || !this.player) return;

  const player = this.player.sprite;
  const screenW = this.app.screen.width;

  let move = 0;

  if (this.input.mode === "touch") {
    if (this.input.left) move -= 1;
    if (this.input.right) move += 1;
  } 
  else {
    const mid = screenW / 2;

    if (this.input.pointerX < mid - 20) move -= 1;
    else if (this.input.pointerX > mid + 20) move += 1;
  }

  player.x += move * 5;

  player.x = Math.max(0, Math.min(screenW, player.x));

  const now = performance.now();
  if (this.input.fireHeld) {
    const diff = now - this.lastShoot;
    if (diff >= this.shootDelay) {
    this.shoot();
    this.lastShoot = now;
    } 
  }
  this.spawn.update();

  for (let i = this.bullets.length - 1; i >= 0; i--) {
    const b = this.bullets[i];
    b.update();
    if (b.dead) this.bullets.splice(i, 1);
  }

  for (let i = this.enemies.length - 1; i >= 0; i--) {
    const e = this.enemies[i];
    e.update(this.enemySpeed);
    if (e.sprite.y >= this.app.screen.height) {
    this.gameOverScreen();
    return;
  }
    if (e.dead) this.enemies.splice(i, 1);
  }

  this.collision.update();
  }
  addScore(value = 1) {
  this.score += value;
  this.kills += value;
  if (this.kills % 5 === 0) {
    this.enemySpeed += 0.5;
  }
  if (this.score > this.bestScore) {
    this.bestScore = this.score;
    localStorage.setItem("bestScore", this.bestScore);
  }
  this.ui?.setScore?.(this.score, this.bestScore);
}
gameOverScreen() {
  if (this.gameOver) return;
  this.gameOver = true;

   clearInterval(this.spawn.timer);
   this.app.ticker.stop();
   const over = document.getElementById("gameOver");
  const score = document.getElementById("finalScore");

  score.textContent = this.score;
  over.style.display = "flex";
}
}
