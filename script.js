const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cellSize = 20;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
let grid = createEmptyGrid(rows, cols);
let intervalId;

function createEmptyGrid(rows, cols) {
  let grid = [];
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
    }
  }
  return grid;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      ctx.beginPath();
      ctx.rect(j * cellSize, i * cellSize, cellSize, cellSize);
      ctx.fillStyle = cell ? "#000" : "#fff";
      ctx.fill();
      ctx.stroke();
    });
  });
}

function toggleCell(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const col = Math.floor(mouseX / cellSize);
  const row = Math.floor(mouseY / cellSize);
  grid[row][col] = grid[row][col] ? 0 : 1;
  drawGrid();
}

function clearGrid() {
  grid = createEmptyGrid(rows, cols);
  drawGrid();
}

function startGame() {
    console.log("startGame");
  intervalId = setInterval(updateGrid, 100);
}

function stopGame() {
console.log("stopGame");
  clearInterval(intervalId);
}

function updateGrid() {
  let newGrid = createEmptyGrid(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(i, j);
      if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[i][j] = 0;
      } else if (grid[i][j] === 0 && neighbors === 3) {
        newGrid[i][j] = 1;
      } else {
        newGrid[i][j] = grid[i][j];
      }
    }
  }
  grid = newGrid;
  drawGrid();
}

function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        count += grid[newRow][newCol];
      }
    }
  }
  return count;
}

canvas.addEventListener("click", toggleCell);
drawGrid();

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
      if (!intervalId) {
        startGame();
      } else {
        stopGame();
      }
    }
  });