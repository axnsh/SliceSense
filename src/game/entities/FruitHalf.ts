import Phaser from "phaser";

export default class FruitHalf extends Phaser.GameObjects.Sprite {
  velocityX: number;
  velocityY: number;

  gravity = 750;

  rotationSpeed: number;

  life = 1000;

      constructor(
      scene: Phaser.Scene,
      texture: string,
      x: number,
      y: number,
      flip: boolean,
      slashX: number,
      slashY: number
    ) {
    super(scene, x, y, texture);

    scene.add.existing(this);

    this.setScale(0.23);

    const push = 260;

    // Inherit the slash direction
    this.velocityX =
      slashX * 180 +
      (flip ? push : -push);

    this.velocityY =
      slashY * 180 +
      Phaser.Math.Between(-520, -420);

    this.rotationSpeed =
      (flip ? 1 : -1) *
      Phaser.Math.FloatBetween(5, 9);
  }

  tick(delta: number) {
    const dt = delta / 1000;

    this.life -= delta;

    this.velocityY += this.gravity * dt;

    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;

    this.rotation += this.rotationSpeed * dt;

    this.alpha = this.life / 1000;

    if (this.life <= 0) {
      this.destroy();
    }
  }
}