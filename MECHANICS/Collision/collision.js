const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

var mouse = {
  x: undefined,
  y: undefined,
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

let colorArray = ["#352F44", "#5C5470", "#B9B4C7", "#FAF0E6"];
let numParticles = 100;
particleRadius = 15;
// utils
const randomInt = (s, e) => {
  return Math.floor(Math.random() * e + s);
};
const randomColor = (color) => {
  return color[randomInt(0, color.length)];
};

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

const resolveCollision = (particle, otherParticle) => {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
};

const disatnce = (x1, y1, x2, y2) => {
  x = x2 - x1;
  y = y2 - y1;
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

class Particle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
    };
    this.radius = radius;
    this.color = randomColor(colorArray);
    this.mass = 100;
    this.opacity = 0;
  }

  draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeSyle = this.color;
    c.stroke();
    c.closePath();
  };

  update = (particleArray) => {
    this.draw();

    for (let i = 0; i < particleArray.length; i++) {
      if (this == particleArray[i]) continue;
      if (
        disatnce(this.x, this.y, particleArray[i].x, particleArray[i].y) -
          this.radius * 2 <
        0
      ) {
        resolveCollision(this, particleArray[i]);
      }
    }
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    if (disatnce(mouse.x, mouse.y, this.x, this.y) < 120 && this.opacity < 1) {
      this.opacity += 0.02;
    } else if (this.opacity > 0) {
      this.opacity -= 0.01;
      this.opacity = Math.max(0, this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };
}

let particleArray = [];

const init = () => {
  particleArray = [];
  for (let i = 0; i < numParticles; i++) {
    let radius = particleRadius;
    let x = randomInt(radius, innerWidth - radius * 2);
    let y = randomInt(radius, innerHeight - radius * 2);

    if (i != 0) {
      for (let j = 0; j < particleArray.length; j++) {
        if (
          disatnce(x, y, particleArray[j].x, particleArray[j].y) - radius * 2 <
          0
        ) {
          x = randomInt(radius, innerWidth - radius * 2);
          y = randomInt(radius, innerHeight - radius * 2);

          j = -1;
        }
      }
    }

    particleArray.push(new Particle(x, y, radius));
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  particleArray.forEach((particle) => {
    particle.update(particleArray);
  });
};
init();
animate();
