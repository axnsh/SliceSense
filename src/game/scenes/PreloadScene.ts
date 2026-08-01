import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // ============================
    // Background
    // ============================
    this.load.image("dojo", "/images/background/dojo.png");

    // ============================
    // Whole Fruits
    // ============================
    this.load.image("apple", "/images/fruits/apple.png");
    this.load.image("banana", "/images/fruits/banana.png");
    this.load.image("orange", "/images/fruits/orange.png");
    this.load.image("watermelon", "/images/fruits/watermelon.png");
    this.load.image("coconut", "/images/fruits/coconut.png");
    this.load.image("plum", "/images/fruits/plum.png");
    this.load.image("golden_apple", "/images/fruits/golden_apple.png");

    // ============================
    // Fruit Halves
    // ============================
    this.load.image("apple_left", "/images/fruits/apple_left.png");
    this.load.image("apple_right", "/images/fruits/apple_right.png");

    this.load.image("banana_left", "/images/fruits/banana_left.png");
    this.load.image("banana_right", "/images/fruits/banana_right.png");

    this.load.image("orange_left", "/images/fruits/orange_left.png");
    this.load.image("orange_right", "/images/fruits/orange_right.png");

    this.load.image("watermelon_left", "/images/fruits/watermelon_left.png");
    this.load.image("watermelon_right", "/images/fruits/watermelon_right.png");

    this.load.image("coconut_left", "/images/fruits/coconut_left.png");
    this.load.image("coconut_right", "/images/fruits/coconut_right.png");

    this.load.image("plum_left", "/images/fruits/plum_left.png");
    this.load.image("plum_right", "/images/fruits/plum_right.png");

    // ============================
    // Bomb
    // ============================
    this.load.image("bomb", "/images/bombs/bomb.png");

    // ============================
    // Heart
    // ============================
    this.load.image("heart", "/images/ui/heart.png");

    // Slice
    this.load.audio("slice1", "/audio/slice/slice1.mp3");
    this.load.audio("slice2", "/audio/slice/slice2.mp3");
    this.load.audio("slice3", "/audio/slice/slice3.mp3");

    // Juice
    this.load.audio("splat1", "/audio/splat/splat1.mp3");
    this.load.audio("splat2", "/audio/splat/splat2.mp3");

    // Bomb
    this.load.audio("bomb", "/audio/bomb/bomb.mp3");
    this.load.audio("ringing", "/audio/bomb/ringing.mp3");

    // UI
    this.load.audio("button", "/audio/ui/button.mp3");
    this.load.audio("gameover", "/audio/ui/gameover.mp3");
    this.load.audio("lifeLost", "/audio/ui/life_lost.mp3");
  }

  create() {
    this.scene.start("MainMenuScene");
  }

}