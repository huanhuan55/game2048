let restartBtn = document.querySelector(".restart-btn");
let bestScoreValue = document.querySelector(".best-score-value");
let gridArr;

let score = 0;
let best = 0;
start();
// 开始游戏的函数
function start() {
  // let gridCell = document.querySelector(".grid-box").children;
  // for (let i = 0; i < gridCell.length; i++) {
  //   gridCell[i].innerHTML = `<span> 0 </span>`;
  // }
  score = 0;
  gridArr = [];
  for (let i = 0; i < 16; i++) {
    gridArr[i] = 0;
  }
  // gridArr[0] = 4;
  // gridArr[1] = 4;
  // gridArr[2] = 2;
  // gridArr[3] = 2;
  // gridArr[4] = 0;
  // gridArr[5] = 2;
  // gridArr[6] = 2;
  // gridArr[7] = 4;
  // gridArr[9] = 2;
  // gridArr[10] = 2;
  generateNum();
  generateNum();
  bestScoreValue.innerHTML = `最高分${best}`;
  render();
}

// 在随机位置生成随机2或4
function generateNum() {
  let randomIdx;
  do {
    randomIdx = Math.floor(Math.random() * 16);
  } while (gridArr[randomIdx] > 0);
  gridArr[randomIdx] = Math.random() < 0.5 ? 2 : 4;
}

// 将数组渲染至页面的结构中
function render() {
  let scoreValue = document.querySelector(".score-value");
  scoreValue.innerText = score;
  // 从本地存贮中获取bestScore
  best = localStorage.getItem("bestScore");
  // 把最高分渲染出来
  bestScoreValue.innerHTML = best;
  for (let idx = 0; idx < 16; idx++) {
    let row = parseInt(idx / 4);
    let col = idx % 4;
    let gridCell = document.querySelector(`.grid-cell-${row}-${col}`);
    let val = gridArr[idx] > 0 ? gridArr[idx] : "";
    // gridCell.innerHTML = val;
    // 给不同的数字渲染不同的颜色
    if (val >= 64) {
      gridCell.innerHTML = `<span class="grid-cell-value-64">${val}</span> `;
    } else {
      gridCell.innerHTML = `<span class="grid-cell-value-${val}">${val}</span> `;
    }
    let len = String(val).length;
    gridCell.style.fontSize = len < 2 ? "38px" : "34px";
  }
}

// 点击按钮重新开始游戏
restartBtn.onclick = function () {
  start();
};

// 按下键盘，传入事件
document.onkeydown = function (event) {
  let ifLeft = ifCanMoveLeft();
  let ifRight = ifCanMoveRight();
  let ifUp = ifCanMoveUp();
  let ifDown = ifCanMoveDown();
  if (!ifLeft && !ifRight && !ifUp && !ifDown) {
    //
    if (score > best) {
      localStorage.setItem("bestScore", score);
    }
    alert("Game Over");
    return;
  }
  if (event.code === "ArrowLeft") {
    // 先判断棋盘是否能移动
    if (ifLeft) {
      moveLeft();
      generateNum();
      render();
    }
  } else if (event.code === "ArrowRight") {
    if (ifRight) {
      moveRight();
      generateNum();
      render();
    }
  } else if (event.code === "ArrowUp") {
    if (ifUp) {
      moveUp();
      generateNum();
      render();
    }
  } else if (event.code === "ArrowDown") {
    if (ifDown) {
      moveDown();
      generateNum();
      render();
    }
  }
};

// 避开第一列格子
// 只要找到一个格子的前一个格子没有值或值等于零，才可以移动棋盘
function ifCanMoveLeft() {
  for (let i = 0; i < gridArr.length; i++) {
    if (i % 4 === 0 || gridArr[i] === 0) {
      continue;
    }
    if (gridArr[i - 1] === 0 || gridArr[i - 1] === gridArr[i]) {
      return true;
    }
  }
  return false;
}

// 避开最后一列格子
// 只要找到一个格子的后一个格子没有值或值等于零，才可以移动棋盘
function ifCanMoveRight() {
  for (let i = 0; i < gridArr.length; i++) {
    if (i % 4 === 3 || gridArr[i] === 0) {
      continue;
    }
    if (gridArr[i + 1] === 0 || gridArr[i + 1] === gridArr[i]) {
      return true;
    }
  }
  return false;
}

// 避开第一行格子
// 只要找到一个格子的后一个格子没有值或值等于零，才可以移动棋盘
function ifCanMoveUp() {
  for (let i = 0; i < gridArr.length; i++) {
    if (i < 4 || gridArr[i] === 0) {
      continue;
    }
    if (gridArr[i - 4] === 0 || gridArr[i - 4] === gridArr[i]) {
      return true;
    }
  }
  return false;
}

// 避开最后一行格子
function ifCanMoveDown() {
  for (let i = 0; i < gridArr.length; i++) {
    if (i > 11 || gridArr[i] === 0) {
      continue;
    }
    if (gridArr[i + 4] === 0 || gridArr[i + 4] === gridArr[i]) {
      return true;
    }
  }
  return false;
}

