// sketch.js - Generate a scene of a sunrise over an ocean body
// Author: Brandon Jacobson
// Date: 4/16/2024

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

/* exported setup, draw */
let seed = 0;

function setup() {  
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  createButton("reimagine").mousePressed(() => seed++);
}


function draw() {
  randomSeed(seed);
  
  // Sky
  let skyColorTop = color(138, 198, 199);
  let skyColorBottom = color(254, 165, 0);
  let horizonColor = color(46, 104, 118);
  
  let horizon = (height / 2) + 40;
  
  noFill();
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(skyColorTop, skyColorBottom, inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  fill(horizonColor);
  rect(0, horizon, width, height - horizon);

  // Water
  noFill();
  for (let y = horizon+5; y < height; y += 3) {
    beginShape();
    for (let x = 0; x < width; x += 1) {
      let noiseVal = 0;
      
      noiseVal += 0.4 * noise(x * 0.01, (y + frameCount * 0.05) * 0.01);
      noiseVal += 0.3 * noise(x * 0.03, (y + frameCount * 0.05) * 0.03);
      noiseVal += 0.2 * noise(x * 0.06, (y + frameCount * 0.05) * 0.06);

      let waveAmplitude = 10;
      let yOffset = map(noiseVal, 0, 1, -waveAmplitude, waveAmplitude);
      let yAdjusted = y + yOffset;
      
      stroke(73, 180, 182);

      vertex(x, yAdjusted);
    }
    endShape();
  }
  
  // Sun
  noStroke();
  let sunSize = 2;
  let sunColor = color(255, 255, 0);
  let sunGlowColor = color(255, 255, 0, 50);
  let sunX = width / 2;
  let sunY = height * 0.3;
  
  for (let i = 0; i < 10; i++) {
    let glowSize = sunSize * 2 + i * 10;
    fill(sunGlowColor);
    ellipse(sunX, sunY, glowSize, glowSize);
  }
  
  fill(sunColor);
  ellipse(sunX, sunY, sunSize, sunSize);
  
  // Reflections
  let reflectionWidth = 100;
  let reflectionColor = color(100, 165, 165, 100);
  let reflectionStart = createVector(width / 2 - reflectionWidth / 2, horizon);
  
  noFill();
  for (let i = reflectionStart.y; i <= reflectionStart.y + (height - horizon); i++) {
    let inter = map(i, reflectionStart.y, reflectionStart.y + height, 0, 1);
    let c = lerpColor(reflectionColor, color(0,0), inter);
    stroke(c);
    line(reflectionStart.x, i, reflectionStart.x + reflectionWidth, i);
  }
  
  reflectionWidth = 300;
  reflectionColor = color(100, 140, 140, 100);
  reflectionStart = createVector(width / 2 - reflectionWidth / 2, horizon);
  
  noFill();
  for (let i = reflectionStart.y; i <= reflectionStart.y + (height - horizon); i++) {
    let inter = map(i, reflectionStart.y, reflectionStart.y + height, 0, 1);
    let c = lerpColor(reflectionColor, color(0,0), inter);
    stroke(c);
    line(reflectionStart.x, i, reflectionStart.x + reflectionWidth, i);
  }
  
  // Clouds
  noStroke();
  for (let i = 0; i < 7; i++) {
    let x = random(100, width - 25);
    let y = random(50, height / 2);
    let size = random(50, 200);
    let cloudColor = lerpColor(color(255, 200), color(200, 200), random(1));
    fill(cloudColor);
    ellipse(x, y, size, size * 0.2);
  }
}
