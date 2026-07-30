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
  }

  create() {
    this.scene.start("GameScene");
  }
}