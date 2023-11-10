// TEMPLATE
// by Arsène Brosy
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

//#region CONSTANTES
//#endregion

//#region VARIABLES
// souris
let mouseX = 0;
let mouseY = 0;
//#endregion

//#region FUNCTIONS
function Distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.abs(x1 - x2)**2 + Math.abs(y1 - y2)**2);
}
//#endregion

function loop() {
  canvas.width = 1000;
  canvas.height = 1000;

  //#region DRAW
  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";
  //#endregion
  requestAnimationFrame(loop);
}

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// start game
requestAnimationFrame(loop);