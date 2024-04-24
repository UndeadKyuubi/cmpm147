// sketch.js - Generates a map of a dungeon using a tileset with autotiling
// Author: Brandon Jacobson
// Date: Apr. 23, 2024

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

/* exported generateGrid, drawGrid */
/* global placeTile */
let flickerSpeed = 0.01;
let minOpacity = 50;
let maxOpacity = 150;

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  let minWidth = 5;
  let minHeight = 7;
  let maxWidth = 10;
  let maxHeight = 10;
  
  let numRooms = 5;
  
  for (let n = 0; n < numRooms; n++) {
    let roomWidth = floor(random(minWidth, maxWidth));
    let roomHeight = floor(random(minHeight, maxHeight));                 
    
    let xCoord = floor(random(numCols - roomWidth));
    let yCoord = floor(random(numRows - roomHeight));
  
    for (let i = yCoord; i < yCoord + roomHeight; i++) {
      for (let j = xCoord; j < xCoord + roomWidth; j++) {
        grid[i][j] = ".";
      }
    }
  }
  
  for (let i = 0; i < 3; i++) {
    let x = floor(random(numCols));
    let y = floor(random(numRows));
    while (grid[y][x] !== ".") {
      x = floor(random(numCols));
      y = floor(random(numRows));
    }
    grid[y][x] = 'C';
  }
  
  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, "_")) {
        placeTile(i, j, floor(random(21, 25)), floor(random(21, 25)));
      }
      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, random(4) | 0, 10);
      }
      else {
        drawContext(grid, i, j, ".", 22, 21)
      }
      if (gridCheck(grid, i, j, "C")) {
        placeTile(i, j, random(6) | 0, 29);
      }
    }
  }
  let flickerOpacity = map(sin(frameCount * flickerSpeed), -1, 1, minOpacity, maxOpacity);

  fill(0, flickerOpacity);
  rect(0, 0, width, height);
}

function gridCheck(grid, i, j, target) {
  return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length && grid[i][j] == target;
}

function gridCode(grid, i, j, target) {
  let code = 0;
  // Code Bits are (West, East, South, North)
  // Check Northern Tile
  if (gridCheck(grid, i - 1, j, target)) code += 1;
  // Check Southern Tile
  if (gridCheck(grid, i + 1, j, target)) code += 2;
  // Check Eastern Tile
  if (gridCheck(grid, i, j + 1, target)) code += 4;
  // Check Western Tile
  if (gridCheck(grid, i, j - 1, target)) code += 8;
  return code;
}

function drawContext(grid, i, j, target, dti, dtj) {
  const code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, dti + tiOffset, dtj + tjOffset);
}

const lookup = [
  // no tiles
  [0,0],
  // northern tile
  [6,3],
  // southern tile
  [6,3],
  // northern and southern tile
  [0,0],
  // eastern tile
  [6,3],
  // nothern and eastern tile
  [6,3],
  // southern and eastern tile
  [6,3],
  // northern, southern, and eastern tile
  [6,3],
  // western tile
  [6,3],
  // northern and western tile
  [6,3],
  // southern and western tile
  [6,3],
  // northern, southern, and western tile
  [6,3],
  // eastern and western tile
  [0,0],
  // northern, eastern, and western tile
  [6,3],
  // southern, eastern, and western tile
  [6,3],
  // all tiles
  [0,0]
];
