const container = document.getElementById("container");
const fish = document.getElementById("fish");
const frame = document.getElementById("frame");
const scoreElement = document.getElementById("scoreValue");
const progressBar = document.getElementById("progress-bar");

let isMouseDown = false;
let score = 0;
let frameInterval;
let gameTimer;

gameTimer = setTimeout(() => {
  endGame(false);
}, 50000);

function updateProgressBar() {
  const targetScore = 100000; // Điểm số mục tiêu để đạt được
  let progressPercentage = (score / targetScore) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  progressBar.style.height = `${progressPercentage}%`;

  if (score < targetScore) {
    requestAnimationFrame(updateProgressBar);
  }
}

updateProgressBar(); // Bắt đầu cập nhật thanh tiến trình

addEventListener("mousedown", () => {
  isMouseDown = true;
  moveFrame();
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    endGame(false); // Kết thúc trò chơi với thua cuộc
  }
});

function moveFrame() {
  if (isMouseDown) {
    const currentTop = parseInt(frame.style.bottom) || 0;
    const newTop = Math.min(currentTop + 2, 300);
    frame.style.bottom = newTop + "px";
  } else {
    const currentTop = parseInt(frame.style.bottom) || 0;
    const newTop = Math.max(currentTop - 1, 0);
    frame.style.bottom = newTop + "px";
  }

  checkCollision();
  requestAnimationFrame(moveFrame);
}

function checkCollision() {
  if (isCollision()) {
    score += 1;
    updateScore();
  }

  if (score >= 100000) {
    endGame(true);
  }
}

function updateScore() {
  scoreElement.innerText = score;
}

function endGame(isWinner, isEscPressed = false) {
  if (isWinner) {
    // alert("Chúc mừng! Bạn đã thắng với số điểm là " + score);
    alert("Chúc mừng! Bạn đã câu được CÁ CHÀ BẶC");
    $.post("https://dl-fishing/success", {}, function () {});
  } else {
    if (isEscPressed) {
      // alert("Bạn đã chọn kết thúc trò chơi.");
      alert("CÁ CHÀ BẶC đã tuột khỏi cần câu");
      $.post("https://dl-fishing/fail", {}, function () {});
    } else {
      // alert("Hết giờ! Bạn đã thua. Số điểm cuối cùng của bạn là " + score);
      alert("CÁ CHÀ BẶC đã tuột khỏi cần câu");
      $.post("https://dl-fishing/fail", {}, function () {});
    }
  }
  resetGame();
}

function resetGame() {
  score = 0;
  updateScore();
  frame.style.transition = "none";
  frame.style.bottom = "0px";
  progressBar.style.height = "100%";

  setTimeout(() => {
    frame.style.transition = "bottom 1s";
  }, 0);

  clearInterval(frameInterval);
  clearTimeout(gameTimer);

  gameTimer = setTimeout(() => {
    endGame(false);
  }, 50000);

  updateProgressBar(); // Bắt đầu lại cập nhật thanh tiến trình
}

function moveFish() {
  const containerHeight = container.clientHeight;
  const fishHeight = fish.clientHeight;
  const minY = 0;

  const randomY = Math.floor(
    Math.random() * (containerHeight - fishHeight - minY + 1)
  );
  fish.style.bottom = randomY + "px";
}

let noCollisionTime = 0; // Thời gian không có va chạm
const collisionThreshold = 1000; // Ngưỡng điểm để không trừ

function updateScorePeriodically() {
  setInterval(() => {
    if (!isCollision()) {
      noCollisionTime += 1;
      if (score >= collisionThreshold) {
        score -= 1000;
        updateScore();
      }
    } else {
      noCollisionTime = 0;
    }
  }, 1000);
}

function isCollision() {
  const fishTop = fish.getBoundingClientRect().top;
  const frameTop = frame.getBoundingClientRect().top;
  const fishBot = fish.getBoundingClientRect().bottom;
  const frameBot = frame.getBoundingClientRect().bottom;

  return frameTop <= fishBot && frameBot >= fishTop;
}

function animateFish() {
  function moveFishStep() {
    const containerHeight = container.clientHeight;
    const fishHeight = fish.clientHeight;
    const minY = 0;

    const randomY = Math.floor(
      Math.random() * (containerHeight - fishHeight - minY + 1)
    );
    fish.style.bottom = randomY + "px";

    setTimeout(moveFishStep, 2000);
  }

  moveFishStep();
}

animateFish();
updateScorePeriodically();
moveFrame();
