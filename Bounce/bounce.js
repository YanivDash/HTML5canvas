canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

// // Reactangle
// c.fillStyle = "yellow";
// c.fillRect(100, 100, 100, 100);

// // Lines

// c.beginPath();
// c.moveTo(0, 0);
// c.lineTo(200, 300);
// c.strokeStyle = "red";
// c.stroke();

// for (var i = 0; i < 10; i++) {
//   x = Math.random() * window.innerWidth;
//   y = Math.random() * window.innerHeight;

//   c.beginPath();
//   c.arc(x, y, 100, 0, Math.PI * 2);
//   c.strokeStyle = "blue";
//   c.stroke();
// }

var mouse = {
  x: undefined,
  y: undefined,
};

let maxRadius = 40;
let colorArray = ["#352F44", "#5C5470", "#B9B4C7", "#FAF0E6"];
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

class Circle {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  }

  draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  };

  update = () => {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // intereaction
    if (
      mouse.x - this.x < 50 &&
      mouse.x - this.x > -50 &&
      mouse.y - this.y < 50 &&
      mouse.y - this.y > -50
    ) {
      if (this.radius < maxRadius) {
        this.radius++;
      }
    } else if (this.radius > this.minRadius) {
      this.radius = this.radius - 1;
    }

    this.draw();
  };
}

let circleArray = [];
function init() {
  circleArray = [];
  for (let i = 0; i < 800; i++) {
    let radius = Math.random() * 5 + 1;
    let x = Math.random() * (innerWidth - radius * 2) + radius;
    let y = Math.random() * (innerHeight - radius * 2) + radius;
    let dx = Math.random() - 0.5;
    let dy = Math.random() - 0.5;

    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

const animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (let index = 0; index < circleArray.length; index++) {
    circleArray[index].update();
  }
};

init();
animate();
