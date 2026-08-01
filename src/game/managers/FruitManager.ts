import Phaser from "phaser";
import Fruit from "../entities/Fruit";
import Bomb from "../entities/Bomb";

enum SpawnPattern {
    SINGLE,
    DOUBLE,
    TRIPLE,
    HORIZONTAL,
    DIAGONAL,
    ARC
  }

export default class FruitManager {
  private scene: Phaser.Scene;
  private fruits: Fruit[] = [];
  private bombs: Bomb[] = [];
  private spawnTimer = 0;
  private waveDelay = 1800;
  private elapsed = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  update(delta: number) {
    this.elapsed += delta;
    this.spawnTimer += delta;

    // Difficulty scaling
    if (this.elapsed < 15000) {
      this.waveDelay = 1800;
    } else if (this.elapsed < 30000) {
      this.waveDelay = 1400;
    } else if (this.elapsed < 60000) {
      this.waveDelay = 1100;
    } else {
      this.waveDelay = 900;
    }

    if (this.spawnTimer >= this.waveDelay) {
      this.spawnWave();
      this.spawnTimer = 0;
    }

    for (let i = this.fruits.length - 1; i >= 0; i--) {
      const fruit = this.fruits[i];

        if (!fruit.active) {
        this.fruits.splice(i, 1);
        continue;
        }

        fruit.tick(delta);

      if (fruit.isOffScreen(this.scene.scale.height)) {
          fruit.destroy();
          this.fruits.splice(i, 1);

          // Notify GameScene that a fruit was missed
          this.scene.events.emit("fruit-missed");
      }
    }
      for (let i = this.bombs.length - 1; i >= 0; i--) {
      const bomb = this.bombs[i];

      if (!bomb.active) {
        this.bombs.splice(i, 1);
        continue;
      }

      bomb.tick(delta);

      if (bomb.isOffScreen(this.scene.scale.height)) {
        bomb.destroy();
        this.bombs.splice(i, 1);
      }
    }
  }

    private spawnWave() {

    let patterns: SpawnPattern[] = [];

    // difficulty patterns...
    // ...

    // Special mixed wave
    if (Phaser.Math.Between(1, 100) <= 12) {

        this.spawnTriple();

        this.scene.time.delayedCall(250, () => {
            this.spawnHorizontal();
        });

        return;
    }

    const pattern = Phaser.Utils.Array.GetRandom(patterns);

    switch (pattern) {

        case SpawnPattern.SINGLE:
            this.spawnSingle();
            break;

        case SpawnPattern.DOUBLE:
            this.spawnDouble();
            break;

        case SpawnPattern.TRIPLE:
            this.spawnTriple();
            break;

        case SpawnPattern.HORIZONTAL:
            this.spawnHorizontal();
            break;

        case SpawnPattern.DIAGONAL:
            this.spawnDiagonal();
            break;

        case SpawnPattern.ARC:
            this.spawnArc();
            break;
    }

    // 👇 ADD THE BOMB CHANCE HERE
    let bombChance = 10;

    if (this.elapsed > 30000) bombChance = 15;
    if (this.elapsed > 60000) bombChance = 22;
    if (this.elapsed > 90000) bombChance = 30;

    if (Phaser.Math.Between(1, 100) <= bombChance) {

        this.scene.time.delayedCall(
            Phaser.Math.Between(100, 500),
            () => this.spawnBomb()
        );
    }
}

    private spawnSingle() {

      const x = Phaser.Math.Between(300, this.scene.scale.width - 300);

      this.queueFruit(
          x,
          this.scene.scale.height + 80,
          0
      );

  }

    private spawnDouble() {

      const center = Phaser.Math.Between(
          350,
          this.scene.scale.width - 350
      );

      this.queueFruit(center - 120, this.scene.scale.height + 80, 0);
      this.queueFruit(center + 120, this.scene.scale.height + 80, 70);
  }

    private spawnTriple() {

      const center = Phaser.Math.Between(
          400,
          this.scene.scale.width - 400
      );

      this.queueFruit(center - 150, this.scene.scale.height + 80, 0);

this.queueFruit(center, this.scene.scale.height + 40, 70);

this.queueFruit(center + 150, this.scene.scale.height + 80, 140);

  }

    private spawnHorizontal() {

      const y = this.scene.scale.height + 80;

      this.queueFruit(250, y, 0);
      this.queueFruit(this.scene.scale.width / 2, y, 70);
      this.queueFruit(this.scene.scale.width - 250, y, 140);

  }

    private spawnDiagonal() {

      const y = this.scene.scale.height + 80;

      this.queueFruit(250, y, 0);
      this.queueFruit(450, y + 70, 70);
      this.queueFruit(650, y + 140, 140);

  }

    private spawnArc() {

      const center = this.scene.scale.width / 2;
      const base = this.scene.scale.height + 120;

      this.queueFruit(center - 180, base, 0);
      this.queueFruit(center, base - 120, 70);
      this.queueFruit(center + 180, base, 140);

  }

    private spawnFruitAt(x: number, y: number) {

      const isGolden = Phaser.Math.Between(1, 100) <= 3;
      const fruit = new Fruit(
        this.scene,
        x,
        y,
        isGolden
        );
        this.fruits.push(fruit);
    }

    private queueFruit(
    x: number,
    y: number,
    delay: number
  ) {
      this.scene.time.delayedCall(delay, () => {
          this.spawnFruitAt(x, y);
      });
  }
  
    public getFruits() {
        return this.fruits;
    }
    private spawnBomb() {
    const x = Phaser.Math.Between(
      300,
      this.scene.scale.width - 300
    );

    const y = this.scene.scale.height + 80;

    const bomb = new Bomb(this.scene, x, y);

    this.bombs.push(bomb);
  }
    public getBombs() {
    return this.bombs;
  }
  
    public stop() {
    this.spawnTimer = 0;
    this.waveDelay = Number.MAX_SAFE_INTEGER;
  }
}

