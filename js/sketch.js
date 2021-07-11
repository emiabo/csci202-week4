let teko;
let boxTri;
let boxStar;
let boxDia;
let tri;
let star;
let dia;
let pay = 0;
let score = 0;
let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
let draggingStar = false;
let draggingDia = false;
let draggingTri = false;
let night = false;
function preload() {
    teko = loadFont('css/Teko-Medium.ttf');
    boxTri = loadImage('img/box-tri.png');
    boxStar = loadImage('img/box-star.png');
    boxDia = loadImage('img/box-dia.png');
    tri = loadImage('img/tri.png');
    star = loadImage('img/star.png');
    dia = loadImage('img/dia.png');
}

function setup() {
    let window = createCanvas(800, 600);
    window.parent('gameWindow');
    imageMode(CENTER);
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
    } else {
      //Night mode
    }
  }

  function mouseReleased() {
    if (!night) {
      if (draggingStar && dist(400, 500, mouseX, mouseY) < 60) {
            pay = pay + 50;
            draggingStar = false;
          } else if (draggingDia && dist(600, 500, mouseX, mouseY) < 60) {
            pay = pay + 50;
            draggingDia = false;
          } else if (draggingTri && dist(200, 500, mouseX, mouseY) < 60) {
            pay = pay + 50;
            draggingTri = false;
          } else if (draggingStar || draggingDia || draggingTri) {
            pay = pay - 100;
            draggingStar = draggingDia = draggingTri = false;
          }
    } else {
      //Night mode
    }
  }