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
let firedFrame = -999;
let laserY = 0;
let laserEndX = 800;
let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
let body;
let night = false;

//Day mode: three slots along the top, each holding a shape waiting to be sorted.
//Boxes sit underneath in the same order as SHAPES.
const SHAPES = ['tri', 'star', 'dia'];
let shapeImages;
let boxImages;
let slots = [];
let dragging = -1;
let grabOffsetX = 0;
let grabOffsetY = 0;
let streak = 0;

//Night mode: a formation of enemies that bobs up and down and creeps closer each wave
const FORMATION = [[600, 225], [600, 375], [600, 525], [750, 150], [750, 300], [750, 450]];
let enemies = [];
let wave = 1;
let formX = 0;
let formTargetX = 0;
let bobPhase = 0;
let bolts = [];
let shipHitFrame = -999;
//pointer (mouse/touch) steering at night: drag to move, tap to fire
let pointerDown = false;
let pointerSteering = false;
let pointerStartY = 0;
let pointerStartFrame = 0;

//shared effects
let particles = [];
let popups = [];

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
    shapeImages = {tri: tri, star: star, dia: dia};
    boxImages = {tri: boxTri, star: boxStar, dia: boxDia};
    //start with the original layout: star, diamond, triangle
    slots = [newSlot('star'), newSlot('dia'), newSlot('tri')];
    slots.forEach(function(s, i) {
      s.x = slotX(i);
      s.scale = 1;
    });
    newWave();
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
    drawDay();
  } else {
    drawNight();
  }
  updateEffects();
}

/* ---------- Day mode: SortCo ---------- */

function newSlot(shape) {
  return {shape: shape, x: 0, y: 200, scale: 0};
}

function slotX(i) {
  return (i + 1) * 200;
}

function boxX(shape) {
  return slotX(SHAPES.indexOf(shape));
}

//which box (by shape) the mouse is over, or null
function boxUnderMouse() {
  for (let i = 0; i < SHAPES.length; i++) {
    if (dist(slotX(i), 500, mouseX, mouseY) < 100) {
      return SHAPES[i];
    }
  }
  return null;
}

