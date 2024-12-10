// fruit.js

// Renamed 'words' to 'fruitWords' to avoid conflicts with basketball.
const fruitWords = [
    "apple",
    "banana",
    "cherry",
    "orange",
    "grape",
    "melon",
    "peach",
    "kiwi",
    "pear",
    "plum",
  ];
  
  let fruits = [];
  let fruitTypedWord = "";
  let fruitScore = 0;
  let fruitLives = 5;
  let fruitGameStarted = false;
  let fruitDifficultyMultiplier = 1;
  let fruitLastDifficultyIncreaseTime = 0;
  
  const fruitKeyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const fruitKeySize = 40;
  const fruitKeySpacing = 10;
  const fruitKeyboardTop = 460;
  let fruitHighlightBackspace = false;
  
  // Initialize the fruit game
  function initFruit() {
    textSize(24);
    textAlign(CENTER, CENTER);
    resetFruitGame();
  }
  
  // Called every frame when state = 'fruit'
  function fruitGame() {
    background(50, 150, 200);
  
    if (!fruitGameStarted) {
      drawFruitStartScreen();
      return;
    }
  
    if (fruitLives === 0) {
      drawFruitGameOverScreen();
      return;
    }
  
    // Increase difficulty every 35 seconds
    if (millis() - fruitLastDifficultyIncreaseTime > 35000) {
      increaseFruitDifficulty();
      fruitLastDifficultyIncreaseTime = millis();
    }
  
    updateFruits();
  
    drawFruitHUD();
    drawFruitTypingBox();
    drawFruitKeyboard();
  }
  
  function fruitKeyPressed(k, kCode) {
    // Start/restart the game with ENTER
    if (!fruitGameStarted && kCode === ENTER) {
      resetFruitGame();
      return;
    }
    if (fruitLives === 0 && kCode === ENTER) {
      resetFruitGame();
      return;
    }
  
    if (!fruitGameStarted || fruitLives === 0) return;
  
    if (kCode === BACKSPACE && fruitTypedWord.length > 0) {
      fruitHighlightBackspace = true;
      fruitTypedWord = fruitTypedWord.slice(0, -1);
      return;
    }
  
    // If it's a letter key
    if (k.length === 1 && /[a-zA-Z]/.test(k)) {
      fruitTypedWord += k.toLowerCase();
  
      let targetFruitIndex = -1;
      let lowestY = -1;
      for (let i = 0; i < fruits.length; i++) {
        if (fruitTypedWord === fruits[i].word && fruits[i].y > lowestY) {
          targetFruitIndex = i;
          lowestY = fruits[i].y;
        }
      }
  
      if (targetFruitIndex !== -1) {
        fruitScore++;
        fruits[targetFruitIndex].isSliced = true;
        fruitTypedWord = "";
      }
    }
  }
  
  function fruitKeyReleased(k, kCode) {
    if (kCode === BACKSPACE) {
      fruitHighlightBackspace = false;
    }
  }
  
  function drawFruitStartScreen() {
    fill(255);
    textSize(36);
    text("Typing Fruit Ninja", width / 2, height / 2 - 50);
    textSize(20);
    text("Type words to slice fruits!", width / 2, height / 2);
    text("Press ENTER to start", width / 2, height / 2 + 50);
  }
  
  function drawFruitGameOverScreen() {
    fill(255);
    textSize(36);
    text("Game Over", width / 2, height / 2 - 50);
    textSize(24);
    text(`Your Score: ${fruitScore}`, width / 2, height / 2);
    text("Press ENTER to restart", width / 2, height / 2 + 50);
  }
  
  function drawFruitHUD() {
    fill(255);
    textSize(20);
    text(`Score: ${fruitScore}`, 100, 30);
    drawFruitLives();
  
    textSize(18);
    fill(255);
    text("Press Escape to return to the menu", width / 2, height - 40);
  }
  
  function drawFruitLives() {
    const heartSize = 30;
    const spacing = 10;
    const startX = width - 150;
    const startY = 20;
  
    for (let i = 0; i < fruitLives; i++) {
      fill(255, 0, 0);
      noStroke();
      beginShape();
      vertex(startX + i * (heartSize + spacing), startY + heartSize / 2);
      bezierVertex(
        startX + i * (heartSize + spacing) - heartSize / 2,
        startY,
        startX + i * (heartSize + spacing) - heartSize / 2,
        startY + heartSize,
        startX + i * (heartSize + spacing),
        startY + heartSize
      );
      bezierVertex(
        startX + i * (heartSize + spacing) + heartSize / 2,
        startY + heartSize,
        startX + i * (heartSize + spacing) + heartSize / 2,
        startY,
        startX + i * (heartSize + spacing),
        startY + heartSize / 2
      );
      endShape(CLOSE);
    }
  }
  
  function drawFruitTypingBox() {
    const boxWidth = 300;
    const boxHeight = 40;
  
    fill(200);
    rect(
      width / 2 - boxWidth / 2,
      fruitKeyboardTop - 100,
      boxWidth,
      boxHeight,
      5
    );
    fill(50);
    textSize(16);
    text(fruitTypedWord, width / 2, fruitKeyboardTop - 80);
  }
  
  function drawFruitKeyboard() {
    const rowOffsets = [0, fruitKeySize / 2, fruitKeySize];
    const keyboardWidth =
      fruitKeyboardRows[0].length * (fruitKeySize + fruitKeySpacing) -
      fruitKeySpacing;
  
    for (let row = 0; row < fruitKeyboardRows.length; row++) {
      const keys = fruitKeyboardRows[row];
      const rowWidth =
        keys.length * (fruitKeySize + fruitKeySpacing) - fruitKeySpacing;
      const rowStartX = width / 2 - rowWidth / 2 + rowOffsets[row];
  
      for (let col = 0; col < keys.length; col++) {
        const x = rowStartX + col * (fruitKeySize + fruitKeySpacing);
        const y = fruitKeyboardTop + row * (fruitKeySize + fruitKeySpacing);
  
        if (fruitTypedWord.endsWith(keys[col])) {
          fill(0, 255, 0);
        } else {
          fill(200);
        }
  
        rect(x, y, fruitKeySize, fruitKeySize, 5);
        fill(50);
        textSize(20);
        text(keys[col], x + fruitKeySize / 2, y + fruitKeySize / 2);
      }
    }
  
    const backspaceWidth = fruitKeySize * 3;
    const keyboardWidthFull =
      fruitKeyboardRows[0].length * (fruitKeySize + fruitKeySpacing) -
      fruitKeySpacing;
    const backspaceX = width / 2 + keyboardWidthFull / 2 + fruitKeySpacing;
    const backspaceY = fruitKeyboardTop;
    if (fruitHighlightBackspace) {
      fill(0, 255, 0);
    } else {
      fill(200);
    }
    rect(backspaceX, backspaceY, backspaceWidth, fruitKeySize, 5);
    fill(50);
    textSize(18);
    text(
      "Backspace",
      backspaceX + backspaceWidth / 2,
      backspaceY + fruitKeySize / 2
    );
  }
  
  function updateFruits() {
    if (
      frameCount % 60 === 0 &&
      fruits.length < 3 &&
      fruitGameStarted &&
      fruitLives > 0
    ) {
      spawnFruit();
    }
  
    for (let i = fruits.length - 1; i >= 0; i--) {
      let fruit = fruits[i];
  
      if (fruit.isSliced) {
        fruit.sliceAnimation();
        if (fruit.sliceDone) {
          fruits.splice(i, 1);
        }
        continue;
      }
  
      fruit.y += fruit.speed;
  
      if (fruit.y > height) {
        fruits.splice(i, 1);
        fruitLives--;
        continue;
      }
  
      fill(fruit.color);
      ellipse(fruit.x, fruit.y, fruit.size);
      fill(255);
      textSize(16);
      text(fruit.word, fruit.x, fruit.y);
    }
  }
  
  function spawnFruit() {
    let fruit = {
      x: random(50, width - 50),
      y: 0,
      size: 50,
      speed: random(1.5, 3) * fruitDifficultyMultiplier,
      word: random(fruitWords),
      color: color(random(200, 255), random(50, 200), random(50, 150)),
      isSliced: false,
      sliceDone: false,
      half1: null,
      half2: null,
      sliceAnimation: function () {
        if (!this.half1 && !this.half2) {
          this.half1 = { x: this.x, y: this.y, vx: -2, vy: -4 };
          this.half2 = { x: this.x, y: this.y, vx: 2, vy: -4 };
        }
  
        if (this.half1) {
          this.half1.x += this.half1.vx;
          this.half1.y += this.half1.vy;
          this.half1.vy += 0.2;
          fill(this.color);
          arc(this.half1.x, this.half1.y, this.size, this.size, PI, TWO_PI);
        }
  
        if (this.half2) {
          this.half2.x += this.half2.vx;
          this.half2.y += this.half2.vy;
          this.half2.vy += 0.2;
          fill(this.color);
          arc(this.half2.x, this.half2.y, this.size, this.size, 0, PI);
        }
  
        if (this.half1.y > height && this.half2.y > height) {
          this.sliceDone = true;
        }
      },
    };
    fruits.push(fruit);
  }
  
  function resetFruitGame() {
    fruitGameStarted = true;
    fruitScore = 0;
    fruitLives = 5;
    fruits = [];
    fruitTypedWord = "";
    fruitDifficultyMultiplier = 1;
    fruitLastDifficultyIncreaseTime = millis();
  }
  
  function increaseFruitDifficulty() {
    fruitDifficultyMultiplier += 0.2;
  }
  
  
  
  