
//customers
let currentCustomer;
let customerImages = [];
//money system/rating and appliance upgrades
let money = 50; 
let income;
// getting money per burger
let lastRating = "";
let lastPayout = 0;
//feedback
let showFeedback = false;
let feedbackTimer = 0;

class Customer {
  constructor() {
    this.order = this.generateOrder();
    this.patience = MAX_PATIENCE;
    this.image = random(customerImages);
    this.dialogue = random(["I'd like a burger, please!", "Can I get a burger?", "Make me a burger!", "I'm hungry for a burger!", "Smells good! I'll have a burger!"]);
  }
  update() {
    this.patience--;
  }
  draw(x, y) {
    imageMode(CENTER);
    image(this.image, x, y, 300, 300);
    imageMode(CORNER);
  }
  isAngry() {
    return this.patience <= 0;
  }
  generateOrder() {
    let order = [];

    let extras = ["cheese", "lettuce", "tomato", "pickle", "onion"];
    let sauces = ["ketchup", "mustard", "mayo", "bbq sauce"];

    order.push("bun bottom");

    let pattyCount = random(0, 2); 
    for (let i = 0; i < pattyCount; i++) {
      order.push("patty");
    }
    //creates a random topping/sauce count for the order
    let extraCount = floor(random(0, 4));
    //built in shuffle function from p5.js
    shuffle(extras, true);

    for (let i = 0; i < extraCount; i++) {
      order.push(extras[i]);
    }
    // 70% chance of sauce on the order
    if (random() < 0.7) {
      order.push(random(sauces));
    }

    order.push("bun top");
    return order;
  }
  
  display() {
    drawReceipt();

    text("customer patience: " + this.patience, 170, 500);
  }
}

function checkOrder(customer) {
  if (burgerStack.length !== customer.order.length) {
    return false;
  }
  for (let i = 0; i < burgerStack.length; i++) {
    if (burgerStack[i] !== customer.order[i]) {
      return false;
    } 
  }
  return true;
}

function drawReceipt() {
  fill(255);
  rect(GAME_WIDTH - 400, 150, 350, 500, 20);

  makeTextNice(0, LEFT, 20);
  text("RECEIPT", GAME_WIDTH - 360, 190);

  text("Order:", GAME_WIDTH - 360, 230);
  for (let i = 0; i < currentCustomer.order.length; i++) {
    text("- " + currentCustomer.order[i], GAME_WIDTH - 360, 260 + i * 22);
  }

  let y = 260 + currentCustomer.order.length * 22 + 20;
  text("Your Burger:", GAME_WIDTH - 360, y);

  for (let i = 0; i < burgerStack.length; i++) {
    text("- " + burgerStack[i], GAME_WIDTH - 360, y + 30 + i * 22);
  }
  let sauceY = y + 30 + burgerStack.length * 22;

  for (let sauce of sauceLayers) {
    text("- " + sauce.type, GAME_WIDTH - 360, sauceY);
    sauceY += 22;
  }
}

function rateBurger(customer, burger) {
  let correct = 0;

  for (let item of burger) {
    if (customer.order.includes(item)) {
      correct++;
    }
  }
  for (let sauce of sauceLayers) {
    if (customer.order.includes(sauce.type)) {
      correct++;
    }
  }

  let accuracy = correct / customer.order.length;

  if (accuracy === 1) {
   return { stars: 5, text: "Perfect!" };
  }
  if (accuracy >= 0.8) {
    return { stars: 4, text: "Great!" };
  }
  if (accuracy >= 0.6) {
    return { staSrs: 3, text: "Okay" };
  }
  if (accuracy >= 0.4) {
    return { stars: 2, text: "Meh…" };
  }
  return { stars: 1, text: "Terrible" };
}