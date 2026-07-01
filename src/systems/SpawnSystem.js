import { Enemy } from "../entities/Enemy.js";

export class SpawnSystem {
  constructor(app, enemies, game) {
    this.app = app;
    this.enemies = enemies;
    this.timer = null;
    this.game = game;
  }

  start() {
    this.timer = setInterval(async () => {
      const e = new Enemy(Math.random() * this.app.screen.width);
      await e.init();
      e.speed = this.game.enemySpeed;
      this.enemies.push(e);
      this.app.stage.addChild(e.sprite);
    }, 1500);
  }
  update() {}
}
