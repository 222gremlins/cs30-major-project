const GRILL_WIDTH = 750;
const GRILL_HEIGHT = 575;
const GRILL_X = 550;
const GRILL_Y = 200;
const SLOT_SIZE = 120;

const RAW_PATTY_X = 295;
const RAW_PATTY_Y = 560;
const RAW_PATTY_SIZE = 100;
const HALF_TIME = 150;
const PERFECT_TIME = 300;
const BURNT_TIME = 500;

let grillUpgraded = false;
let grillSpeedLevel = 1;
let grillSlots = [];
let unlockedSlots = 1
let slotCost = 25;

class Patty {
  constructor(slot) {
    // setting size/location
    this.size = SLOT_SIZE * 0.8;
    this.x = slot.x + SLOT_SIZE/2 - this.size/2;
    this.y = slot.y + SLOT_SIZE/2 - this.size/2;
    
    // setting beginning state and cooking variables
    this.state = "raw";
    this.onGrill = true;
    this.cookingTime = 0;
  }
  
  updatePatty() {
    if (this.onGrill) {
      this.cookingTime += grillSpeedLevel;   // set the constants
      if (this.cookingTime <= HALF_TIME) {
        this.state = "raw";
      }
      else if (this.cookingTime <= PERFECT_TIME) {
        this.state = "half";
      }
      else if (this.cookingTime <= BURNT_TIME) {
        this.state = "perfect";
      }
      else {
        this.state = "overcooked";
      }
    }
    
    console.log(this.state);
  }
  
  display() {
    imageMode(CORNER);
    if (this.state === "raw"){
      image(rawPatty, this.x, this.y, this.size, this.size);
    }
    if (this.state === "half") {
      image(cookingPatty, this.x, this.y, this.size, this.size);
    }
    if (this.state === "perfect") {
      image(perfectPatty, this.x, this.y,this.size, this.size);
    }
    if (this.state === "overcooked") {
      image(overcookedPatty, this.x, this.y, this.size, this.size);
    }
  }
  isHovered() {
    return mouseHover(this.x, this.y, this.size, this.size);
  }
}

function setupGrillSlots() {
  grillSlots = [];
  let paddingX = (GRILL_WIDTH-SLOT_SIZE*3)/4;
  let paddingY = (GRILL_HEIGHT-SLOT_SIZE*3)/4;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let x = GRILL_X + paddingX + col * (SLOT_SIZE + paddingX);
      let y = GRILL_Y + paddingY + row * (SLOT_SIZE + paddingY);
      grillSlots.push({
        x: x,
        y: y,
        patty: 0,
        locked: grillSlots.length >= unlockedSlots
      });
    }
  }
}

function findEmptySlot() {
  for (let slot of grillSlots) {
    if (!slot.locked && slot.patty === 0) {
      return slot;
    }
  }
}