title = "MOVEMENT GAME";

description = `
    [TAP] 
  change direction

  avoid green
  collect blue
  get to yellow
`;

characters = [
  
  `
     
  
  `, `



  l  l
 l ll l
  l  l
 `,
  `
 
  lll  
    llll
`
,

];


options = {
  theme: "crt",
  isReplayEnabled: true,
  isCapturing: true, 
};
let cutter;
let county = 90;
let countx = 60;
let velocity = vec(0, 0);
let directionIndex = 0;
let x1 = rndi(0,80);
let y1 = rndi(0,100);
let x2 = rndi(0,80);
let y2 = rndi(0,100);
let playerspeed = 1;
let speedblock = 0.2;
let positiony = 0;
let center;
let shot;
let enemies = [];
let rects = [];

function changedirection(){
  const velocities = [vec(0, 1), vec(0, -1)];
  velocity = velocities[directionIndex];
  directionIndex = (directionIndex + 1) % velocities.length;
}

function generateCuts(centerX, centerY, radius) {
  let angle = cutter.angle; // Use the cutter's current angle
  let endPoint = getPoint(radius, angle); // Get the endpoint based on the radius and angle
  color("red");
  shot = line(centerX, centerY, centerX + endPoint.x, centerY + endPoint.y, 1);
}

function getPoint(radius, angle) {
  // Calculate the x and y coordinates based on the radius and angle
  let x = radius * Math.cos(angle);
  let y = radius * Math.sin(angle);
  return { x: x, y: y };
}


function moveCutter() {
  // Radius of outer edge is 40, angle spans from -pi to pi 
  cutter.pos.x = center.pos.x + 0.1 * Math.cos(cutter.angle);
  cutter.pos.y = center.pos.y + 0.1 * Math.sin(cutter.angle);
  
  cutter.angle += cutter.speed;
  // Added a speed modifier and an angle offset to the cutter's rotation, I have no idea why this works but it actually works
  cutter.rotation = (cutter.pos.angleTo(center.pos) * 0.65) + 1;

  if (cutter.angle > PI/2) {
    cutter.angle = PI/2;
    cutter.speed = -cutter.speed; // Reverse direction
  } else if (cutter.angle < -PI/2) {
    cutter.angle = -PI/2;
    cutter.speed = -cutter.speed; // Reverse direction
  }
}

function createBlocks(){
  console.log("createBlocks");
  speedblock = speedblock * 1.0001;
  cutter.speed = cutter.speed * 1.0001;
  if(x1>10){
    x1 -= 1*speedblock;
  }
  if(x1<=10){
    x1 = 90;
    y1 = rndi(0,90);
    score++;
  }
  if(x2>10){
    x2 -= 1*speedblock;
  }
  if(x2<=10){
    x2 = 90;
    y2 = rndi(0,90);
    score++;
  }
  //let enemey1 = char("b", x1, y1);
  //let enemy2 = char("b", x2, y2);\
  
  color("blue");
  let newrect = rect(x1, y1, 7, 5);
  color("yellow");
  let newrect1 = rect(x2, y2, 7, 5);
}


function createMap(){
  color("red");
  let top = rect(0, 98, 100, 2)
  let bottom = rect(0, 0, 100, 2);
  let stand = rect(0, 100, 10, -50);
}

function update() {
  if (!ticks) {
    cutter = { pos: vec(50, 5), angle: 0, rotation: 0, speed: 0.02 };
    center = { pos: vec(10, 50) };
    score = 0;
  }
  createMap();
  color("light_black");
  char("a", cutter.pos, {rotation: cutter.rotation});
  moveCutter();
  let lineLength = 10; // Adjust the length as needed
  let lineEnd = vec(cutter.pos.x + lineLength * Math.cos(cutter.angle),
                    cutter.pos.y + lineLength * Math.sin(cutter.angle));
  color("cyan"); // Choose an appropriate color for the line
  line(cutter.pos.x, cutter.pos.y, lineEnd.x, lineEnd.y, 2);
  createBlocks();
  county += velocity.y*playerspeed/2;
  countx = clamp(countx, 0, 99);
  county = clamp(county, 0, 99);
  if(input.isJustPressed){
    let mapRadius = 100; 
    generateCuts(center.pos.x, center.pos.y, mapRadius);
    if(shot.isColliding.rect.yellow){
      score--;
    } 
    if(shot.isColliding.rect.blue){
      score-= 2;
    } 
  }
  if(score >= 50){
    // /score = 0;
    end();
    score = 0;
  }
}