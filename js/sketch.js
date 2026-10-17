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
let grabOffsetX = 0;
let grabOffsetY = 0;
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
    let cnv = createCanvas(800, 600);
    cnv.parent('gameWindow');
    imageMode(CENTER);
    rectMode(CENTER);
    body = select('body');
    //keep arrow keys and space from scrolling the page while playing at night
    //(p5 skips keyPressed on key repeat, so this has to be a raw listener)
    window.addEventListener('keydown', function(e) {
      if (night && [32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    });
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
        image(star, mouseX + grabOffsetX, mouseY + grabOffsetY);
        image(dia, 400, 200);
        image(tri, 600, 200);
      } else if (draggingDia) {
        image(star, 200, 200);
        image(dia, mouseX + grabOffsetX, mouseY + grabOffsetY);
        image(tri, 600, 200);
      } else if (draggingTri) {
        image(star, 200, 200);
        image(dia, 400, 200);
        image(tri, mouseX + grabOffsetX, mouseY + grabOffsetY);
      } else {
        image(star, 200, 200);
        image(dia, 400, 200);
        image(tri, 600, 200);
      }

      //cursor feedback
      if (draggingStar || draggingDia || draggingTri) {
        cursor('grabbing');
      } else if (overShape() > 0) {
        cursor('grab');
      } else if (overAdvance()) {
        cursor(HAND);
      } else {
        cursor(ARROW);
      }
    } else {
      //Night mode (first set the styling)
      body.class("night");
      if (!hasMoved || !hasFired) {
        image(guide, 400, 300);
      }
      cursor(overAdvance() ? HAND : ARROW);
      // Advance arrows
      fill(255);
      textFont('Nunito, sans-serif');
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
      //check for held movement keys and increment or decrement shipHeight
      //(keyIsDown checks each key, so holding fire doesn't cancel movement)
      let up = keyIsDown(UP_ARROW) || keyIsDown(87);
      let down = keyIsDown(DOWN_ARROW) || keyIsDown(83);
      if (up && !down) {
        hasMoved = true;
        shipDescent -= 2;
      } else if (down && !up) {
        hasMoved = true;
        shipDescent += 2;
      }
      //keep the ship (44px tall) on screen
      shipDescent = constrain(shipDescent, 22, height - 22);
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
  //mouse and touch share the same handlers; right/middle clicks are ignored
  function mousePressed() {
    if (mouseButton === LEFT) {
      pointerPressed();
    }
  }

  function mouseReleased() {
    if (mouseButton === LEFT) {
      pointerReleased();
    }
  }

  //p5 only maps touchstart to mousePressed on Safari, so handle touch directly.
  //Returning false on the canvas stops the browser from also sending mouse events.
  function touchStarted() {
    pointerPressed();
    if (overCanvas()) {
      return false;
    }
  }

  function touchEnded() {
    pointerReleased();
    if (overCanvas()) {
      return false;
    }
  }

  function pointerPressed() {
    startAudio();
    if (!night) {
      let shape = overShape();
      if (shape > 0) {
        //remember where the shape was grabbed so it doesn't jump to the cursor
        grabOffsetX = shape * 200 - mouseX;
        grabOffsetY = 200 - mouseY;
      }
      if (shape === 1) {
            draggingStar = true;
          } else if (shape === 2) {
            draggingDia = true;
          } else if (shape === 3) {
            draggingTri = true;
          }
    }
  }

  //which resting shape the mouse is over: 1 star, 2 diamond, 3 triangle, 0 none
  function overShape() {
    for (let i = 1; i <= 3; i++) {
      if (dist(i * 200, 200, mouseX, mouseY) < 50) {
        return i;
      }
    }
    return 0;
  }

  function overAdvance() {
    return dist(745, 40, mouseX, mouseY) < 30;
  }

  function overCanvas() {
    return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  }

  //browsers start audio suspended until the page is interacted with
  function startAudio() {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  }

  function pointerReleased() {
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
          } else if (overAdvance()){
            night = true;
          }
    } else {
      //Night mode
      if (overAdvance()) {
        night = false;
        body.class('');
      }
    }
  }

  function keyPressed() {
    startAudio();
    //any key other than movement (or a modifier) fires. Handling this here instead
    //of polling keyIsPressed in draw() means quick taps between frames still count.
    let movement = [UP_ARROW, DOWN_ARROW, 87, 83];
    let modifiers = [SHIFT, CONTROL, ALT, 91, 92, 93, 224];
    if (night && !movement.includes(keyCode) && !modifiers.includes(keyCode)
        && !keyIsDown(CONTROL) && !keyIsDown(91) && !keyIsDown(93) && !keyIsDown(224)) {
      hasFired = true;
      fireSound.play();
      fire();
      firedFrame = frameCount;
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