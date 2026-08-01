import Phaser from "phaser";

export default class ComboManager {

    private combo = 0;

    private lastSliceTime = 0;

    private readonly comboWindow = 700;

    constructor(
        private scene: Phaser.Scene
    ) {}

    addSlice() {

        const now = this.scene.time.now;

        if (now - this.lastSliceTime <= this.comboWindow) {
            this.combo++;
        } else {
            this.combo = 1;
        }

        this.lastSliceTime = now;

        return this.combo;
    }

    reset() {
        this.combo = 0;
    }

    getCombo() {
        return this.combo;
    }
}