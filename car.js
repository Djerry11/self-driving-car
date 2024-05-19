class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.angle = 0;
    this.maxspeed = 3;
    this.friction = 0.05;

    this.controller = new Controller();
  }
  //drawing the car
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
  }
  //update the position of the car according to the inputs
  update() {
    //move forward and backward
    if (this.controller.forward) {
      this.speed += this.acceleration;
    }
    if (this.controller.reverse) {
      this.speed -= this.acceleration;
    }
    //control the top speed for forward and backward
    if (this.speed > this.maxspeed) {
      this.speed = this.maxspeed;
    }
    if (this.speed < -this.maxspeed / 2) {
      this.speed = -this.maxspeed / 2;
    }
    //decrease the speed gradually
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    //move slowly on own
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    //stop the vehicle
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    //for reversing the car on opposite direction
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controller.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controller.right) {
        this.angle -= 0.03 * flip;
      }
    }
    // calculate the speed and the direction and move accordingly
    this.x -= this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }
}
