import Phaser from "phaser";

const FRUIT_DATA = {
  apple: {
    juiceColor: 0xff3b30,
    scale: 0.23,
    radius: 45,
    points: 10,
  },

  banana: {
    juiceColor: 0xffeb3b,
    scale: 0.23,
    radius: 45,
    points: 10,
  },

  orange: {
    juiceColor: 0xff9800,
    scale: 0.23,
    radius: 45,
    points: 10,
  },

  watermelon: {
    juiceColor: 0xff4f81,
    scale: 0.23,
    radius: 50,
    points: 10,
  },

  coconut: {
    juiceColor: 0xf5f5f5,
    scale: 0.23,
    radius: 42,
    points: 10,
  },

  plum: {
    juiceColor: 0x8e44ad,
    scale: 0.23,
    radius: 40,
    points: 10,
  },
} as const;

export default class Fruit extends Phaser.GameObjects.Sprite {
  public radius = 45;
  public juiceColor: number;
  public fruitType: keyof typeof FRUIT_DATA;
  public points: number;
  public isGolden = false;

  velocityX: number;
  velocityY: number;

  gravity = 750;
  rotationSpeed: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    isGolden = false
) {

    const fruitNames = Object.keys(
        FRUIT_DATA
    ) as (keyof typeof FRUIT_DATA)[];

    const texture = Phaser.Utils.Array.GetRandom(fruitNames);

    const data = FRUIT_DATA[texture];

    // Must call super() before using "this"
    super(scene, x, y, texture);

    scene.add.existing(this);

    this.fruitType = texture;
    this.juiceColor = data.juiceColor;
    this.radius = data.radius;
    this.points = data.points;

    this.setScale(data.scale);

    // Golden fruit
    this.isGolden = isGolden;

    if (this.isGolden) {
        this.setTint(0xffd700);
        this.points = 50; // Golden fruits are worth more
    }

    // ============================
    // Launch toward the center
    // ============================

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