function drawDay() {
  //SortCo text
  textFont(teko);
  textSize(100);
  textAlign(CENTER);
  noStroke();
  fill(200);
  text('SortCo Ltd.', 400, 350);

  //Pay counter
  fill(0);
  textAlign(LEFT);
  textSize(36);
  text('PAY ' + formatter.format(pay), 25, 50);
  if (streak > 1) {
    fill(140);
    textSize(24);
    text('STREAK ' + streak, 25, 80);
  }

  // Advance arrows
  fill(0);
  textFont('Nunito, sans-serif');
  textSize(48);
  textAlign(RIGHT);
  text('>>', 775, 50);

  //draw boxes, lifting the one a held shape is over
  let target = dragging >= 0 ? boxUnderMouse() : null;
  for (let i = 0; i < SHAPES.length; i++) {
    let img = boxImages[SHAPES[i]];
    let s = SHAPES[i] === target ? 1.08 : 1;
    image(img, slotX(i), 500 - (s - 1) * 60, img.width * s, img.height * s);
  }

  //draw shapes: resting ones ease back home (and pop in when new), the held one follows the mouse
  for (let i = 0; i < slots.length; i++) {
    let slot = slots[i];
    if (i === dragging) {
      slot.x = mouseX + grabOffsetX;
      slot.y = mouseY + grabOffsetY;
    } else {
      slot.x = lerp(slot.x, slotX(i), 0.25);
      slot.y = lerp(slot.y, 200, 0.25);
      slot.scale = lerp(slot.scale, 1, 0.2);
    }
  }
  //draw the held shape last so it stays on top
  for (let i = 0; i < slots.length; i++) {
    if (i !== dragging) {
      drawSlot(slots[i]);
    }
  }
  if (dragging >= 0) {
    drawSlot(slots[dragging]);
  }

  //cursor feedback
  if (dragging >= 0) {
    cursor('grabbing');
  } else if (overShape() >= 0) {
    cursor('grab');
  } else if (overAdvance()) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function drawSlot(slot) {
  let img = shapeImages[slot.shape];
  image(img, slot.x, slot.y, img.width * slot.scale, img.height * slot.scale);
}

function dropShape() {
  let slot = slots[dragging];
  let target = boxUnderMouse();
  if (target === slot.shape) {
    paidSound.play();
    pay = pay + 0.5;
    streak++;
    addPopup('+' + formatter.format(0.5), boxX(target), 420, '#1E9E3A');
    //every 10 in a row earns a bonus
    if (streak % 10 === 0) {
      pay = pay + 5;
      addPopup('PRODUCTIVITY BONUS +' + formatter.format(5), 400, 300, '#1E9E3A', 32);
    }
    //a fresh, random shape arrives in the emptied slot
    slots[dragging] = newSlot(random(SHAPES));
    slots[dragging].x = slotX(dragging);
  } else if (target) {
    deductionSound.play();
    pay = pay - 1.0;
    streak = 0;
    addPopup('-' + formatter.format(1), boxX(target), 420, '#CC0000');
  }
  //anything not sorted eases back to its slot
  dragging = -1;
}

/* ---------- Night mode: space shooter ---------- */

function newWave() {
  enemies = FORMATION.map(function(p) {
    return {ox: p[0], oy: p[1], alive: true};
  });
  //each wave starts a little closer, and slides in from off screen
  formTargetX = max(-40 * (wave - 1), -240);
  formX = formTargetX + 300;
}

//vertical bob of the whole formation
function formY() {
  return sin(bobPhase) * 45;
}

function enemyPos(e) {
  return {x: e.ox + formX, y: e.oy + formY()};
}

function drawNight() {
  if (!hasMoved || !hasFired) {
    image(guide, 400, 300);
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
  //drag to steer with a mouse or finger
  if (pointerDown) {
    if (abs(mouseY - pointerStartY) > 10 || frameCount - pointerStartFrame > 15) {
      pointerSteering = true;
    }
    if (pointerSteering) {
      hasMoved = true;
      shipDescent += constrain(mouseY - shipDescent, -3, 3);
    }
  }
  //keep the ship (44px tall) on screen
  shipDescent = constrain(shipDescent, 22, height - 22);

  //formation, bobbing faster in later waves
  bobPhase += 0.02 + wave * 0.004;
  formX = lerp(formX, formTargetX, 0.05);
  let arrived = abs(formX - formTargetX) < 5;
  noStroke();
  fill('#CC0000');
  for (let e of enemies) {
    if (!e.alive) {
      continue;
    }
    let p = enemyPos(e);
    rect(p.x, p.y, 50, 50);
    //enemies only shoot back once you've got the hang of the controls
    if (arrived && hasMoved && hasFired && random() < 0.0008 + wave * 0.0005) {
      bolts.push({x: p.x - 25, y: p.y});
    }
  }
  if (enemies.every(function(e) { return !e.alive; })) {
    wave++;
    addPopup('WAVE ' + wave, 400, 300, '#39EDFF', 48);
    newWave();
  }

  //enemy bolts
  let invulnerable = frameCount - shipHitFrame < 90;
  fill('#FF6A00');
  for (let i = bolts.length - 1; i >= 0; i--) {
    let b = bolts[i];
    b.x -= 3.5 + wave * 0.3;
    rect(b.x, b.y, 14, 4);
    if (!invulnerable && abs(b.x - 50) < 20 && abs(b.y - shipDescent) < 24) {
      shipHit();
      invulnerable = true;
      bolts.splice(i, 1);
    } else if (b.x < -20) {
      bolts.splice(i, 1);
    }
  }

  //ship, blinking after being hit
  if (!invulnerable || frameCount % 10 < 5) {
    image(ship, 50, shipDescent);
  }

  //laser, fading out
  let laserAge = frameCount - firedFrame;
  if (laserAge < 30) {
    push();
    strokeWeight(4);
    stroke(0, 255, 56, map(laserAge, 0, 30, 255, 0));
    line(70, laserY, laserEndX, laserY);
    pop();
  }

  //Score counter
  noStroke();
  fill(255);
  textFont('Lucida Console, monospace');
  textAlign(LEFT);
  textSize(36);
  text('SCORE ' + score, 25, 50);
  fill(57, 237, 255);
  textSize(18);
  text('WAVE ' + wave, 25, 78);

  // Advance arrows
  fill(255);
  textFont('Nunito, sans-serif');
  textSize(48);
  textAlign(RIGHT);
  text('>>', 775, 50);

  cursor(overAdvance() ? HAND : (pointerSteering ? 'ns-resize' : ARROW));
}

function fire() {
  //The laser stops at the closest live enemy in line with the ship.
  //If it hits, destroy that enemy and add 500 points. If not, subtract 500 points.
  hasFired = true;
  fireSound.play();
  firedFrame = frameCount;
  laserY = shipDescent;
  let target = null;
  let targetPos = null;
  for (let e of enemies) {
    let p = enemyPos(e);
    if (e.alive && abs(p.y - laserY) < 30 && (!target || p.x < targetPos.x)) {
      target = e;
      targetPos = p;
    }
  }
  laserEndX = target ? targetPos.x - 25 : width;
  //the laser also burns through any bolts in its path
  bolts = bolts.filter(function(b) {
    return !(abs(b.y - laserY) < 8 && b.x < laserEndX);
  });
  if (target) {
    boomSound.play();
    target.alive = false;
    score += 500;
    explode(targetPos.x, targetPos.y, '#CC0000');
    addPopup('+500', targetPos.x, targetPos.y - 40, '#00FF38');
  } else if (score > 0) {
    score -= 500;
    addPopup('-500', 140, laserY - 30, '#FF6A00');
  }
}

function shipHit() {
  boomSound.play();
  shipHitFrame = frameCount;
  explode(50, shipDescent, '#00B2FF');
  let lost = min(score, 1000);
  score -= lost;
  if (lost > 0) {
    addPopup('-' + lost, 120, shipDescent - 30, '#FF6A00');
  }
}

/* ---------- Effects ---------- */

function explode(x, y, c) {
  for (let i = 0; i < 24; i++) {
    let a = random(TWO_PI);
    let v = random(1, 5);
    particles.push({x: x, y: y, vx: cos(a) * v, vy: sin(a) * v, life: 40, c: color(c)});
  }
}

function addPopup(txt, x, y, c, size) {
  popups.push({txt: txt, x: x, y: y, c: color(c), size: size || 28, life: 60});
}

function updateEffects() {
  push();
  noStroke();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.c.setAlpha(map(p.life, 0, 40, 0, 255));
    fill(p.c);
    rect(p.x, p.y, 6, 6);
    if (--p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  textAlign(CENTER);
  for (let i = popups.length - 1; i >= 0; i--) {
    let p = popups[i];
    p.y -= 0.8;
    p.c.setAlpha(map(p.life, 0, 60, 0, 255));
    fill(p.c);
    textFont(night ? 'Lucida Console, monospace' : teko);
    textSize(p.size);
    text(p.txt, p.x, p.y);
    if (--p.life <= 0) {
      popups.splice(i, 1);
    }
  }
  pop();
}

/* ---------- Input ---------- */

function setNight(isNight) {
  night = isNight;
  body.class(night ? 'night' : '');
  dragging = -1;
  pointerDown = pointerSteering = false;
  bolts = [];
  particles = [];
  popups = [];
}

//which resting shape the mouse is over (slot index), or -1
function overShape() {
  for (let i = 0; i < slots.length; i++) {
    if (dist(slotX(i), 200, mouseX, mouseY) < 50) {
      return i;
    }
  }
  return -1;
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
    let i = overShape();
    if (i >= 0) {
      dragging = i;
      //remember where the shape was grabbed so it doesn't jump to the cursor
      grabOffsetX = slots[i].x - mouseX;
      grabOffsetY = slots[i].y - mouseY;
    }
  } else if (overCanvas() && !overAdvance()) {
    pointerDown = true;
    pointerSteering = false;
    pointerStartY = mouseY;
    pointerStartFrame = frameCount;
  }
}

function pointerReleased() {
  if (!night) {
    if (dragging >= 0) {
      dropShape();
    } else if (overAdvance()) {
      setNight(true);
    }
  } else {
    //Night mode
    if (pointerDown && !pointerSteering) {
      fire();
    } else if (!pointerDown && overAdvance()) {
      setNight(false);
    }
    pointerDown = pointerSteering = false;
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
    fire();
  }
}
