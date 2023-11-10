// TEMPLATE
// by Arsène Brosy
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.width = 10;
canvas.height = 10;

//region CONSTANTES
//endregion

//region VARIABLES
// souris
let mouseX = 0;
let mouseY = 0;
let canvasMouseX = 0;
let canvasMouseY = 0;
let mouseButtonPressed = -1;

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
  }
];
//endregion

//region FUNCTIONS
//endregion

function loop() {
  //region MOUSE
  let canvasRect = canvas.getBoundingClientRect();
  canvasMouseX = Math.floor((mouseX - canvasRect.left) * canvas.width / canvasRect.width);
  canvasMouseY = Math.floor((mouseY - canvasRect.top) * canvas.height / canvasRect.height);
  //endregion

  //region BUILD
  switch (mouseButtonPressed) {
    case 0:
      world[canvasMouseY][canvasMouseX] = materials[1];
      break;
    case 2:
      world[canvasMouseY][canvasMouseX] = materials[0];
      break;
  }
  //endregion

  //region DRAW
  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // world
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      switch (world[y][x].material) {
        case 0: ctx.fillStyle = "white"; break;
        case 1: ctx.fillStyle = "black"; break;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  //endregion
  requestAnimationFrame(loop);
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

// start game
requestAnimationFrame(loop);