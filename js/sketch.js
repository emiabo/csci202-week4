let teko;
let boxTri;
let boxStar;
let boxDia;
let tri;
let star;
let dia;
let ship;
let pay = 0.0;
let score = 0;
let shipHeight = 300;
let bulletX = 75;
let bulletY = 300;
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
let night = true;
function preload() {
    teko = loadFont('css/Teko-Medium.ttf');
    boxTri = loadImage('img/box-tri.png');
    boxStar = loadImage('img/box-star.png');
    boxDia = loadImage('img/box-dia.png');
    tri = loadImage('img/tri.png');
    star = loadImage('img/star.png');
    dia = loadImage('img/dia.png');
    ship = loadImage('img/polyspaceship.png');
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
      //Score counter
      fill(255);
      textFont('Lucida Console, monospace');
      textAlign(LEFT);
      textSize(36);
      text('SCORE '+ score, 25, 50);
      // Advance arrows
      textFont('Nunito');
      textSize(48);
      textAlign(RIGHT);
      text('>>', 775, 50);
      //draw spaceship and boxes (static)
      image(ship, 50, shipHeight);
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
            pay = pay + 0.5;
            draggingStar = false;
          } else if (draggingDia && dist(600, 500, mouseX, mouseY) < 100) {
            pay = pay + 0.5;
            draggingDia = false;
          } else if (draggingTri && dist(200, 500, mouseX, mouseY) < 100) {
            pay = pay + 0.5;
            draggingTri = false;
          } else if (draggingStar || draggingDia || draggingTri) {
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

  function shoot() {
    //Has to fire one bullet (or multiple) and move horizontally along screen until it hits an enemy, or the right edge. 
    //If it hits, set that enemy to false and add 500 points. If not, subtract 500 points.
    fill('#00FF38');
    circle(bulletX, bulletY, 10);
  }