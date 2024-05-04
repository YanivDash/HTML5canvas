let playerState = "idle";
let StaggerFrame = 5;
const dropDown = document.getElementById("animations");
const frameInput = document.getElementById("frames");

dropDown.addEventListener("change", (e) => {
  playerState = e.target.value;
});
frameInput.addEventListener("change", (e) => {
  StaggerFrame = e.target.value;
});

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let CANVAS_WIDTH = (canvas.width = 600);
let CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;

let gameFrame = 0;

const spriteAimation = [];
const animationStates = [
  { name: "idle", frames: 7 },
  { name: "jump", frames: 7 },
  { name: "fall", frames: 7 },
  { name: "run", frames: 9 },
  { name: "dizy", frames: 11 },
  { name: "sit", frames: 5 },
  { name: "roll", frames: 7 },
  { name: "bite", frames: 7 },
  { name: "ko", frames: 12 },
  { name: "getHit", frames: 4 },
];

animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  for (let j = 0; j < state.frames; j++) {
    let positonX = j * spriteWidth;
    let positonY = index * spriteHeight;
    frames.loc.push({ x: positonX, y: positonY });
  }
  spriteAimation[state.name] = frames;
});

const animate = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let postion =
    Math.floor(gameFrame / StaggerFrame) %
    spriteAimation[playerState].loc.length;
  let frameX = spriteWidth * postion;
  let frameY = spriteAimation[playerState].loc[postion].y;
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );
  gameFrame++;
  requestAnimationFrame(animate);
};
animate();
