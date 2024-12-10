let state = "menu"; // Possible states: 'menu', 'basketball', 'fruit', 'racer'

function setup() {
  createCanvas(800, 800); // Everything is 800 by 800
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);

  if (state === "menu") {
    showMenu();
  } else if (state === "basketball") {
    basketballGame();
  } else if (state === "fruit") {
    fruitGame();
  } else if (state === "racer") {
    racerGame();
  }
}

function showMenu() {
  fill(255);
  textSize(32);
  text("Main Menu", width / 2, height / 4);

  textSize(24);
  text("Press 1 for Basketball", width / 2, height / 2 - 40);
  text("Press 2 for Fruit", width / 2, height / 2);
  text("Press 3 for Racer", width / 2, height / 2 + 40);

  textSize(18);
  text(
    "Press Escape in any game to return to the menu",
    width / 2,
    height - 40
  );
}

function keyPressed() {
  if (state === "menu") {
    if (key === "1") {
      initBasketball();
      state = "basketball";
    } else if (key === "2") {
      initFruit();
      state = "fruit";
    } else if (key === "3") {
      initRacer();
      state = "racer";
    }
  } else {
    if (keyCode === ESCAPE) {
      state = "menu";
    } else {
      // Route keypresses to the current game's handler
      if (state === "basketball") {
        basketballKeyPressed(key, keyCode);
      } else if (state === "fruit") {
        fruitKeyPressed(key, keyCode);
      } else if (state === "racer") {
        racerKeyPressed(key, keyCode);
      }
    }
  }
}

function keyReleased() {
  if (state === "fruit") {
    fruitKeyReleased(key, keyCode);
  } else if (state === "racer") {
    racerKeyReleased(key, keyCode);
  }
}



