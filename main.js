const canvas = document.getElementById("myCanvas");

canvas.width = 200;

const ctx = canvas.getContext("2d");
//creating the road of canvas width with 0.1% margin
const road = new Road(canvas.width / 2, canvas.width * 0.9);

//creating the car(lane placement,postion on lane,width,length)
const car = new Car(road.getLaneCenter(1), 200, 30, 50);

animate();

function animate() {
  car.update();

  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.75);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}
