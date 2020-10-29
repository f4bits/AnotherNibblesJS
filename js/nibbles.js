const colors = [
  "yellow",
  "orange",
  "firebrick",
];

let worm = [[3, 3], [2, 3]],
  board = [],
  wormX = 1,
  wormY = 0,
  speed = 100,
  score = 0,
  grow = 0,
  isGameOver = false;
let pressInterval = 50,
  lastTimeKeyPressed = new Date().getTime();

const boardContainer = document.getElementById("container"),
  message = document.getElementById("message"),
  scoreLabel = document.getElementById("score");

function generateBoard(rows, cols) {
  var result = [];
  for (var i = 0; i < cols; i++) {
    result.push(new Array(rows).fill(0));
  }
  return result;
}

function renderWorm(worm) {
  worm.forEach(p => {
    board[p[1]][p[0]] = 1;
  }
  );
}

function hasCollision(incX, incY, worm) {
  let posX = worm[0][0] + incX;
  let posY = worm[0][1] + incY;

  if (
    (posX < 0 || posY < 0) || (posX >= board[0].length || posY >= board.length)
  ) {
    return true;
  }
  if (
    posX < board[0].length &&
    posX >= 0 &&
    posY < board.length &&
    posY >= 0
  ) {
    if (board[posY][posX] == 1) {
      return true;
    }
  }

  return false;
}

function moveWorm(incX, incY) {
  if (hasCollision(incX, incY, worm)) {
    isGameOver = true;
    return;
  }
  let posX = worm[0][0] + incX;
  let posY = worm[0][1] + incY;
  if (board[posY][posX] > 1) {
    grow += 4;
    let randy = Math.floor(Math.random() * board.length);
    let randx = Math.floor(Math.random() * board[0].length)
    while (board[randy][randx] > 0) {
      randy = Math.floor(Math.random() * board.length);
      randx = Math.floor(Math.random() * board[0].length);
    }
    board[randy][randx] = 2;
    score += 100;
    scoreLabel.innerText = score;
  }
  worm.unshift([worm[0][0] + incX, worm[0][1] + incY]);
  if (worm.length > 1 && grow == 0) {
    let lastSegment = worm[worm.length - 1];
    board[lastSegment[1]][lastSegment[0]] = 0;
    worm.pop();
  }
  if (grow > 0) grow--;
}


function renderBoard(matrix, container) {
  let rows = matrix.length;
  let cols = matrix[0].length;
  container.innerHTML = "";
  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = document.createElement("div");
      if (matrix[y][x] > 0) {
        const color = colors[matrix[y][x] - 1];
        cell.style = "background-color:" + color;
      }
      container.appendChild(cell).className = "board-item";
    }
  }
}

function go() {
  moveWorm(wormX, wormY);
  renderWorm(worm);
  renderBoard(board, boardContainer);
}

function endGame() {
  document.getElementById("instructions").style.display = "none";
  message.innerText = "Game over!";
  document.removeEventListener("keydown", onKeyDown);
  document.getElementById("startButton").style.visibility = "visible";
  document.getElementById("startButton").addEventListener("click", newGame);
}

function runner() {
  if (isGameOver) {
    endGame();
    return;
  }
  go();
  setTimeout(function () {
    runner();
  }, speed);
}

function newGame() {
  isGameOver = false;
  worm = [[3, 3], [2, 3]];
  wormX = 1;
  wormY = 0;
  speed = 100;
  score = 0;
  grow = 0;
  message.innerText = "";
  document.getElementById("instructions").style.display = "block";
  document.getElementById("startButton").removeEventListener("click", newGame);
  document.getElementById("startButton").style.visibility = "hidden";
  scoreLabel.innerText = "0";
  document.addEventListener("keydown", onKeyDown);
  board = generateBoard(65, 40);
  board[10][12] = 2;
  renderBoard(board, boardContainer);
  runner();
}

board = generateBoard(65, 40);
renderBoard(board, boardContainer);
document.getElementById("startButton").addEventListener("click", newGame);

function onKeyDown(e) {
  if ((lastTimeKeyPressed + pressInterval) >= (new Date()).getTime()) return;
  lastTimeKeyPressed = new Date().getTime();
  if (isGameOver) {
    endGame();
  }
  var kCode = e && e.which ? e.which : e.keyCode;
  switch (kCode) {
    case 37:
      wormX = wormX == 1 ? wormX : -1;
      wormY = 0;
      break;
    case 38:
      wormX = 0;
      wormY = wormY == 1 ? wormY : -1;
      break;
    case 39:
      wormX = wormX == - 1 ? wormX : 1;
      wormY = 0;
      break;
    case 40:
      wormX = 0;
      wormY = wormY == - 1 ? wormY : 1;
      break;
  }
}
