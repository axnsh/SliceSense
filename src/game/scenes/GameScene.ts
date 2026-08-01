import Phaser from "phaser";
import SlashTrail from "../entities/SlashTrail";
import DustParticle from "../effects/DustParticle";
import FruitManager from "../managers/FruitManager";
import ScoreManager from "../managers/ScoreManager";
import SliceEffect from "../effects/SliceEffect";
import FruitHalf from "../entities/FruitHalf";
import ExplosionEffect from "../effects/ExplosionEffect";
import { GameState } from "../GameState";
import Fruit from "../entities/Fruit";
import Bomb from "../entities/Bomb";
import SoundManager from "../managers/SoundManager";
import ComboManager from "../managers/ComboManager";
import ComboText from "../effects/ComboText";
import FloatingScore from "../effects/FloatingScore";

export default class GameScene extends Phaser.Scene {
  private trail = new SlashTrail();
  private graphics!: Phaser.GameObjects.Graphics;
  private fruitManager!: FruitManager;
  private scoreManager!: ScoreManager;
  private fruitHalves: FruitHalf[] = [];
  private dust: DustParticle[] = [];
  private timeScale = 1;
  private gameState = GameState.PLAYING;
  private gameOverContainer!: Phaser.GameObjects.Container;
  private soundManager!: SoundManager;
  private comboManager!: ComboManager;
  private lives = 3;
  private heartSprites: Phaser.GameObjects.Image[] = [];
  private bestScore = 0;

  constructor() {
    super("GameScene");
  }

    create() {
        this.gameState = GameState.PLAYING;
        this.timeScale = 1;

        this.soundManager = new SoundManager(this);
        this.comboManager = new ComboManager(this);

        this.cameras.main.setZoom(1);
        this.cameras.main.resetFX();

        this.lives = 3;

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

        // Create UI LAST
        this.createLivesUI();

        this.events.once("shutdown", () => {
        this.events.removeAllListeners("fruit-missed");
        });

        this.events.on("fruit-missed", () => {
            if (!this.isPlaying()) return;
            this.loseLife();
        });

        this.bestScore = Number(
            localStorage.getItem("best-score") ?? 0
        );
    }

      private updateFruitHalves(delta: number) {
      for (let i = this.fruitHalves.length - 1; i >= 0; i--) {
        const half = this.fruitHalves[i];

        if (!half.active) {
          this.fruitHalves.splice(i, 1);
          continue;
        }

        half.tick(delta);
      }
      }

      private updateDust(delta: number) {
        this.dust.forEach((particle) => {
          particle.update(delta);
        });
      }

      private updateFruitManager(delta: number) {
        this.fruitManager.update(delta);
      }

      private updateSlash(delta: number) {

        const pointer = this.input.activePointer;

        if (this.isPlaying()) {
            this.trail.addPoint(pointer.x, pointer.y);
            this.trail.update(delta);
        } else {
            this.trail.points.length = 0;
        }

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

        // Glow
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

        // Blue blade
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

        // White core
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

      }

