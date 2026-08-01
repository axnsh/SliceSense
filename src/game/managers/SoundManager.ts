import Phaser from "phaser";

export default class SoundManager {

    constructor(
        private scene: Phaser.Scene
    ) {}

    playRandomSlice() {

        const sounds = [
            "slice1",
            "slice2",
            "slice3"
        ];

        this.scene.sound.play(
            Phaser.Utils.Array.GetRandom(sounds),
            {
                volume: 0.45
            }
        );
    }

    playRandomSplat() {

        const sounds = [
            "splat1",
            "splat2"
        ];

        this.scene.sound.play(
            Phaser.Utils.Array.GetRandom(sounds),
            {
                volume: 0.55
            }
        );
    }

    playBomb() {

        this.scene.sound.play(
            "bomb",
            {
                volume: 0.8
            }
        );
    }

    playRinging() {
        const ringing = this.scene.sound.add("ringing");

        ringing.setVolume(0.5);
        ringing.play();
        return ringing;
    }

    playButton() {
        this.scene.sound.play(
            "button",
            {
                volume: 0.6
            }
        );
    }

    playGameOver() {

        this.scene.sound.play(
            "gameover",
            {
                volume: 0.8
            }
        );
    }

    playLifeLost() {
        this.scene.sound.play("lifeLost", {
        volume: 0.7
    });
}

}