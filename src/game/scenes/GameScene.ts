import Phaser from "phaser";
import SlashTrail from "../entities/SlashTrail";
import DustParticle from "../effects/DustParticle";
import FruitManager from "../managers/FruitManager";
import ScoreManager from "../managers/ScoreManager";
import SliceEffect from "../effects/SliceEffect";
import FruitHalf from "../entities/FruitHalf";

export default class GameScene extends Phaser.Scene {
  private trail = new SlashTrail();
  private graphics!: Phaser.GameObjects.Graphics;
  private fruitManager!: FruitManager;
  private scoreManager!: ScoreManager;
  private fruitHalves: FruitHalf[] = [];
  private dust: DustParticle[] = [];

  constructor() {
    super("GameScene");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.fruitManager = new FruitManager(this);

    const bg = this.add.image(
      width / 2,
      height / 2,
      "dojo"
    );

    bg.setDisplaySize(width, height);

    this.graphics = this.add.graphics();

    for (let i = 0; i < 60; i++) {
      this.dust.push(new DustParticle(this));
    }

    this.scoreManager = new ScoreManager(this);
    this.scoreManager.create();
  }

  update(time: number, delta: number) {
    for (let i = this.fruitHalves.length - 1; i >= 0; i--) {
    const half = this.fruitHalves[i];

    if (!half.active) {
        this.fruitHalves.splice(i, 1);
        continue;
     }

    half.tick(delta);
    }
    // ----------------------------
    // Dust
    // ----------------------------
    this.dust.forEach((particle) => {
      particle.update(delta);
    });

    // ----------------------------
    // Fruit Manager
    // ----------------------------
    this.fruitManager.update(delta);

    // ----------------------------
    // Pointer
    // ----------------------------
    const pointer = this.input.activePointer;

    this.trail.addPoint(pointer.x, pointer.y);
    this.trail.update(delta);

    this.graphics.clear();

    const velocity = pointer.velocity;

    const speed = Math.sqrt(
      velocity.x * velocity.x +
      velocity.y * velocity.y
    );

    const thickness = Phaser.Math.Clamp(
      speed / 90,
      14,
      30
    );

    const points = this.trail.points;

    // ============================
    // Cyan Glow
    // ============================
    for (let i = 1; i < points.length; i++) {
      const alpha = i / points.length;

      this.graphics.lineStyle(
        thickness * 1.8 * alpha,
        0x00bfff,
        alpha * 0.15
      );

      this.graphics.lineBetween(
        points[i - 1].x,
        points[i - 1].y,
        points[i].x,
        points[i].y
      );
    }

    // ============================
    // Blue Blade
    // ============================
    for (let i = 1; i < points.length; i++) {
      const alpha = i / points.length;

      this.graphics.lineStyle(
        thickness * alpha,
        0x66ccff,
        alpha
      );

      this.graphics.lineBetween(
        points[i - 1].x,
        points[i - 1].y,
        points[i].x,
        points[i].y
      );
    }

    // ============================
    // White Core
    // ============================
    for (let i = 1; i < points.length; i++) {
      const alpha = i / points.length;

      this.graphics.lineStyle(
        thickness * 0.35 * alpha,
        0xffffff,
        alpha
      );

      this.graphics.lineBetween(
        points[i - 1].x,
        points[i - 1].y,
        points[i].x,
        points[i].y
      );
    }

    // ============================
    // Slice Detection
    // ============================

    const fruits = this.fruitManager.getFruits();

    for (const fruit of fruits) {
      if (!fruit.active) continue;

      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];

        const line = new Phaser.Geom.Line(
          p1.x,
          p1.y,
          p2.x,
          p2.y
        );

        const circle = new Phaser.Geom.Circle(
          fruit.x,
          fruit.y,
          fruit.radius
        );

        if (Phaser.Geom.Intersects.LineToCircle(line, circle)) {
          SliceEffect.create(
                this,
                fruit.x,
                fruit.y,
                fruit.juiceColor
            );

            const last = points[points.length - 1];
            const prev = points[points.length - 2];

            let slashX = 0;
            let slashY = -1;

            if (last && prev) {
            slashX = last.x - prev.x;
            slashY = last.y - prev.y;

            const length = Math.sqrt(
                slashX * slashX +
                slashY * slashY
            );

            if (length > 0) {
                slashX /= length;
                slashY /= length;
            }
            }

            const left = new FruitHalf(
            this,
            `${fruit.fruitType}_left`,
            fruit.x,
            fruit.y,
            false,
            slashX,
            slashY
            );

            const right = new FruitHalf(
            this,
            `${fruit.fruitType}_right`,
            fruit.x,
            fruit.y,
            true,
            slashX,
            slashY
            );

            left.rotation = fruit.rotation;
            right.rotation = fruit.rotation;

            // Separate the halves
            left.x -= 10;
            right.x += 10;

            left.y -= 5;
            right.y -= 5;

            // Give them an extra upward kick
            left.velocityY -= 120;
            right.velocityY -= 120;

            this.fruitHalves.push(left);
            this.fruitHalves.push(right);

            fruit.destroy();

            this.scoreManager.add(10);

            this.cameras.main.shake(40, 0.002);

            break;
        }
      }
    }
  }
}