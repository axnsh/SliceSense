import Phaser from "phaser";

export default class DustParticle {
  private circle: Phaser.GameObjects.Arc;
  private speed: number;

  constructor(scene: Phaser.Scene) {
    this.circle = scene.add.circle(
      Phaser.Math.Between(0, scene.scale.width),
      Phaser.Math.Between(0, scene.scale.height),
      Phaser.Math.Between(1, 3),
      0xffffff,
      0.08
    );

    this.speed = Phaser.Math.FloatBetween(10, 30);
  }

  update(delta: number) {
    this.circle.y -= this.speed * (delta / 1000);

    if (this.circle.y < -5) {
      this.circle.y = 920;
      this.circle.x = Phaser.Math.Between(0, 1600);
    }
  }
}