      private checkFruitSlices() {

    const points = this.trail.points;
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

            if (!Phaser.Geom.Intersects.LineToCircle(line, circle)) {
                continue;
            }

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

            this.sliceFruit(
                fruit,
                slashX,
                slashY
            );

            break;
        }
    }
      }

      private sliceFruit(
    fruit: Fruit,
    slashX: number,
    slashY: number
) {

    this.soundManager.playRandomSlice();
    this.time.delayedCall(35, () => {
        this.soundManager.playRandomSplat();
    });


    SliceEffect.create(
        this,
        fruit.x,
        fruit.y,
        fruit.isGolden ? 0xffd700 : fruit.juiceColor
    );

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

    left.x -= 10;
    right.x += 10;

    left.y -= 5;
    right.y -= 5;

    left.velocityY -= 120;
    right.velocityY -= 120;

    this.fruitHalves.push(left);
    this.fruitHalves.push(right);

    fruit.destroy();

    // Add the fruit's point value
    this.scoreManager.add(fruit.points);

    if (fruit.isGolden) {

        // Bigger shake for golden fruit
        this.cameras.main.shake(80, 0.01);

        // Optional: special golden slice sound
        // this.soundManager.playGolden();

    } else {
        this.cameras.main.shake(40, 0.002);
    }

    const combo = this.comboManager.addSlice();
    const points = 10 * combo;

    FloatingScore.show(
        this,
        fruit.x,
        fruit.y,
        points
    );

    ComboText.show(
        this,
        combo,
        fruit.x,
        fruit.y - 45
        );
    }

      private explodeBomb(bomb: Bomb) {
        this.gameState = GameState.DYING;
        const finalLife = this.lives <= 1;
        bomb.destroy();
        this.soundManager.playBomb();

        ExplosionEffect.create(
            this,
            bomb.x,
            bomb.y
        );

        // Slow motion
        this.timeScale = finalLife ? 0.015 : 0.25;

        // White flash
        const flash = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0xffffff
        );

        flash.setDepth(9999);
        flash.setAlpha(0);

        // Camera shake
        this.cameras.main.shake(
            finalLife ? 700 : 220,
            finalLife ? 0.04 : 0.02
        );

        // Camera punch
        this.tweens.add({
            targets: this.cameras.main,
            zoom: 1.12,
            duration: 120,
            yoyo: true,
            ease: "Quad.Out"
        });

        // Fade to white
        this.tweens.add({
            targets: flash,
            alpha: 1,
            duration: finalLife ? 1200 : 250,
            ease: "Sine.In",

            onComplete: () => {
                let ringing: Phaser.Sound.BaseSound | null = null;
                if (finalLife) {
                    ringing = this.soundManager.playRinging();
                }

                this.time.delayedCall(
                    finalLife ? 2500 : 150,
                    () => {
                        // Fade ringing only on final life
                        if (ringing) {
                            this.tweens.add({
                                targets: ringing,
                                volume: 0,
                                duration: 1000,
                                ease: "Quad.Out",
                                onComplete: () => {
                                    ringing!.stop();
                                    ringing!.destroy();
                                }
                            });
                        }
                        // Fade white
                        this.tweens.add({
                            targets: flash,
                            alpha: 0,
                            duration: finalLife ? 1000 : 180,
                            ease: "Quad.Out",
                            onComplete: () => {
                                flash.destroy();
                                this.timeScale = 1;
                              
                                // Final death
                                this.soundManager.playGameOver();
                                this.showGameOver();
                            }
                        });
                    }
                );
            }
        }); 
    }

      private checkBombSlices() {

    const points = this.trail.points;
    const bombs = this.fruitManager.getBombs();

    for (const bomb of bombs) {

        if (!bomb.active) continue;

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
                bomb.x,
                bomb.y,
                bomb.radius
            );

            if (!Phaser.Geom.Intersects.LineToCircle(line, circle)) {
                continue;
            }

            this.explodeBomb(bomb);

            return;
        }
    }
      }

    update(time: number, delta: number) {

    delta *= this.timeScale;

    if (this.isGameOver()) {
        this.graphics.clear();
        this.trail.points.length = 0;
        return;
    }

    this.updateFruitHalves(delta);

    this.updateDust(delta);

    this.updateFruitManager(delta);

    this.updateSlash(delta);

    if (this.isPlaying()) {
        this.checkFruitSlices();
        this.checkBombSlices();
    }
}

    private createLivesUI() {

    this.heartSprites.forEach(h => h.destroy());
    this.heartSprites = [];

    const scale = 2.3;      // Increase until it looks right
    const spacing = 55;      // Space between hearts

    const startX = this.scale.width - 25;
    const y = 65;

    for (let i = 0; i < this.lives; i++) {

        const heart = this.add.image(
            startX - (i * spacing),
            y,
            "heart"
        );

        heart.setOrigin(1, 0.5);
        heart.setScale(scale);
        heart.setDepth(9999);
        heart.setScrollFactor(0);

        this.heartSprites.push(heart);
      }
    }

    private loseLife() {

    if (this.lives <= 0) return;

    // Lose one life first
    this.lives--;
    this.soundManager.playLifeLost();

    // Heart that should disappear
    const lostHeart = this.heartSprites[this.lives];

    if (lostHeart) {
        this.tweens.add({
            targets: lostHeart,
            scale: 0,
            angle: 180,
            alpha: 0,
            duration: 250,
            ease: "Back.In",
            onComplete: () => {
                this.createLivesUI();
            }
        });
    }

    this.cameras.main.shake(120, 0.01);

    // No lives left
    if (this.lives <= 0) {
        this.soundManager.playGameOver();
        this.showGameOver();
        }
    }

    private showGameOver() {
    if (this.gameState === GameState.GAME_OVER) {
     return;
    }

    this.gameState = GameState.GAME_OVER;

    if (this.gameOverContainer) {
      this.gameOverContainer.destroy();
    }

    this.fruitManager.stop();

    if (this.scoreManager.getScore() > this.bestScore) {

    this.bestScore = this.scoreManager.getScore();

    localStorage.setItem(
        "best-score",
        this.bestScore.toString()
    );

    }

    const width = this.scale.width;
    const height = this.scale.height;

    this.gameOverContainer = this.add.container(0, 0);

    // Dark overlay
    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.45
    );

    // Title
    const title = this.add.text(
      width / 2,
      height / 2 - 120,
      "GAME OVER",
      {
        fontSize: "72px",
        fontStyle: "bold",
        color: "#ffffff"
      }
    ).setOrigin(0.5);

    const scoreLabel = this.add.text(
    width / 2,
    height / 2 - 20,
    `SCORE\n${this.scoreManager.getScore()}`,
    {
        fontSize: "36px",
        align: "center",
        color: "#ffffff"
        }
    ).setOrigin(0.5);

    const score = this.scoreManager.getScore();
    if (score > this.bestScore) {
        this.bestScore = score;

        localStorage.setItem(
            "best-score",
            this.bestScore.toString()
        );
    }

    const bestLabel = this.add.text(
    width / 2,
    height / 2 + 70,
    `BEST\n${this.bestScore}`,
    {
        fontSize: "30px",
        align: "center",
        color: "#FFD54A"
    }
    ).setOrigin(0.5);

    // Retry button
    const retry = this.add.text(
      width / 2,
      height / 2 + 170,
      "RETRY",
      {
        fontSize: "42px",
        backgroundColor: "#00bfff",
        color: "#000",
        padding: {
          left: 28,
          right: 28,
          top: 14,
          bottom: 14
        }
      }
    )
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    retry.on("pointerdown", () => {
      this.soundManager.playButton();
      this.gameState = GameState.PLAYING;      
      this.timeScale = 1;
      this.scene.restart();
    });

    this.gameOverContainer.add([
        overlay,
        title,
        scoreLabel,
        bestLabel,
        retry
    ]);

    this.gameOverContainer.setAlpha(0);

    this.tweens.add({
      targets: this.gameOverContainer,
      alpha: 1,
      duration: 500
    });
  }
        private isPlaying(): boolean {
        return this.gameState === GameState.PLAYING;
    }

    private isDying(): boolean {
        return this.gameState === GameState.DYING;
    }

    private isGameOver(): boolean {
        return this.gameState === GameState.GAME_OVER;
    }
}