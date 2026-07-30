export interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default class SlashTrail {
  points: TrailPoint[] = [];

  addPoint(x: number, y: number) {
    this.points.push({
      x,
      y,
      age: 0,
    });

    // Keep only the newest 30 points
    if (this.points.length > 30) {
      this.points.shift();
    }
  }

  update(delta: number) {
    this.points.forEach(point => {
      point.age += delta;
    });

    // Remove points older than 350 ms
    this.points = this.points.filter(
      point => point.age < 350
    );
  }
}