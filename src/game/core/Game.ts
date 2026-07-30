import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import GameConfig from "../config/GameConfig";
import PreloadScene from "../scenes/PreloadScene";

export default class SliceSenseGame extends Phaser.Game {
  constructor(parent: HTMLDivElement) {
    super({
      type: Phaser.AUTO,

      width: GameConfig.width,
      height: GameConfig.height,

      parent,

      backgroundColor: GameConfig.backgroundColor,

      fps: {
        target: GameConfig.targetFPS,
      },

      scene: [
        PreloadScene,
        GameScene
        ],
    });
  }
}