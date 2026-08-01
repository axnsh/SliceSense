import Phaser from "phaser";

export default class ExplosionEffect {
  static create(
    scene: Phaser.Scene,
    x: number,
    y: number
  ) {
    // ==========================
    // Main explosion
    // ==========================
    const explosion = scene.add.graphics();

    explosion.fillStyle(0xffffff, 1);
    explosion.fillCircle(0, 0, 35);

    explosion.fillStyle(0xfff176, 0.95);
    explosion.fillCircle(0, 0, 65);

    explosion.fillStyle(0xff9800, 0.85);
    explosion.fillCircle(0, 0, 95);

    explosion.fillStyle(0xff3d00, 0.65);
    explosion.fillCircle(0, 0, 130);

    explosion.setPosition(x, y);

    scene.tweens.add({
      targets: explosion,
      scale: 2.8,
      alpha: 0,
      duration: 450,
      ease: "Cubic.Out",
      onComplete: () => explosion.destroy(),
    });

    // ==========================
    // Shockwave ring
    // ==========================
    const ring = scene.add.circle(
      x,
      y,
      20,
      0xffffff,
      0
    );

    ring.setStrokeStyle(8, 0xffffff);

    scene.tweens.add({
      targets: ring,
      radius: 260,
      alpha: 0,
      duration: 1200,
      ease: "Expo.Out",
      onComplete: () => ring.destroy(),
    });
  }
}