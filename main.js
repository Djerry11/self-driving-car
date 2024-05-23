//race track
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
//
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 270;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

//creating the road of carCanvas width with 0.1% margin
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

//creating the car(lane placement,postion on lane,width,length)
const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestCar")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestCar"));
    if (i != 0) {
      NeuralNetworks.mutate(cars[i].brain, 0.08);
    }
  }
}

const traffic = [
  // Lane 0
  new Car(road.getLaneCenter(0), -200, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -400, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -600, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -800, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -1000, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -1200, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -1400, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -1600, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -1800, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -2000, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -2100, 30, 50, "dummy", 1),

  // Lane 1
  new Car(road.getLaneCenter(1), -150, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -350, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -550, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -750, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -950, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -1150, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -1350, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -1550, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -1750, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -1950, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -2150, 30, 50, "dummy", 1),

  // Lane 2
  new Car(road.getLaneCenter(2), -250, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -450, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -650, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -850, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -1050, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -1250, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -1450, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -1650, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -1850, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -2050, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -2250, 30, 50, "dummy", 1),

  // Additional cars to further ensure heavy traffic and maintain gaps

  new Car(road.getLaneCenter(1), -2450, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -2500, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(0), -2550, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(1), -2800, 30, 50, "dummy", 1),
  new Car(road.getLaneCenter(2), -2950, 30, 50, "dummy", 1),
];

animate();

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function saveBestCar() {
  localStorage.setItem("bestCar", JSON.stringify(bestCar.brain));
}
function removeCar() {
  localStorage.removeItem("bestCar");
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  //fitness function
  bestCar = cars.find((car) => car.y == Math.min(...cars.map((car) => car.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();

  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.75);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "gray");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "green", true);

  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}
