// TEMPLATE
// by Arsène Brosy
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d", { willReadFrequently: true });
let fpsCounter = document.getElementById("fps");
canvas.width = 300;
canvas.height = 300;

//region CONSTANTES
const SAND_FRICTION = .6;
//endregion

//region VARIABLES
// souris
let mouseX = 0;
let mouseY = 0;
let canvasMouseX = 0;
let canvasMouseY = 0;
let mouseButtonPressed = -1;
let penRadius = 10;

let selectedMaterial = 2;
let materials = [
  {
    material: 0,
    tags: ["no-physics"],
    red: 255,
    green: 255,
    blue: 255
  },
  {
    material: 1,
    tags: ["no-physics"],
    red: 0,
    green: 0,
    blue: 0
  },
  {
    material: 2,
    tags: ["sandy"],
    red: 223,
    green: 183,
    blue: 118
  },
  {
    material: 3,
    tags: ["liquid", "search-left"],
    red: 97,
    green: 137,
    blue: 213
  }
];

// world
let world = [];
for (let y = 0; y < canvas.height; y++) {
  let newLine = [];
  for (let x = 0; x < canvas.width; x++) {
    newLine.push({
      material: 0,
      tags: ["no-physics"],
      red: 255,
      green: 255,
      blue: 255
    });
  }
  world.push(newLine);
}
//endregion

//region FUNCTIONS
function selectMaterial(material) {
  document.getElementById(`button-material-${selectedMaterial}`).classList.remove("selected");
  selectedMaterial = material;
  document.getElementById(`button-material-${selectedMaterial}`).classList.add("selected");
}
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
            world[y][x] = JSON.parse(JSON.stringify(materials[selectedMaterial]));
            if (selectedMaterial === 2) {
              let millis = new Date().getMilliseconds() / 1000;
              let random = ((millis > .5 ? 1 - millis : millis) - .25) * 40;
              world[y][x].red += random + (Math.random() - .5) * 10;
              world[y][x].green += random + (Math.random() - .5) * 10;
              world[y][x].blue += random + (Math.random() - .5) * 10;
            }
          } catch {}
        }
      }
      break;
    case 2:
      for (let x = canvasMouseX - penRadius; x <= canvasMouseX + penRadius; x++) {
        for (let y = canvasMouseY - penRadius; y <= canvasMouseY + penRadius; y++) {
          try {
            world[y][x] = {
              material: 0,
              tags: ["no-physics"],
              red: 255,
              green: 255,
              blue: 255
            }
          } catch {}
        }
      }
      break;
  }
  //endregion

  let dt = new Date();
  let startedFrameTime = dt.getSeconds() * 1000 + dt.getMilliseconds();
  draw()
  step()
  dt = new Date();
  let frameTime = dt.getSeconds() * 1000 + dt.getMilliseconds() - startedFrameTime;
  fpsCounter.innerHTML = Math.floor(1000 / frameTime).toString();
}, 0);

function step() {
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (world[y][x].tags.includes("tamp-no-physics")) {
        world[y][x].tags.splice(world[y][x].tags.indexOf("tamp-no-physics"), 1);
      }
    }
  }

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (!world[y][x].tags.includes("no-physics") && !world[y][x].tags.includes("tamp-no-physics")) {
        // sandy materials
        if (world[y][x].tags.includes("sandy") && y < canvas.height - 1) {
          if (world[y + 1][x].material === 0) {
            world[y + 1][x] = JSON.parse(JSON.stringify(world[y][x]));
            world[y + 1][x].tags.push("tamp-no-physics");
            world[y][x] = {
              material: 0,
              tags: ["no-physics"],
              red: 255,
              green: 255,
              blue: 255
            };
          } else if (x < canvas.width - 1 && world[y + 1][x + 1].material === 0 && Math.random() > SAND_FRICTION) {
            world[y + 1][x + 1] = JSON.parse(JSON.stringify(world[y][x]));
            world[y + 1][x + 1].tags.push("tamp-no-physics");
            world[y][x] = {
              material: 0,
              tags: ["no-physics"],
              red: 255,
              green: 255,
              blue: 255
            };
          } else if (x > 0 && world[y + 1][x - 1].material === 0 && Math.random() > SAND_FRICTION) {
            world[y + 1][x - 1] = JSON.parse(JSON.stringify(world[y][x]));
            world[y + 1][x - 1].tags.push("tamp-no-physics");
            world[y][x] = {
              material: 0,
              tags: ["no-physics"],
              red: 255,
              green: 255,
              blue: 255
            };
          }
        }
        // liquids
        if (world[y][x].tags.includes("liquid")) {
          if (y < canvas.height - 1 && world[y + 1][x].material === 0) {
            // false down
            world[y + 1][x] = JSON.parse(JSON.stringify(world[y][x]));
            world[y + 1][x].tags.push("tamp-no-physics");
            world[y][x] = {
              material: 0,
              tags: ["no-physics"],
              red: 255,
              green: 255,
              blue: 255
            };
          } else if (world[y][x].tags.includes("search-left")) {
            // left movement
            if (x > 0 && world[y][x - 1].material === 0) {
              // search hole
              world[y][x - 1] = JSON.parse(JSON.stringify(world[y][x]));
              world[y][x - 1].tags.push("tamp-no-physics");
              world[y][x] = {
                material: 0,
                tags: ["no-physics"],
                red: 255,
                green: 255,
                blue: 255
              };
            } else {
              // change direction
              world[y][x].tags.push("search-right");
              world[y][x].tags.splice(world[y][x].tags.indexOf("search-left"), 1);
            }
          } else if (world[y][x].tags.includes("search-right")) {
            // right movement
            if (x < canvas.width - 1 && world[y][x + 1].material === 0) {
              // search hole
              world[y][x + 1] = JSON.parse(JSON.stringify(world[y][x]));
              world[y][x + 1].tags.push("tamp-no-physics");
              world[y][x] = {
                material: 0,
                tags: ["no-physics"],
                red: 255,
                green: 255,
                blue: 255
              };
            } else {
              // change direction
              world[y][x].tags.push("search-left");
              world[y][x].tags.splice(world[y][x].tags.indexOf("search-right"), 1);
            }
          }
        }
      }
    }
  }
}

function draw() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // world
  for (let i = 0; i < imageData.data.length; i+=4) {
    let x = (i / 4) % canvas.width;
    let y = Math.floor((i / 4) / canvas.width);
    imageData.data[i] = world[y][x].red;
    imageData.data[i + 1] = world[y][x].green;
    imageData.data[i + 2] = world[y][x].blue;
    imageData.data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("mousedown", (e) => {
  mouseButtonPressed = e.button;
});

document.addEventListener("mouseup", (e) => {
  mouseButtonPressed = -1;
});