// sketch.js - Generates paramterized versions of loaded images
// Author: Brandon Jacobson
// Date: May 7, 2024

/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Trees", 
      assetUrl: "https://cdn.glitch.global/52413bc7-7309-4e8a-b21c-8850b53eb62d/trees.jpg?v=1715147370629",
      shapeType: "rect"
    },
    {
      name: "Flower", 
      assetUrl: "https://cdn.glitch.global/52413bc7-7309-4e8a-b21c-8850b53eb62d/flower.jpg?v=1715147574619",
      shapeType: "ellipse"
    },
    {
      name: "Pandas", 
      assetUrl: "https://cdn.glitch.global/52413bc7-7309-4e8a-b21c-8850b53eb62d/pandas.jpg?v=1715148499929",
      shapeType: "triangle"
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  
  if (inspiration.shapeType === "ellipse") 
  {
    resizeCanvas(inspiration.image.width, inspiration.image.height);
  }
  
  let design = {
    bg: 128,
    fg: []
  }
  
  if (inspiration.shapeType === "rect") 
  {
    for(let i = 0; i < 150; i++) {
      let x = random(width);
      let y = random(height);
      let clr = inspiration.image.get(int(x), int(y));
      design.fg.push({x: x,
        y: y,
        w: random(width / 2),
        h: random(height / 2),
        fill: clr})
    }
  }
  else if (inspiration.shapeType === "ellipse") 
  {
    for(let i = 0; i < 100; i++) {
      let x = random(width);
      let y = random(height);
      let clr = inspiration.image.get(int(x), int(y));
      design.fg.push({x: x,
        y: y,
        w: random(width / 2),
        h: random(height / 2),
        fill: clr})
    }
  }
  else 
  {
    let x1 = random(width);
    let y1 = random(height);
    let clr = inspiration.image.get(int(x1), int(y1));
    for(let i = 0; i < 100; i++) {
      design.fg.push({x1: x1,
        y1: y1,
        x2: random(width),
        y2: random(height),
        x3: random(width),
        y3: random(height),
        fill: clr})
    }
  }
  
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  
  if (inspiration.shapeType === "rect") 
  {
    for(let box of design.fg) {
      fill(box.fill, 128);
      rect(box.x, box.y, box.w, box.h);
    }
  }
  else if (inspiration.shapeType === "ellipse") 
  {
    for(let circle of design.fg) {
      fill(circle.fill, 128);
      ellipse(circle.x, circle.y, circle.w, circle.h);
    }
  }
  else
  {
    for(let tri of design.fg) {
      fill(tri.fill, 128);
      triangle(tri.x1, tri.y1, tri.x2, tri.y2, tri.x3, tri.y3);
    }
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  
  if (inspiration.shapeType === "rect") 
  {
    for(let box of design.fg) {
      box.fill = mut(box.fill, 0, 255, rate);
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width/2, rate);
      box.h = mut(box.h, 0, height/2, rate);
    }
  }
  else if (inspiration.shapeType === "ellipse") 
  {
    for(let circle of design.fg) {
      circle.fill = mut(circle.fill, 0, 255, rate);
      circle.x = mut(circle.x, 0, width, rate);
      circle.y = mut(circle.y, 0, height, rate);
      circle.w = mut(circle.w, 0, width/2, rate);
      circle.h = mut(circle.h, 0, height/2, rate);
    }
  }
  else
  {
    for(let tri of design.fg) {
      tri.fill = mut(tri.fill, 0, 255, rate);
      tri.x1 = mut(tri.x1, 0, width, rate);
      tri.y1 = mut(tri.y1, 0, height, rate);
      tri.x2 = mut(tri.x2, 0, width, rate);
      tri.y2 = mut(tri.y2, 0, height, rate);
      tri.x3 = mut(tri.x3, 0, width, rate);
      tri.y3 = mut(tri.y3, 0, height, rate);
    }
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}

/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, initDesign, renderDesign, mutateDesign */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;

function preload() {
  

  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}



function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  
  fpsCounter.innerHTML = Math.round(frameRate());
}
