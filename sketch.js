// CS30 Major Project, Cooking Game
// Elaine King
// 11/19/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//Patience variables for timed orders
const MAX_PATIENCE = 100;


class Customer {
  constructor() {
    // can i put generateOrder as this.order...?
    this.order = ;
    this.patience = MAX_PATIENCE;

  }

  generateOrder() {

  }
}

// either make this class an extention or maybe not depending on how it all goes
class Patty {
  constructor(x, y) {
    // setting size/location
    this.x = x;
    this.y = y;
    this.size = 100;

    // setting beginning state and cooking variables
    this.state = "raw";
    this.isDragging = false;
    this.onGrill = false;
  }

  updatePatty() {
    if (this.onGrill) {
      cookingTime ++;   // fix these somenumbers
      if (cookingTime < SOMENUMBERHERE) {
        this.state = "raw"
      }
      else if (cookingtime >= SOMENUMBER && cookingTime <= SOMEOTHERNUMBER) {
        this.state = "cooked"
      }
      else {
        this.state = "burnt"
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  circle(mouseX,mouseY, 100);
}



// Receipt in corner - can be brought out/pushed in

// Introductory Dialogue, background and gather player name/ tutorial that can be SKIPPED