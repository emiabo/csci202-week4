let teko;
let boxTri;
let boxStar;
let boxDia;
let tri;
let star;
let dia;
let ship;
let guide;
let paidSound;
let deductionSound;
let fireSound;
let boomSound;
let pay = 0.0;
let score = 0;
let shipDescent = 300;
let hasMoved = false;
let hasFired = false;
let willFire = false;
let firedFrame = 0;
let enemyA = true;
let enemyB = true;
let enemyC = true;
let enemyD = true;
let enemyE = true;
let enemyF = true;
let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
let body;
let draggingStar = false;
let draggingDia = false;
let draggingTri = false;
let night = false;
function preload() {
    teko = loadFont('css/Teko-Medium.ttf');
    boxTri = loadImage('assets/box-tri.png');
    boxStar = loadImage('assets/box-star.png');
    boxDia = loadImage('assets/box-dia.png');
    tri = loadImage('assets/tri.png');
    star = loadImage('assets/star.png');
    dia = loadImage('assets/dia.png');
    ship = loadImage('assets/polyspaceship.png');
    guide = loadImage('assets/controlguide.png');
    paidSound = loadSound('assets/paid.wav');
    deductionSound = loadSound('assets/deduction.wav');
    fireSound = loadSound('assets/fire.wav');
    boomSound = loadSound('assets/boom.wav');
}

function setup() {
    let window = createCanvas(800, 600);
    window.parent('gameWindow');
    imageMode(CENTER);
    rectMode(CENTER);
    body = select('body');
  }

  function draw() {
    clear();
    if (!night) {
      //SortCo text
      textFont(teko);
      textSize(100);
      textAlign(CENTER);
      fill(200);
      text('SortCo Ltd.', 400, 350);

      //Pay counter
      fill(0);
      textFont(teko);
      textAlign(LEFT);
      textSize(36);
      text('PAY '+formatter.format(pay), 25, 50);
      
      // Advance arrows
      textFont('Nunito, sans-serif');
      textSize(48);
      textAlign(RIGHT);
      text('>>', 775, 50);

      //draw boxes
      image(boxTri, 200, 500);
      image(boxStar, 400, 500);
      image(boxDia, 600, 500);

      //draw shapes
      if (draggingStar) {
        image(star, mouseX, mouseY);
        image(dia, 400, 200);
        image(tri, 600, 200);
      } else if (draggingDia) {
        image(star, 200, 200);
        image(dia, mouseX, mouseY);
        image(tri, 600, 200);
      } else if (draggingTri) {
        image(star, 200, 200);
        image(dia, 400, 200);
        image(tri, mouseX, mouseY);
      } else {
        image(star, 200, 200);
        image(dia, 400, 200);
        image(tri, 600, 200);
      }
    } else {
      //Night mode (first set the styling)
      body.class("night");
      if (!hasMoved || !hasFired) {
        image(guide, 400, 300);
      }
      // Advance arrows
      textFont('Nunito');
      textSize(48);
      textAlign(RIGHT);
      text('>>', 775, 50);
      //draw spaceship and boxes (static)
      image(ship, 50, shipDescent);
      fill('#CC0000');
      if (enemyA) {
        rect(600, 225, 50, 50);
      }
      if (enemyB) {
        rect(600, 375, 50, 50);
      }
      if (enemyC) {
        rect(600, 525, 50, 50);
      }
      if (enemyD) {
        rect(750, 150, 50, 50);
      }
      if (enemyE) {
        rect(750, 300, 50, 50);
      }
      if (enemyF) {
        rect(750, 450, 50, 50);
      }
      if (!enemyA && !enemyB && !enemyC && !enemyD && !enemyE && !enemyF) {
        enemyA = enemyB = enemyC = enemyD = enemyE = enemyF = true;
      }
      //check for keyboard input and increment or decrement shipHeight
      
      if (keyIsPressed && (keyCode === UP_ARROW || keyCode === 87)) {
        hasMoved = true;
        if (0 <= shipDescent) {
          console.log(shipDescent);
          shipDescent-= 2;
        }
      } else if (keyIsPressed && (keyCode === DOWN_ARROW || keyCode === 83)) {
        hasMoved = true;
        if (shipDescent <= height) {
          console.log(shipDescent);
          shipDescent += 2;
        }
      } else if (keyIsPressed) {
        hasFired = true;
        willFire = true;
      }
      if (firedFrame > 0 && frameCount < (firedFrame+30)) {
        push();
        strokeWeight(4);
        stroke('#00FF38');
        line(70, shipDescent, width, shipDescent);
        pop();
      }
      //Score counter
      fill(255);
      textFont('Lucida Console, monospace');
      textAlign(LEFT);
      textSize(36);
      text('SCORE '+ score, 25, 50);
    }
    
  }
  function mousePressed(){
    if (!night) {
      if (dist(200, 200, mouseX, mouseY) < 50) {
            draggingStar = true;
          } else if (dist(400, 200, mouseX, mouseY) < 50) {
            draggingDia = true;
          } else if (dist(600, 200, mouseX, mouseY) < 50) {
            draggingTri = true;
          }
    }
  }

  function mouseReleased() {
    if (!night) {
      if (draggingStar && dist(400, 500, mouseX, mouseY) < 100) {
            paidSound.play();
            pay = pay + 0.5;
            draggingStar = false;
          } else if (draggingDia && dist(600, 500, mouseX, mouseY) < 100) {
            paidSound.play();
            pay = pay + 0.5;
            draggingDia = false;
          } else if (draggingTri && dist(200, 500, mouseX, mouseY) < 100) {
            paidSound.play();
            pay = pay + 0.5;
            draggingTri = false;
          } else if (draggingStar || draggingDia || draggingTri) {
            deductionSound.play();
            pay = pay - 1.0;
            draggingStar = draggingDia = draggingTri = false;
          } else if (dist(745, 40, mouseX, mouseY) < 30){
            night = true;
          }
    } else {
      //Night mode
      if (dist(745, 40, mouseX, mouseY) < 30) {
        night = false;
        body.class('');
      }
    }
  }

  function keyReleased() {
    if (night) {
      if (willFire) {
        fireSound.play();
        fire();
        firedFrame = frameCount;
        willFire = false;
      }
    }
  }

  function fire() {
    //Draw a line emitting from ship (#00FF38) at shipHeight to the edge of the screen for 0.5s (30 frames).
    //If it hits, set that enemy to false and add 500 points. If not, subtract 500 points.
    //widths to check: 600, 750
    //heights to check: 225, 375, 525, 150, 300, 450 (within 38)
    if (dist(600, 225, 600, shipDescent) < 38 && enemyA) {
      boomSound.play();
      enemyA = false;
      score += 500;
    } else if (dist(600, 375, 600, shipDescent) < 38 && enemyB) {
      boomSound.play();
      enemyB = false;
      score += 500;
    } else if (dist(600, 525, 600, shipDescent) < 38 && enemyC) {
      boomSound.play();
      enemyC = false;
      score += 500;
    } else if (dist(750, 150, 750, shipDescent) < 38 && enemyD) {
      boomSound.play();
      enemyD = false;
      score += 500;
    } else if (dist(750, 300, 750, shipDescent) < 38 && enemyE) {
      boomSound.play();
      enemyE = false;
      score += 500;
    } else if (dist(750, 450, 750, shipDescent) < 38 && enemyF) {
      boomSound.play();
      enemyF = false;
      score += 500;
    } else {
      if (score > 0) {
        score -= 500;
      }
    }
  }