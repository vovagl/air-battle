import { Sprite, Assets } from "pixi.js";

export class Enemy {
  constructor(x) {
    this.sprite = null;
    this.x = x;
    this.y = -50;
    this.speed = 3;
    this.dead = false;
  }

  async init() {
    const tex = await Assets.load("./images/plane.png");

    this.sprite = new Sprite(tex);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.scale.set(0.015);

    this.sprite.rotation = Math.PI;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  update(gameSpeed) {
    this.sprite.y += gameSpeed;

    if (this.sprite.y > window.innerHeight) {
      this.dead = true;
    }
  }
}
