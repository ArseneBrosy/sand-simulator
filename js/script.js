// TEMPLATE
// by Arsène Brosy
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

//region CONSTANTES
//endregion

//region VARIABLES
// souris
let mouseX = 0;
let mouseY = 0;
//endregion

//region FUNCTIONS
//endregion

function loop() {
  canvas.width = 10;
  canvas.height = 10;

  //region MOUSE
  let canvasRect = canvas.getBoundingClientRect();
  let canvasMouseX = Math.floor((mouseX - canvasRect.left) * canvas.width / canvasRect.width);
  let canvasMouseY = Math.floor((mouseY - canvasRect.top) * canvas.height / canvasRect.height);
  //endregion

  //region DRAW
  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(canvasMouseX, canvasMouseY, 1, 1);
  //endregion
  requestAnimationFrame(loop);
}

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// start game
requestAnimationFrame(loop);