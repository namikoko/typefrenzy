// basketball.js

// Renamed 'words' to 'basketWords' to avoid conflicts
const basketWords = [
    "apple",
    "grape",
    "chair",
    "table",
    "happy",
    "cloud",
    "green",
    "pencil",
    "school",
    "flower",
    "window",
    "orange",
    "mouse",
    "dinner",
    "bright",
    "yellow",
    "purple",
    "summer",
    "friend",
    "coffee",
    "guitar",
    "mirror",
    "planet",
    "winter",
    "bottle",
    "garden",
    "cookie",
    "puzzle",
    "rocket",
    "screen",
    "forest",
    "artist",
    "sunset",
    "animal",
    "shadow",
    "jungle",
    "ocean",
    "butter",
    "castle",
    "circle",
    "studio",
    "nature",
    "valley",
    "island",
    "travel",
    "banana",
    "candle",
    "soccer",
    "tennis",
    "future",
    "orange",
    "basket",
    "mobile",
    "reason",
    "dragon",
    "planet",
    "energy",
    "camera",
    "school",
    "mirror",
    "window",
    "castle",
    "bright",
    "people",
    "guitar",
    "rocket",
    "pencil",
    "travel",
    "coffee",
    "circle",
    "garden",
    "artist",
    "summer",
    "energy",
    "cloud",
    "friend",
    "screen",
    "shadow",
    "forest",
    "happy",
    "orange",
  ];
  
  let currentWord = "";
  let typedWord = "";
  let playerScore = 0;
  let opponentScore = 0;
  let timeLimit = 75;
  let wordTimeLimit = 5;
  let wordStartTime;
  let startTime;
  let gameStarted = false;
  
  let basketballs = [];
  let player;
  let opponent;
  let jumpForce = -10;
  let groundLevel = 350;
  let maxJumpHeight = 300;
  
  // Keyboard design
  const basketKeyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const basketKeySize = 40;
  const basketKeySpacing = 10;
  const basketKeyboardTop = 520;
  
  // Initialize the basketball game
  function initBasketball() {
    textSize(32);
    textAlign(CENTER, CENTER);
    currentWord = random(basketWords);
    typedWord = "";
    playerScore = 0;
    opponentScore = 0;
    basketballs = [];
    player = { x: 200, y: 350, vy: 0, isJumping: false, color: [100, 100, 255] };
    opponent = {
      x: 600,
      y: 350,
      vy: 0,
      isJumping: false,
      color: [255, 100, 100],
    };
    wordStartTime = millis();
    startTime = millis();
    gameStarted = true;
  }
  
  // Called every frame when state = 'basketball'
  function basketballGame() {
    background(50, 150, 200);
  
    if (gameStarted) {
      let timeElapsed = floor((millis() - startTime) / 1000);
      let timeLeft = max(0, timeLimit - timeElapsed);
      let minutes = floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      let formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  
      if (timeLeft === 0 || playerScore >= 10 || opponentScore >= 10) {
        endBasketballGame();
      }
  
      let wordTimeLeft = max(
        0,
        wordTimeLimit - floor((millis() - wordStartTime) / 1000)
      );
      if (wordTimeLeft === 0) {
        opponentScores();
      }
  
      // Draw timer
      fill(255);
      textSize(24);
      text("Time Left: " + formattedTime, width / 2, 30);
  
      // Draw current word
      textSize(32);
      fill(255);
      text("Type: " + currentWord, width / 2, 150);
  
      // Typed word box
      fill(200);
      rect(width / 2 - 200, basketKeyboardTop - 70, 400, 40, 5);
      fill(50);
      textSize(20);
      text(typedWord, width / 2, basketKeyboardTop - 50);
  
      // Word time remaining
      fill(255, 200, 200);
      text("Word Time: " + wordTimeLeft + "s", width / 2, 280);
  
      drawHoops();
      updateBasketCharacter(player);
      updateBasketCharacter(opponent);
      drawBasketKeyboard();
      updateBasketballs();
    } else {
      // Game Over or Start Screen
      fill(255);
      textSize(40);
      if (playerScore === 0 && opponentScore === 0) {
        text("Typing Basketball", width / 2, height / 2 - 50);
        textSize(20);
        text("Press ENTER to start", width / 2, height / 2);
      } else {
        let winner = playerScore > opponentScore ? "You Win!" : "Opponent Wins!";
        text(winner, width / 2, height / 2 - 50);
        textSize(20);
        text("Press ENTER to restart", width / 2, height / 2 + 50);
      }
    }
  }
  
  // Handle keys for basketball game
  function basketballKeyPressed(k, kCode) {
    if (!gameStarted) {
      if (kCode === ENTER) {
        resetBasketballGame();
      }
      return;
    }
  
    if (kCode === BACKSPACE && typedWord.length > 0) {
      typedWord = typedWord.slice(0, -1);
      return;
    }
  
    // If it's a letter key
    if (k.length === 1 && /[a-zA-Z]/.test(k)) {
      typedWord += k.toLowerCase();
  
      if (typedWord === currentWord) {
        playerScores();
      } else if (!currentWord.startsWith(typedWord)) {
        opponentScores();
      }
    }
  }
  
  function drawHoops() {
    const hoopY = 70;
    const scoreY = 110;
  
    fill(100, 100, 255);
    rect(150, hoopY, 100, 20);
    fill(255);
    textSize(16);
    text("PLAYER HOOP", 200, hoopY - 20);
  
    fill(255, 100, 100);
    rect(550, hoopY, 100, 20);
    fill(255);
    text("OPPONENT HOOP", 600, hoopY - 20);
  
    textSize(32);
    fill(100, 100, 255);
    text(playerScore, 200, scoreY);
    fill(255, 100, 100);
    text(opponentScore, 600, scoreY);
  
    textSize(18);
    fill(255);
    text("Press Escape to return to the menu", width / 2, height - 40);
  }
  
  function drawBasketKeyboard() {
    let keyboardWidth =
      basketKeyboardRows[0].length * (basketKeySize + basketKeySpacing) -
      basketKeySpacing;
    let keyboardStartX = width / 2 - keyboardWidth / 2;
  
    for (let row = 0; row < basketKeyboardRows.length; row++) {
      let keys = basketKeyboardRows[row];
      for (let col = 0; col < keys.length; col++) {
        let x = keyboardStartX + col * (basketKeySize + basketKeySpacing);
        let y = basketKeyboardTop + row * (basketKeySize + basketKeySpacing);
  
        if (typedWord.endsWith(keys[col])) {
          fill(0, 255, 0);
        } else {
          fill(200);
        }
  
        rect(x, y, basketKeySize, basketKeySize, 5);
        fill(50);
        textSize(20);
        text(keys[col], x + basketKeySize / 2, y + basketKeySize / 2);
      }
    }
  }
  
  function updateBasketballs() {
    for (let i = basketballs.length - 1; i >= 0; i--) {
      let ball = basketballs[i];
  
      if (!ball.stopped) {
        ball.vy += 0.5;
        ball.x += ball.vx;
        ball.y += ball.vy;
  
        if (
          ball.type === "player" &&
          ball.x >= 550 &&
          ball.y >= 70 &&
          ball.y <= 90
        ) {
          ball.stopped = true;
          ball.explosionFrame = 0;
        } else if (
          ball.type === "opponent" &&
          ball.x <= 250 &&
          ball.y >= 70 &&
          ball.y <= 90
        ) {
          ball.stopped = true;
          ball.explosionFrame = 0;
        }
      } else {
        ball.explosionFrame++;
        let pulseSize = ball.explosionFrame * 3;
        noFill();
        strokeWeight(2);
        stroke(255, 165, 0, 200 - ball.explosionFrame * 10);
        ellipse(ball.x, ball.y, pulseSize);
  
        if (ball.type === "player") {
          stroke(255, 200, 0, 200 - ball.explosionFrame * 10);
          rect(550, 70, 100, 20);
        } else {
          stroke(255, 200, 0, 200 - ball.explosionFrame * 10);
          rect(150, 70, 100, 20);
        }
  
        if (ball.explosionFrame > 20) {
          basketballs.splice(i, 1);
        }
      }
  
      if (!ball.stopped) {
        fill(ball.color);
        noStroke();
        ellipse(ball.x, ball.y, 20, 20);
      }
    }
  }
  
  function updateBasketCharacter(char) {
    if (char.isJumping) {
      char.vy += 1;
      char.y += char.vy;
  
      if (char.y < maxJumpHeight) {
        char.y = maxJumpHeight;
        char.vy = 0;
      }
  
      if (char.y >= groundLevel) {
        char.y = groundLevel;
        char.vy = 0;
        char.isJumping = false;
      }
    }
  
    fill(char.color);
    ellipse(char.x, char.y, 30, 30);
    rect(char.x - 10, char.y + 15, 20, 30);
  }
  
  function playerScores() {
    playerScore++;
    addBasketball("player");
    typedWord = "";
    currentWord = random(basketWords);
    wordStartTime = millis();
    player.isJumping = true;
    player.vy = jumpForce;
  }
  
  function opponentScores() {
    opponentScore++;
    addBasketball("opponent");
    typedWord = "";
    currentWord = random(basketWords);
    wordStartTime = millis();
    opponent.isJumping = true;
    opponent.vy = jumpForce;
  }
  
  function resetBasketballGame() {
    playerScore = 0;
    opponentScore = 0;
    typedWord = "";
    currentWord = random(basketWords);
    basketballs = [];
    player.isJumping = false;
    player.y = groundLevel;
    opponent.isJumping = false;
    opponent.y = groundLevel;
    wordStartTime = millis();
    gameStarted = true;
    startTime = millis();
  }
  
  function endBasketballGame() {
    gameStarted = false;
  }
  
  function addBasketball(type) {
    let char = type === "player" ? player : opponent;
    let targetX = type === "player" ? 600 : 200;
    let targetY = 70;
  
    let dx = targetX - char.x;
    let dy = targetY - char.y;
    let totalTime = 50;
    let vx = dx / totalTime;
    let vy = (dy - 0.5 * 0.5 * totalTime * totalTime) / totalTime;
  
    basketballs.push({
      x: char.x,
      y: char.y - 20,
      vx: vx,
      vy: vy,
      stopped: false,
      explosionFrame: 0,
      type: type,
      color: type === "player" ? color(255, 100, 100) : color(100, 100, 255),
    });
  }
  
  
  
  