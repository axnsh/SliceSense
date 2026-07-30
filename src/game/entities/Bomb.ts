import Phaser from "phaser";

export default class Bomb extends Phaser.GameObjects.Sprite {
  public radius = 50;

  velocityX: number;
  velocityY: number;

  gravity = 750;
  rotationSpeed: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bomb");

    scene.add.existing(this);

    this.setScale(0.37);

    const center = scene.scale.width / 2;

    if (x < center - 250) {
      this.velocityX = Phaser.Math.Between(120, 280);
    } else if (x > center + 250) {
      this.velocityX = Phaser.Math.Between(-280, -120);
    } else {
      this.velocityX = Phaser.Math.Between(-180, 180);
    }

    this.velocityY = Phaser.Math.Between(-1150, -950);

    this.rotationSpeed = Phaser.Math.FloatBetween(-4, 4);
  }

  tick(delta: number) {
    const dt = delta / 1000;

    this.velocityY += this.gravity * dt;

    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;

    this.rotation += this.rotationSpeed * dt;
  }

  isOffScreen(height: number) {
    return this.y > height + 200;
  }
}