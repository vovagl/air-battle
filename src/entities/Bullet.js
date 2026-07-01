import { Graphics } from "pixi.js";


export class Bullet {
  constructor(x, y) {
    this.sprite = new Graphics()
      .rect(-2, -10, 4, 10)
      .fill(0xffff00);

    this.sprite.x = x;
    this.sprite.y = y;

    this.speed = 10;
    this.dead = false;
  }

  update() {
    this.sprite.y -= this.speed;

    if (this.sprite.y < 0) {
      this.dead = true;
      this.sprite.parent?.removeChild(this.sprite);
    }
  }
}