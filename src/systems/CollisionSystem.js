import { AnimatedSprite } from "pixi.js";

export class CollisionSystem {

  constructor(app, player, bullets, enemies, frames, audio, game) {
    this.app = app;
    this.player = player;
    this.bullets = bullets;
    this.enemies = enemies;
    this.frames = frames;
    this.audio = audio;
    this.game = game;
  }

  update() {
    for (let i = this.bullets.length-1; i>=0; i--) {
      const b = this.bullets[i]
      for (let j = this.enemies.length-1; j>=0; j--) {
        const e = this.enemies[j];
        if (
          Math.abs(b.sprite.x - e.sprite.x) < 40 &&
          Math.abs(b.sprite.y - e.sprite.y) < 40
        ) {
          b.dead = true;
          e.dead = true;

          b.sprite.parent?.removeChild(b.sprite);
          e.sprite.parent?.removeChild(e.sprite);
          this.audio.play("explosion");

          const explosionSprite = new AnimatedSprite(this.frames);

          explosionSprite.x = e.sprite.x;
          explosionSprite.y = e.sprite.y;
          explosionSprite.anchor.set(0.5);
          explosionSprite.scale.set(0.3);
          explosionSprite.loop = false;
          explosionSprite.animationSpeed = 0.3;

          this.app.stage.addChild(explosionSprite);
          explosionSprite.play();

          explosionSprite.onComplete = () => explosionSprite.destroy();
      
          this.game.addScore(1);

          this.app.stage.removeChild(b.sprite);
          this.app.stage.removeChild(e.sprite);

          this.bullets.splice(i, 1);
          this.enemies.splice(j, 1);

          return;
        }
      }
    }
  }
}