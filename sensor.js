class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  //update the sensor readings
  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    //for each ray, find the intersection point with the road borders
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      const reading = this.#getReading(ray, roadBorders, traffic);
      this.readings.push(reading);
    }
  }
  //find the intersection point of the ray with the road borders
  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      //find the intersection point of the ray with the road border
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      //if the intersection point is found, add it to the touches array
      if (touch) {
        touches.push(touch);
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const crash = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (crash) {
          touches.push(crash);
        }
      }
    }
    if (touches.length == 0) {
      return null;
    } else {
      //find the closest touch point to the car and return it
      const offset = touches.map((touch) => touch.offset);
      const closet = Math.min(...offset);
      return touches.find((touch) => touch.offset == closet);
    }
  }
  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      //find the angle of the ray based on the spread
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;
      //find the start and end point of the ray
      const start = {
        x: this.car.x,
        y: this.car.y,
      };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }
  draw(ctx) {
    //draw the rays
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "red";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
