const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

window.addEventListener("click", (e) => {
  init();
});

let colorArray = ["#352F44", "#5C5470", "#B9B4C7", "#FAF0E6"];
let gravity = 0.1;
let friction = 0.96;
let numBalls = 500;
// utils
const randomInt = (s, e) => {
  return Math.floor(Math.random() * e + s);
};
const randomColor = (color) => {
  return color[randomInt(0, color.length)];
};

class Ball {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = randomColor(colorArray);
  }

  draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  };

  update = () => {
    if (this.y > innerHeight - this.radius) {
      this.dy = -this.dy * friction;
      this.dx = this.dx * friction;
    } else {
      this.dy += gravity;
    }

    if (this.x > innerWidth - this.radius || this.x < this.radius) {
      this.dx = -this.dx;
    }

    this.y += this.dy;
    this.x += this.dx;

    this.draw();
  };
}

let ballArray = [];

const init = () => {
  ballArray = [];
  for (let i = 0; i < numBalls; i++) {
    let radius = randomInt(5, 20);
    let x = randomInt(radius, innerWidth - radius * 2);
    let y = randomInt(radius, innerHeight - radius);
    let dx = randomInt(-2, 5);
    let dy = randomInt(-2, 2);
    ballArray.push(new Ball(x, y, dx, dy, radius));
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  ballArray.forEach((i) => {
    i.update();
  });
};
init();
animate();