// 向左移动
function moveLeft() {
  let luojiaoStartLieArr = [0, 0, 0, 0];
  for (let i = 0; i < gridArr.length; i++) {
    if (i % 4 === 0) {
      continue;
    }
    if (gridArr[i] > 0) {
      let currentRow = parseInt(i / 4);
      let currentColumn = i % 4;
      for (
        let luojiaolie = luojiaoStartLieArr[currentRow];
        luojiaolie < currentColumn;
        luojiaolie++
      ) {
        let luojiaoIdx = currentRow * 4 + luojiaolie;
        if (gridArr[luojiaoIdx] === 0 && noBlockHorizontal(luojiaoIdx, i)) {
          gridArr[luojiaoIdx] = gridArr[i];
          gridArr[i] = 0;
        } else if (
          gridArr[luojiaoIdx] === gridArr[i] &&
          noBlockHorizontal(luojiaoIdx, i)
        ) {
          gridArr[luojiaoIdx] = gridArr[i] + gridArr[luojiaoIdx];
          score += gridArr[luojiaoIdx];
          gridArr[i] = 0;
          luojiaoStartLieArr[currentRow] = luojiaolie + 1;
        }
      }
    }
  }
}

// 向上移动
function moveUp() {
  let luojiaoStartHangArr = [0, 0, 0, 0];
  for (let i = 0; i < gridArr.length; i++) {
    if (i < 4) {
      continue;
    }
    if (gridArr[i] > 0) {
      let currentRow = parseInt(i / 4);
      let currentColumn = i % 4;
      for (
        let luojiaohang = luojiaoStartHangArr[currentColumn];
        luojiaohang < currentRow;
        luojiaohang++
      ) {
        let luojiaoIdx = luojiaohang * 4 + currentColumn;
        if (gridArr[luojiaoIdx] === 0 && noBlockVertical(luojiaoIdx, i)) {
          gridArr[luojiaoIdx] += gridArr[i];
          gridArr[i] = 0;
        } else if (
          gridArr[luojiaoIdx] === gridArr[i] &&
          noBlockVertical(luojiaoIdx, i)
        ) {
          gridArr[luojiaoIdx] += gridArr[i];
          score += gridArr[luojiaoIdx];
          gridArr[i] = 0;
          luojiaoStartHangArr[currentColumn] = luojiaohang + 1;
        }
      }
    }
  }
}

// 向右移动
/**
 * 从后往前遍历15->0
 * 排除最后一排和数字为零的格子
 * currentRow 是目标格子的行
 * currentColumn 是目标格子的列
 *
 */
function moveRight() {
  let luojiaoStartLieArr = [3, 3, 3, 3];
  for (let i = gridArr.length - 1; i >= 0; i--) {
    if (i % 4 === 3) {
      continue;
    }
    if (gridArr[i] > 0) {
      let currentRow = parseInt(i / 4);
      let currentColumn = i % 4;
      for (
        let luojiaolie = luojiaoStartLieArr[currentRow];
        luojiaolie > currentColumn;
        luojiaolie--
      ) {
        let luojiaoIdx = currentRow * 4 + luojiaolie;
        if (gridArr[luojiaoIdx] === 0 && noBlockHorizontal(i, luojiaoIdx)) {
          gridArr[luojiaoIdx] += gridArr[i];
          gridArr[i] = 0;
        } else if (
          gridArr[luojiaoIdx] === gridArr[i] &&
          noBlockHorizontal(i, luojiaoIdx)
        ) {
          gridArr[luojiaoIdx] += gridArr[i];
          score += gridArr[luojiaoIdx];
          gridArr[i] = 0;
          luojiaoStartLieArr[currentRow] = luojiaolie - 1;
        }
      }
    }
  }
}

// 向下移动
function moveDown() {
  let luojiaoStartHangArr = [3, 3, 3, 3];
  for (let i = gridArr.length - 1; i >= 0; i--) {
    if (i > 11) {
      continue;
    }
    if (gridArr[i] > 0) {
      let currentRow = parseInt(i / 4);
      let currentColumn = i % 4;
      for (
        let luojiaohang = luojiaoStartHangArr[currentColumn];
        luojiaohang > currentRow;
        luojiaohang--
      ) {
        let luojiaoIdx = luojiaohang * 4 + currentColumn;
        if (gridArr[luojiaoIdx] === 0 && noBlockVertical(i, luojiaoIdx)) {
          gridArr[luojiaoIdx] += gridArr[i];
          gridArr[i] = 0;
        } else if (
          gridArr[luojiaoIdx] === gridArr[i] &&
          noBlockVertical(i, luojiaoIdx)
        ) {
          gridArr[luojiaoIdx] += gridArr[i];
          score += gridArr[luojiaoIdx];
          gridArr[i] = 0;
          luojiaoStartHangArr[currentColumn] = luojiaohang - 1;
        }
      }
    }
  }
}

// 封装判断水平方向有没有障碍物
function noBlockHorizontal(minIdx, maxIdx) {
  for (let i = minIdx + 1; i < maxIdx; i++) {
    if (gridArr[i] > 0) {
      return false;
    }
  }
  return true;
}

// 封装判断垂直方向有没有障碍物
function noBlockVertical(minIdx, maxIdx) {
  for (let i = minIdx + 4; i < maxIdx; i += 4) {
    if (gridArr[i] > 0) {
      return false;
    }
  }
  return true;
}
