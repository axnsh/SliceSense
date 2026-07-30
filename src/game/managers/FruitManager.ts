import Phaser from "phaser";
import Fruit from "../entities/Fruit";
import Bomb from "../entities/Bomb";

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
    let amount = 1;

    if (this.elapsed > 15000) amount = Phaser.Math.Between(1, 2);

    if (this.elapsed > 30000) amount = Phaser.Math.Between(2, 3);

    if (this.elapsed > 60000) amount = Phaser.Math.Between(2, 4);

    for (let i = 0; i < amount; i++) {
      this.scene.time.delayedCall(i * 120, () => {
        this.spawnFruit();
        if (Phaser.Math.Between(1, 100) <= 15) {
        this.spawnBomb();
}
      });
    }
  }

  private spawnFruit() {
    const x = Phaser.Math.Between(
      300,
      this.scene.scale.width - 300
    );

    const y = this.scene.scale.height + 80;

    const fruit = new Fruit(this.scene, x, y);

    this.fruits.push(fruit);
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
}

