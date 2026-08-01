import Phaser from "phaser";

export default class FloatingScore {

    static show(
        scene: Phaser.Scene,
        x: number,
        y: number,
        score: number
    ) {

        const text = scene.add.text(
            x,
            y,
            `+${score}`,
            {
                fontSize: "38px",
                fontStyle: "bold",
                color:
                    score >= 50 ? "#ff4444" :
                    score >= 30 ? "#ff8800" :
                    score >= 20 ? "#66ff66" :
                    "#FFD700",
                stroke: "#000000",
                strokeThickness: 6
            }
        );

        text.setOrigin(0.5);
        text.setDepth(1000);

        scene.tweens.add({
            targets: text,
            y: y - 90,
            alpha: 0,
            scale: 1.4,
            duration: 700,
            ease: "Cubic.Out",

            onComplete: () => {
                text.destroy();
            }
        });
    }
}