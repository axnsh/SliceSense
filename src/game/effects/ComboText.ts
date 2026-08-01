import Phaser from "phaser";

export default class ComboText {
    static show(
        scene: Phaser.Scene,
        combo: number,
        x: number,
        y: number
    ) {
        if (combo < 2) return;

        let text = `COMBO x${combo}`;
        let color = "#ffffff";
        let size = "52px";

        switch (combo) {
            case 2:
                text = "DOUBLE SLICE!";
                color = "#66ccff";
                break;

            case 3:
                text = "TRIPLE SLICE!";
                color = "#00ff88";
                break;

            case 4:
                text = "QUAD SLASH!";
                color = "#ffdd00";
                break;

            case 5:
                text = "FRENZY!";
                color = "#ff8800";
                size = "60px";
                break;

            case 6:
                text = "UNSTOPPABLE!";
                color = "#ff4444";
                size = "64px";
                break;

            case 7:
                text = "DOMINATING!";
                color = "#ff33aa";
                size = "68px";
                break;

            case 8:
                text = "LEGENDARY!";
                color = "#ffd700";
                size = "72px";
                break;

            default:
                if (combo >= 9) {
                    text = "GODLIKE!";
                    color = "#FF4D4D";
                    size = "80px";
                }
                break;
        }

        const label = scene.add.text(
            x,
            y,
            text,
            {
                fontSize: size,
                fontStyle: "bold",
                color,
                stroke: "#000000",
                strokeThickness: 8
            }
        )
        .setOrigin(0.5)
        .setScale(0.2)
        .setDepth(999);

        // Screen shake on higher combos
        scene.cameras.main.shake(
            70,
            Math.min(combo * 0.0015, 0.02)
        );

        // Pop-in animation sequence
        scene.tweens.add({
            targets: label,
            scale: 1.15,
            y: label.y - 30,
            angle: Phaser.Math.Between(-5, 5),
            duration: 180,
            ease: "Back.Out",
            onComplete: () => {
                scene.tweens.add({
                    targets: label,
                    scale: 1,
                    duration: 120,
                    ease: "Quad.Out"
                });

                scene.tweens.add({
                    targets: label,
                    alpha: 0,
                    y: label.y - 70,
                    scale: 1.3,
                    duration: 700,
                    ease: "Cubic.Out",
                    onComplete: () => {
                        label.destroy();
                    }
                });
            }
        });
    }
}