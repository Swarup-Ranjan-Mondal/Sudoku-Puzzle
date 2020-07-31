var solution = [];
var puzzleGrid = [];
var puzzle = [];
var solvingCells = [];

function checkRow(grid, row, col, num) {
  for (var i = 0; i < 9; i++) {
    if (grid[row][i] == num) return false;
  }
  return true;
}

function checkCol(grid, row, col, num) {
  for (var i = 0; i < 9; i++) {
    if (grid[i][col] == num) return false;
  }
  return true;
}

function checkNonet(grid, row, col, num) {
  var nonetStartRow = 3 * Math.floor(row / 3);
  var nonetStartCol = 3 * Math.floor(col / 3);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (grid[nonetStartRow + i][nonetStartCol + j] == num) return false;
    }
  }
  return true;
}

function isUnique(grid, row, col, num) {
  if (
    checkRow(grid, row, col, num) &&
    checkCol(grid, row, col, num) &&
    checkNonet(grid, row, col, num)
  )
    return true;
  else return false;
}

initCells = function () {
  for (var i = 0; i < 9; i++) {
    solution[i] = [];
    for (var j = 0; j < 9; j++) {
      solution[i][j] = 0;
    }
  }
};

resetCells = function () {
  puzzle = copy(puzzleGrid);
  solvingCells = [];
  for (var i = 0; i < puzzle.length; i++) {
    for (var j = 0; j < puzzle[i].length; j++) {
      var cellCanvas = document.getElementById("cell-" + (i * 9 + j)),
        ctx = cellCanvas.getContext("2d");
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, 300, 200);
    }
  }
  printPuzzle();
};

copy = function (array) {
  var arr = [];
  for (var i = 0; i < array.length; i++) {
    arr[i] = [];
    for (var j = 0; j < array[i].length; j++) arr[i][j] = array[i][j];
  }
  return arr;
};

buildSolution = function (cellNo) {
  cellNo = cellNo || 0;
  if (cellNo == 81) return true;

  var count = 0,
    shuffledNumList = [];
  while (count < 9) {
    var randNum = Math.floor(9 * Math.random() + 1);
    if (shuffledNumList.indexOf(randNum) == -1) {
      shuffledNumList.push(randNum);
      count++;
    }
  }

  var row = Math.floor(cellNo / 9),
    col = cellNo % 9;
  for (var k = 0; k < 9; k++) {
    if (isUnique(solution, row, col, shuffledNumList[k])) {
      solution[row][col] = shuffledNumList[k];
      if (buildSolution(cellNo + 1)) return true;
    }
  }

  solution[row][col] = 0;
  return false;
};

makePuzzle = function (diffLevel) {
  diffLevel = diffLevel || 3;
  var blanks = 0,
    cells = copy(solution);

  if (diffLevel == 1) blanks = Math.floor(0.2 * 81);
  else if (diffLevel == 2) blanks = Math.floor(0.3 * 81);
  else if (diffLevel == 3) blanks = Math.floor(0.4 * 81);
  else if (diffLevel == 4) blanks = Math.floor(0.5 * 81);
  else if (diffLevel == 5) blanks = Math.floor(0.6 * 81);
  else if (diffLevel == 6) blanks = Math.floor(0.7 * 81);

  for (var i = 0; i < blanks; ) {
    var randRow = Math.floor(9 * Math.random()),
      randCol = Math.floor(9 * Math.random());

    if (cells[randRow][randCol] != 0) {
      cells[randRow][randCol] = 0;
      i++;
    }
  }
  puzzleGrid = cells;
  puzzle = copy(puzzleGrid);
  document.querySelector(".maxPoints").value = blanks * 5;
};

printPuzzle = function () {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (puzzle[i][j]) {
        var cellCanvas = document.getElementById("cell-" + (i * 9 + j)),
          ctx = cellCanvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.font = 8 + "rem Bree Serif";
        ctx.fillText(puzzle[i][j], 120, 120);
      }
    }
  }
};

solvePuzzle = function (cellNo) {
  cellNo = cellNo || 0;
  if (cellNo == 81) return true;
  var row = Math.floor(cellNo / 9),
    col = cellNo % 9;
  if (puzzle[row][col]) return solvePuzzle(cellNo + 1);

  for (var k = 1; k <= 9; k++) {
    if (isUnique(puzzle, row, col, k)) {
      puzzle[row][col] = k;
      solvingCells.push({ cell: cellNo, val: k });
      if (solvePuzzle(cellNo + 1)) return true;
    }
  }
  solvingCells.push({ cell: cellNo, val: 0 });
  puzzle[row][col] = 0;
  return false;
};

