const words = ["hello", "world", "beat", "type", "fast", "music", "rhythm", "flow", "tap", "drop"];
const container = document.getElementById('game');
const input = document.getElementById('input');
const scoreEl = document.getElementById('score');
const levelSelect = document.getElementById('level');
const bgm = document.getElementById('bgm');
const gameOverSound = new Audio('https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3');


let score = 0;
let speed = 5000;
let beatInterval = 2000;
let currentWords = [];
let gameInterval;
let gameOver = false;


const restartBtn = document.createElement('button');
restartBtn.innerText = 'Restart';
restartBtn.style.position = 'absolute';
restartBtn.style.bottom = '70px';
restartBtn.style.left = '50%';
restartBtn.style.transform = 'translateX(-50%)';
restartBtn.style.padding = '10px 20px';
restartBtn.style.fontSize = '16px';
restartBtn.style.display = 'none';
container.appendChild(restartBtn);

const popup = document.createElement('div');
popup.style.position = 'absolute';
popup.style.top = '50%';
popup.style.left = '50%';
popup.style.transform = 'translate(-50%, -50%)';
popup.style.background = 'rgba(0, 0, 0, 0.85)';
popup.style.color = 'white';
popup.style.padding = '30px 50px';
popup.style.borderRadius = '12px';
popup.style.fontSize = '20px';
popup.style.textAlign = 'center';
popup.style.zIndex = '1000';
popup.style.display = 'none';
container.appendChild(popup);

function setDifficulty(level) {
  switch(level) {
    case 'easy':
      speed = 6000;
      beatInterval = 2500;
      container.style.background = 'linear-gradient(to bottom, #000428, #004e92)';
      bgm.src = 'https://www.fesliyanstudios.com/play-mp3/387';
      break;
    case 'medium':
      speed = 4000;
      beatInterval = 1500;
      container.style.background = 'linear-gradient(to bottom, #1e3c72, #2a5298)';
      bgm.src = 'https://www.fesliyanstudios.com/play-mp3/388';
      break;
    case 'hard':
      speed = 3000;
      beatInterval = 1000;
      container.style.background = 'linear-gradient(to bottom, #8e0e00, #1f1c18)';
      bgm.src = 'https://www.fesliyanstudios.com/play-mp3/389';
      break;
  }
  bgm.play(); // Play background music at game start
}

function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  input.disabled = true;
  
  popup.innerHTML = `<p>Game Over!<br>Your score is: <strong>${score}</strong></p>`;
  popup.style.display = 'block';
gameOverSound.play();
bgm.pause();
bgm.currentTime = 0;
  restartBtn.style.display = 'block';
  restartBtn.style.display = 'block';
}

function createWord() 
{
  if (gameOver) return;
  const word = words[Math.floor(Math.random() * words.length)];
  const span = document.createElement('span');
  span.classList.add('word');
  span.innerText = word;
  span.style.left = `${Math.random() * 80 + 10}%`;
  span.style.animationDuration = `${speed / 1000}s`;
  container.appendChild(span);
  currentWords.push(span);

  setTimeout(() => {
    if (currentWords.includes(span)) {
      container.removeChild(span);
      currentWords.splice(currentWords.indexOf(span), 1);
            score -= 5;
      scoreEl.innerText = `Score: ${score}`;
      if (score < 0) endGame();
    }
  }, speed);
}

function checkInput() {
  const value = input.value.trim();
  for (let i = 0; i < currentWords.length; i++) {
    if (currentWords[i].innerText === value) {
      container.removeChild(currentWords[i]);
      currentWords.splice(i, 1);
      input.value = '';
      score += 10;
bgm.play(); // Play bgm again on correct typing
      scoreEl.innerText = `Score: ${score}`;
      return;
    }
  }
}

function restartGame() {
  score = 0;
  scoreEl.innerText = `Score: ${score}`;
  currentWords.forEach(word => word.remove());
  currentWords = [];
  input.value = '';
  input.disabled = false;
  gameOver = false;
  restartBtn.style.display = 'none';
  popup.style.display = 'none';
  
  setDifficulty(levelSelect.value);
  clearInterval(gameInterval);
  gameInterval = setInterval(createWord, beatInterval);
}

restartBtn.addEventListener('click', restartGame);
input.addEventListener('input', checkInput);
levelSelect.addEventListener('change', e => {
  setDifficulty(e.target.value);
});

setDifficulty('easy');
gameInterval = setInterval(createWord, beatInterval);
