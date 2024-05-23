class Car {
  constructor(x, y, width, height, type, maxspeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.angle = 0;
    this.maxspeed = maxspeed;
    this.friction = 0.05;

    this.controller = new Controller(type);
    this.damage = false;

    this.useBrain = type == "AI";

    if (type != "dummy") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetworks([this.sensor.rayCount, 6, 4]);
    }

    this.controller = new Controller(type);
  }

  //update the car and sensor
  update(roadBorders, traffic) {
    if (!this.damage) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damage = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offset = this.sensor.readings.map(
        (s) => (s == null ? 0 : 1 - s.offset) //higher value for closer objects
      );
      const outputs = NeuralNetworks.feedforward(offset, this.brain);
      console.log(outputs);

      if (this.useBrain) {
        this.controller.forward = outputs[0];
        this.controller.left = outputs[1];
        this.controller.right = outputs[2];
        this.controller.reverse = outputs[3];
      }
    }
  }
  //check if the car is damaged
  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polyIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
  }

  //move the position of the car according to the inputs
  #move() {
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
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - rad * Math.sin(this.angle - alpha * 1),
      y: this.y - rad * Math.cos(this.angle - alpha * 1),
    });
    points.push({
      x: this.x - rad * Math.sin(this.angle + alpha),
      y: this.y - rad * Math.cos(this.angle + alpha),
    });
    points.push({
      x: this.x - rad * Math.sin(Math.PI + this.angle - alpha),
      y: this.y - rad * Math.cos(Math.PI + this.angle - alpha),
    });
    points.push({
      x: this.x - rad * Math.sin(Math.PI + this.angle + alpha),
      y: this.y - rad * Math.cos(Math.PI + this.angle + alpha),
    });
    return points;
  }
  //drawing the car
  draw(ctx, color, drawSensor = false) {
    if (this.damage) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
  }
}
