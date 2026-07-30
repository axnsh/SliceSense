import Phaser from "phaser";

export default class ScoreManager {
  private scene: Phaser.Scene;

  private score = 0;

  private scoreText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.scoreText = this.scene.add.text(30, 25, "Score: 0", {
      fontFamily: "Arial",
      fontSize: "40px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
    });

    this.scoreText.setDepth(100);
  }

  add(points: number) {
    this.score += points;

    this.scoreText.setText(`Score: ${this.score}`);
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.score = 0;
    this.scoreText.setText("Score: 0");
  }
}