class Entity {
  constructor() {
    this.position = { x: 0, y: 0, z: 0 };
  }

  move() {
    this.position.x += 0.1;
    console.log(`[MOVEMENT] Bot moved to ${JSON.stringify(this.position)}`);
  }
}

module.exports = Entity;
