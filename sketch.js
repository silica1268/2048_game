//noprotect

var colors = {
  0 : [200, 200, 200],
  2 : [225, 225, 225],
  4 : [225, 220, 200],
  8 : [250, 175, 125],
  16 : [250, 125, 50],
  32 : [250, 100, 100],
  64 : [225, 50, 25],
  128: [250, 225, 100],
  256 : [240, 210, 90],
  512 : [235, 195, 70],
  1024 : [230, 185, 40],
  2048 : [240, 200, 50],
  4096 : [50, 215, 125],
  8192 : [45, 150, 100],
  16384 : [0, 0, 0],
  32768 : [0, 0, 0],
  65536 : [0, 0, 0]
};
var margin, squareSize;
var squares = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var points = [];
var tracking = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  margin = width/20;
  squareSize = (width-margin*2.5)/4-margin/2;
}

function mousePressed() {
  points = [];
  tracking = true;
}

function draw() {
  background(255);
  if (points.length>60) {
    points = [];
    tracking = false;
  } else if (tracking) {
    points.push(createVector(mouseX, mouseY));
    if (points.length>0) {
      if (dist(points[0].x, points[0].y, mouseX, mouseY) > 50) {
        var mouse = createVector(mouseX, mouseY);
        squares = updated(squares, points[0], mouse);
        tracking = false;
        var randPos = createVector(floor(random(squares.length)), floor(random(squares[0].length)));
        while (squares[randPos.x][randPos.y]!=0) {
          randPos = createVector(floor(random(squares.length)), floor(random(squares[0].length)));
        }
        if (floor(random(2))==0) {
          squares[randPos.x][randPos.y] = 2;
        } else {
          squares[randPos.x][randPos.y] = 4;
        }
        var zeroTest = 1;
        for (x=0; x<squares.length; x++) {
          for (y=0; y<squares[0].length; y++) {
            zeroTest*=squares[x][y];
          }
        }
        if (zeroTest!=0) {
          squares = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        }
      }
    }
  }
  push();
  fill(175);
  noStroke();
  rect(margin, height/2-width/2+margin, width-margin*2, width-margin*2, 5);
  for (x=0; x<squares.length; x++) {
    for (y=0; y<squares[0].length; y++) {
      push();
      fill(colors[squares[x][y]][0], colors[squares[x][y]][1], colors[squares[x][y]][2]);
      var xPos = margin*1.5+x*(squareSize+margin/2);
      var yPos = height/2-width/2+margin*1.5+y*(squareSize+margin/2);
      rect(xPos, yPos, squareSize, squareSize, 5);
      textAlign(CENTER, CENTER);
      if (squares[x][y]<1000) {
        textSize(squareSize/2);
      } else {
        textSize(squareSize/3);
      }
      textStyle(BOLD);
      if (squares[x][y]<8) {
        fill(75);
      } else {
        fill(255);
      }
      if (squares[x][y] != 0) {
        text(squares[x][y], xPos+squareSize/2, yPos+squareSize/2);
      }
      pop();
    }
  }
  background(200, 175, 150, 30);
  pop();
  
}

function updated(squares, first, last) {
  var freeX;
  var freeY;
  if (abs(first.x-last.x)>abs(first.y-last.y)) {
    if (first.x-last.x>=0) {
      for (y=0; y<squares[0].length; y++) {
        freeX = 0;
        for (x=0; x<squares.length; x++) {
          if (squares[x][y] != 0) {
            if (freeX==0 || squares[freeX-1][y]!=squares[x][y]) {
              squares[freeX][y] = squares[x][y];
              if (freeX!=x) {
                squares[x][y] = 0;
              }
            } else {
              squares[freeX-1][y] *= 2;
              squares[x][y] = 0;
              freeX--;
            }
            freeX++;
          } 
        }
      }
    } else {
      for (y=0; y<squares[0].length; y++) {
        freeX = 3;
        for (x=squares.length-1; x>=0; x--) {
          if (squares[x][y] != 0) {
            if (freeX==3 || squares[freeX+1][y]!=squares[x][y]) {
              squares[freeX][y] = squares[x][y];
              if (freeX!=x) {
                squares[x][y] = 0;
              }
            } else {
              squares[freeX+1][y] *= 2;
              squares[x][y] = 0;
              freeX++;
            }
            freeX--;
          } 
        }
      }
    }
  } else if (first.y-last.y>=0) {
    for (x=0; x<squares.length; x++) {
      freeY = 0;
      for (y=0; y<squares[0].length; y++) {
        if (squares[x][y] != 0) {
          if (freeY==0 || squares[x][freeY-1]!=squares[x][y]) {
            squares[x][freeY] = squares[x][y];
            if (freeY!=y) {
              squares[x][y] = 0;
            }
          } else {
            squares[x][freeY-1] *= 2;
            squares[x][y] = 0;
            freeY--;
          }
          freeY++;
        } 
      }
    }
  } else {
    for (x=0; x<squares.length; x++) {
      freeY = 3;
      for (y=squares[0].length-1; y>=0; y--) {
        if (squares[x][y] != 0) {
          if (freeY==3 || squares[x][freeY+1]!=squares[x][y]) {
            squares[x][freeY] = squares[x][y];
            if (freeY!=y) {
              squares[x][y] = 0;
            }
          } else {
            squares[x][freeY+1] *= 2;
            squares[x][y] = 0;
            freeY++;
          }
          freeY--;
        } 
      }
    }
  }
  return squares;
}
