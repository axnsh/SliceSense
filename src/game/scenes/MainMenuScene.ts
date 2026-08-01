import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {

    constructor() {
        super("MainMenuScene");
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.cameras.main.fadeIn(
            500,
            0,
            0,
            0
        );

        // Background
        this.add.image(
            w / 2,
            h / 2,
            "dojo"
        ).setDisplaySize(w, h);

        // Dark overlay
        this.add.rectangle(
            w / 2,
            h / 2,
            w,
            h,
            0x000000,
            0.45
        );

        // Logo
        const title = this.add.text(
            w / 2,
            180,
            "SLICE SENSE",
            {
                fontSize: "82px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut"
        });

        this.add.text(
            w / 2,
            255,
            "Sharpen your reflexes.",
            {
                fontSize: "26px",
                color: "#dddddd"
            }
        ).setOrigin(0.5);

        const play = this.add.text(
            w / 2,
            430,
            "PLAY",
            {
                fontSize: "48px",
                backgroundColor: "#00bfff",
                color: "#000",
                padding: {
                    left: 35,
                    right: 35,
                    top: 16,
                    bottom: 16
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        this.tweens.add({
            targets: play,
            y: play.y - 8,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut"
        });

        play.on("pointerover", () => {
            this.sound.play("button");
            this.tweens.add({
                targets: play,
                scale: 1.1,
                angle: Phaser.Math.Between(-3, 3),
                duration: 120
            });
        });

        play.on("pointerout", () => {
            this.tweens.add({
                targets: play,
                scale: 1,
                angle: 0,
                duration: 120
            });
        });

        play.on("pointerdown", () => {
            this.scene.start("GameScene");
        });

        this.add.text(
            w / 2,
            h - 40,
            "Created by Axl Nash Alcoba",
            {
                fontSize: "18px",
                color: "#bbbbbb"
            }
        ).setOrigin(0.5);
    }
}