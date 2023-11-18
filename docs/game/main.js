title = "MOVEMENT GAME";

description = `
    [TAP] to shoot
    Defend your castle
`;

characters = [
  
  `
     
  
  `, `



  l  l
 l ll l
  l  l
 `,, `



 l  l
l ll l
 l  l
`,

];


options = {
  theme: "crt",
  isReplayEnabled: true,
  isCapturing: true, 
};
let cannon;
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
let newrect;
let timer = 0;
let actual_timer=0

function changedirection(){
  const velocities = [vec(0, 1), vec(0, -1)];
  velocity = velocities[directionIndex];
  directionIndex = (directionIndex + 1) % velocities.length;
}

//credit to my teammates for this function
function generateShots(centerX, centerY, radius) {
  let angle = cannon.angle;
  let endPoint = getPoint(radius, angle);
  color("red");
  shot = line(centerX, centerY, centerX + endPoint.x, centerY + endPoint.y, 1);
}

function getPoint(radius, angle) {
  let x = radius * Math.cos(angle);
  let y = radius * Math.sin(angle);
  return { x: x, y: y };
}

//credit to my teammates for this function
function movecannon() {
  cannon.pos.x = center.pos.x + 0.1 * Math.cos(cannon.angle);
  cannon.pos.y = center.pos.y + 0.1 * Math.sin(cannon.angle);
  cannon.angle += cannon.speed;
  cannon.rotation = (cannon.pos.angleTo(center.pos) * 0.65) + 1;
  if (cannon.angle > PI/2) {
    cannon.angle = PI/2;
    cannon.speed = -cannon.speed;
  } else if (cannon.angle < -PI/2) {
    cannon.angle = -PI/2;
    cannon.speed = -cannon.speed; 
  }
}

function createBlocks(){
  console.log("createBlocks");
  speedblock = speedblock * 1.0002;
  cannon.speed = cannon.speed * 1.0002;
  if(x1>10){
    x1 -= 1*speedblock;
  }
  if(x1<=10){
    x1 = 90;
    y1 = rndi(10,80);
    score++;
  }
  if(x2>10){
    x2 -= 1*speedblock;
  }
  if(x2<=10){
    x2 = 90;
    y2 = rndi(10,80);
    score++;
  }
  color("blue");
  char("b", x1, y1);
  color("yellow");
  char("c", x2, y2);
}

function createMap(){
  color("red");
  let top = rect(0, 98, 100, 2)
  let bottom = rect(0, 0, 100, 2);
  let stand = rect(0, 100, 8, -100);
  color("black");
  text(`Timer: ${timer}`,  15, 2, {
    scale: { x: 1, y: 1 }
  });
}

function update() {
  if (!ticks) {
    cannon = { pos: vec(50, 5), angle: 0, rotation: 0, speed: 0.03 };
    center = { pos: vec(10, 50) };
    score = 0;
  }
  createMap();
  color("light_black");
  char("a", cannon.pos, {rotation: cannon.rotation});
  movecannon();
  let lineLength = 10;
  let lineEnd = vec(cannon.pos.x + lineLength * Math.cos(cannon.angle),
                    cannon.pos.y + lineLength * Math.sin(cannon.angle));
  color("cyan");
  line(cannon.pos.x, cannon.pos.y, lineEnd.x, lineEnd.y, 2);
  createBlocks();
  county += velocity.y*playerspeed/2;
  countx = clamp(countx, 0, 99);
  county = clamp(county, 0, 99);
  if(input.isJustPressed){
    let mapRadius = 100; 
    generateShots(center.pos.x, center.pos.y, mapRadius);
    if(shot.isColliding.char.c){
      x2 = 90;
    } 
    if(shot.isColliding.char.b){
      x1 = 90;
    } 
  }
  if(score >= 10){
    end();
    score = 0;
    timer = 0;
  }
  actual_timer++;
  if(actual_timer==60){
    actual_timer = 0;
    timer++;
  }
}