pauseToPrint = function (val, ctx) {
  ctx.font = 8 + "rem Bree Serif";
  var alpha = 0.0,
    interval = setInterval(function () {
      if (alpha >= 0.95 || val == 0) ctx.fillStyle = "#fafafa";
      else ctx.fillStyle = "rgba(255, 229, 76, " + alpha + ")";

      ctx.fillRect(0, 0, 300, 200);

      if (alpha <= 0.4) ctx.fillStyle = "rgba(0, 255, 0, " + alpha + ")";
      else if (alpha > 0.4 && alpha <= 0.75)
        ctx.fillStyle = "rgba(0, 0, 255, " + alpha + ")";
      else ctx.fillStyle = "rgba(255, 0, 0, " + alpha + ")";

      if (val) ctx.fillText(val, 120, 120);
      alpha = alpha + 0.05;
      if (alpha > 1) {
        clearInterval(interval);
      }
    }, 50);
};

showsSolvingProcess = function () {
  for (var i = 0; i < solvingCells.length; i++) {
    (function (i) {
      var cellCanvas = document.getElementById("cell-" + solvingCells[i].cell),
        ctx = cellCanvas.getContext("2d");
      setTimeout(function () {
        pauseToPrint(solvingCells[i].val, ctx);
      }, i * 500);
    })(i);
  }
};

var startGame = document.querySelector("#start-game");
startGame.addEventListener("click", () => {
  if (level == 0) return;

  initCells();
  buildSolution();
  makePuzzle(level);
  resetCells();
  printPuzzle();
});

var solve = document.getElementById("solve");
solve.addEventListener("click", () => {
  resetCells();
  solvePuzzle();
  showsSolvingProcess();
});

var reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  resetCells();
});

var visible = false;
var cell = document.getElementsByClassName("cell");
var currentCell = "null";
var cellno = -1;
var left = document.querySelector(".left");
for (var i = 0; i < cell.length; i++) {
  (function (i) {
    cell[i].addEventListener("click", () => {
      var row = Math.floor(i / 9),
        col = i % 9;
      if (puzzleGrid[row][col] == 0) {
        if (!visible) {
          left.classList.remove("left-animation");
          visible = true;
        } else {
          left.classList.add("left-animation");
          if (currentCell != cell[i].id) {
            setTimeout(() => {
              left.classList.remove("left-animation");
            }, 600);
            visible = true;
          } else {
            visible = false;
          }
        }
        currentCell = cell[i].id;
        cellno = i;
      } else if (visible) {
        left.classList.add("left-animation");
        visible = false;
      }
    });
  })(i);
}

var numBtn = document.getElementsByClassName("numButtons"),
  score = document.querySelector(".score");
for (var i = 0; i < numBtn.length; i++) {
  (function (i) {
    numBtn[i].addEventListener("click", () => {
      var ctx = document.getElementById(currentCell).getContext("2d"),
        row = Math.floor(cellno / 9),
        col = cellno % 9;
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, 300, 200);
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.font = 8 + "rem Bree Serif";
      puzzle[row][col] = parseInt(numBtn[i].id, 10);
      score.value = getScore();
      if (puzzle[row][col]) ctx.fillText(puzzle[row][col], 120, 120);
    });
  })(i);
}

getScore = function () {
  var score = 0;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (puzzleGrid[i][j] == 0 && puzzle[i][j] == solution[i][j]) score += 5;
    }
  }
  return score;
};

const optionList = document.querySelector(".options-list");
const select = document.querySelector(".select");

const option = document.querySelectorAll(".option");
var level = 0;
select.addEventListener("click", () => {
  optionList.classList.toggle("active");
});

option.forEach((o) => {
  o.addEventListener("click", () => {
    select.innerHTML = o.querySelector("label").innerHTML;
    var id = o.querySelector("input").id;
    level = parseInt(id[1]);
    optionList.classList.remove("active");
  });
});

view = document.querySelector("#view");
view.addEventListener("click", () => {
  if (view.innerHTML == "See Solution") {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var cellCanvas = document.getElementById("cell-" + (i * 9 + j)),
          ctx = cellCanvas.getContext("2d");
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, 300, 200);
        if (puzzleGrid[i][j]) ctx.fillStyle = "#000000";
        else ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.font = 8 + "rem Bree Serif";
        ctx.fillText(solution[i][j], 120, 120);
      }
    }
    view.innerHTML = "Back";
  } else if (view.innerHTML == "Back") {
    resetCells();
    view.innerHTML = "See Solution";
  }
});
