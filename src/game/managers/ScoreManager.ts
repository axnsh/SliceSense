import Phaser from "phaser";

export default class ScoreManager {
  private scene: Phaser.Scene;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private bestScore = 0;
  private bestText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    const saved = localStorage.getItem("sliceSenseBest");

    if (saved) {
        this.bestScore = parseInt(saved);
    }

    this.scoreText = this.scene.add.text(30, 25, "Score: 0", {
      fontFamily: "Arial",
      fontSize: "40px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
    });

    this.scoreText.setDepth(100);

    this.bestText = this.scene.add.text(
    25,
    70,
    `BEST: ${this.bestScore}`,
      {
        fontSize: "28px",
        color: "#FFD700",
        fontStyle: "bold"
        }
    );

    this.bestScore = Number(
    localStorage.getItem("best-score") ?? 0
    );
  }

  add(points: number) {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
    if (this.score > this.bestScore) {
    this.bestScore = this.score;

    localStorage.setItem(
        "sliceSenseBest",
        this.bestScore.toString()
    );
        this.bestText.setText(
            `BEST: ${this.bestScore}`
        );
    }

      this.scene.tweens.add({
        targets: this.bestText,
        scale: 1.3,
        duration: 120,
        yoyo: true,
        ease: "Back.Out"
      });
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.score = 0;
    this.scoreText.setText("Score: 0");
  }
}