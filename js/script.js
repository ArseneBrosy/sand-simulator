// TEMPLATE
// by Arsène Brosy
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.width = 100;
canvas.height = 100;

//region CONSTANTES
const SAND_FRICTION = .9;
//endregion

//region VARIABLES
// souris
let mouseX = 0;
let mouseY = 0;
let canvasMouseX = 0;
let canvasMouseY = 0;
let mouseButtonPressed = -1;
let penRadius = 10;

// world
let world = [];
for (let y = 0; y < canvas.height; y++) {
  let newLine = [];
  for (let x = 0; x < canvas.width; x++) {
    newLine.push({
      material: 0,
      tags: []
    });
  }
  world.push(newLine);
}

let materials = [
  {
    material: 0,
    tags: []
  },
  {
    material: 1,
    tags: ["collider"]
  },
  {
    material: 2,
    tags: ["collider"]
  }
];
//endregion

//region FUNCTIONS
//endregion

setInterval(() => {
  //region MOUSE
  let canvasRect = canvas.getBoundingClientRect();
  canvasMouseX = Math.floor((mouseX - canvasRect.left) * canvas.width / canvasRect.width);
  canvasMouseY = Math.floor((mouseY - canvasRect.top) * canvas.height / canvasRect.height);
  //endregion

  //region BUILD
  switch (mouseButtonPressed) {
    case 0:
      for (let x = canvasMouseX - penRadius; x <= canvasMouseX + penRadius; x++) {
        for (let y = canvasMouseY - penRadius; y <= canvasMouseY + penRadius; y++) {
          try {
            world[y][x] = materials[2];
          } catch {}
        }
      }
      break;
    case 2:
      for (let x = canvasMouseX - penRadius; x <= canvasMouseX + penRadius; x++) {
        for (let y = canvasMouseY - penRadius; y <= canvasMouseY + penRadius; y++) {
          try {
            world[y][x] = materials[0];
          } catch {}
        }
      }
      break;
  }
  //endregion

  draw()
}, 0);

setInterval(() => {
  step();
  //draw();
}, 0);

function step() {
  let newWorld = JSON.parse(JSON.stringify(world));
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // sand
      if (world[y][x].material === 2 && y < canvas.height - 1) {
        if (world[y + 1][x].material === 0) {
          newWorld[y + 1][x] = materials[2];
          newWorld[y][x] = materials[0];
        }
        else if (x < canvas.width - 1 && world[y + 1][x + 1].material === 0 && Math.random() > SAND_FRICTION) {
          newWorld[y + 1][x + 1] = materials[2];
          newWorld[y][x] = materials[0];
        }
        else if (x > 0 && world[y + 1][x - 1].material === 0 && Math.random() > SAND_FRICTION) {
          newWorld[y + 1][x - 1] = materials[2];
          newWorld[y][x] = materials[0];
        }
      }
    }
  }
  world = JSON.parse(JSON.stringify(newWorld));
}

function draw() {
  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // world
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      switch (world[y][x].material) {
        case 0: ctx.fillStyle = "white"; break;
        case 1: ctx.fillStyle = "black"; break;
        case 2: ctx.fillStyle = "yellow"; break;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener("mousedown", (e) => {
  mouseButtonPressed = e.button;
});

canvas.addEventListener("mouseup", (e) => {
  mouseButtonPressed = -1;
});