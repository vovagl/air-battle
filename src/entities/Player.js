import { Sprite, Assets } from "pixi.js";
import { Bullet } from "./Bullet.js";


export class Player {
  constructor(app) {
    this.app = app;
    this.sprite = null;
    this.speed = 5;
  }

  async init() {
    const tex = await Assets.load(import.meta.env.BASE_URL + "images/plane.png");

    this.sprite = new Sprite(tex);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.scale.set(0.015);

    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height+15;
  }

  update(input) {
    if (input.left) this.sprite.x -= this.speed;
    if (input.right) this.sprite.x += this.speed;
  }

  shoot(bullets, app) {
    const bX=this.sprite.x;
    const bY=
       this.sprite.y - 60;
    const b = new Bullet(bX, bY);
    bullets.push(b);
    app.stage.addChild(b.sprite);
    this.app.game.audio.play("shoot");
}
  
}
