import Phaser from "phaser";

export default class SliceEffect {
  static create(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: number
  ) {
    // Main juice droplets
    for (let i = 0; i < 24; i++) {
      const particle = scene.add.circle(
        x,
        y,
        Phaser.Math.Between(4, 10),
        color
      );

      const angle = Phaser.Math.FloatBetween(
        0,
        Math.PI * 2
      );

      const distance = Phaser.Math.Between(
        80,
        180
      );

      scene.tweens.add({
        targets: particle,

        x: x + Math.cos(angle) * distance,

        y: y + Math.sin(angle) * distance,

        alpha: 0,

        scale: Phaser.Math.FloatBetween(0.4, 1.2),

        duration: 700,

        ease: "Cubic.Out",

        onComplete: () => particle.destroy(),
      });
    }

    // Small mist
    for (let i = 0; i < 16; i++) {
      const particle = scene.add.circle(
        x,
        y,
        Phaser.Math.Between(2, 5),
        color
      );

      const angle = Phaser.Math.FloatBetween(
        0,
        Math.PI * 2
      );

      const distance = Phaser.Math.Between(
        50,
        120
      );

      scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 900,
        ease: "Quad.Out",

        onComplete: () => particle.destroy(),
      });
    }
  }
}