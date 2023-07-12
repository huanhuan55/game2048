let restartBtn = document.querySelector(".restart-btn");
let bestValueTextBtn = document.querySelector(".best-value>.text");
let scoreValueTextBtn = document.querySelector(".score-value>.text");
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
  // gridArr[10] = 10240;
  generateNum();
  generateNum();
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
  // 把当前游戏的分数渲染
  scoreValueTextBtn.innerText = score;
  // 从本地存贮中获取bestScore
  best = localStorage.getItem("bestScore");
  // 把最高分渲染出来
  bestValueTextBtn.innerHTML = best > 0 ? best : 0;
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
    // 给2位数以内的数字大小为53px，三位数以上的大小为43px
    let len = String(val).length;
    gridCell.style.fontSize = len < 3 ? "53px" : "43px";
    if (len === 4) {
      gridCell.style.fontSize = "35px";
    }
    if (len === 5) {
      gridCell.style.fontSize = "30px";
    }
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

/**
 * 下面是手机端判断手势滑动方向
 */
// 手机滑动屏幕，传入事件
var startx, starty;

//获得角度
function getAngle(angx, angy) {
  return (Math.atan2(angy, angx) * 180) / Math.PI;
}

//根据起点终点返回方向 1向上滑动 2向下滑动 3向左滑动 4向右滑动 0点击事件
function getDirection(startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;

  //如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result;
  }

  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
    result = 1;
  } else if (angle > 45 && angle < 135) {
    result = 2;
  } else if (
    (angle >= 135 && angle <= 180) ||
    (angle >= -180 && angle < -135)
  ) {
    result = 3;
  } else if (angle >= -45 && angle <= 45) {
    result = 4;
  }
  return result;
}

//手指接触屏幕
document.addEventListener(
  "touchstart",
  function (e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
  },
  false
);

//手指离开屏幕
document.addEventListener(
  "touchend",
  function (e) {
    // 判断是否结束游戏
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

    // 没有结束游戏，判断手势滑动方向
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = getDirection(startx, starty, endx, endy);
    switch (direction) {
      case 0:
        // alert("点击！");
        break;
      case 1:
        if (ifUp) {
          moveUp();
          generateNum();
          render();
        }
        break;
      case 2:
        if (ifDown) {
          moveDown();
          generateNum();
          render();
        }
        break;
      case 3:
        if (ifLeft) {
          moveLeft();
          generateNum();
          render();
        }
        break;
      case 4:
        if (ifRight) {
          moveRight();
          generateNum();
          render();
        }
        break;
      default:
        // alert("点击！");
        break;
    }
  },
  false
);

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
