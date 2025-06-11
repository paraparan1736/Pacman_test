const tileW = 100 / 31;
const tileH = 100 / 28;

const PACMAN = document.getElementById('PACMAN');
const RED = document.getElementById('RED');
const PINK = document.getElementById('PINK');
const BLUE = document.getElementById('BLUE');
const YELLOW = document.getElementById('YELLOW');

let score = 0;
let lives = 3;
let cookieCount = 0; // 총 쿠키 개수를 저장할 변수
let currentStage = 1; // 현재 스테이지

// 유령 객체들을 저장할 변수 선언
let redGhost;
let pinkGhost;
let blueGhost;
let yellowGhost;

// 쿠키 DOM 요소를 저장할 배열
const cookieDomElements = Array(32).fill(null).map(() => Array(28).fill(null));

const BackGround_Map =//배열 수정 금지
[      // 공백:0 벽:1  유령벽:2  방향갱신점:3 왼쪽통로이동:4 우측통로이동:5
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,3,0,0,0,0,0,3,1,1,3,0,0,0,0,0,3,0,0,0,0,3,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,3,0,0,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,0,0,3,1],
        [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
        [1,3,0,0,0,0,3,1,1,3,0,0,3,1,1,3,0,0,3,1,1,3,0,0,0,0,3,1],
        [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
        [0,0,0,0,0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,1,1,3,0,0,3,3,3,3,0,0,3,1,1,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,1,1,0,1,1,1,2,2,1,1,1,0,1,1,0,1,0,0,0,0,0],
        [1,1,1,1,1,1,0,1,1,0,1,3,0,0,0,0,3,1,0,1,1,0,1,1,1,1,1,1],
        [0,0,0,0,0,0,3,0,0,3,1,0,0,0,0,0,0,1,3,0,0,3,0,0,0,0,0,0],
        [1,1,1,1,1,1,0,1,1,0,1,3,0,3,3,0,3,1,0,1,1,0,1,1,1,1,1,1],
        [0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,1,1,3,0,0,0,0,0,0,0,0,3,1,1,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0],
        [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
        [1,3,0,0,0,0,3,0,0,3,0,0,3,1,1,3,0,0,3,0,0,3,0,0,0,0,3,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,3,0,3,1,1,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,1,1,3,0,3,1],
        [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
        [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
        [1,3,0,3,0,0,3,1,1,3,0,0,3,1,1,3,0,0,3,1,1,3,0,0,3,0,3,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,3,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// 원본 쿠키 맵 저장
const Original_Cookie_Map = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,2,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,2,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const Basic_Cookie_Map = //배열 수정 금지
[       // 공백:0 일반쿠키:1 파워쿠키:2 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,2,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,2,0],
        [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
        [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
        [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// 위치 설정 함수
function setPositionByGrid(element, x, y) {
  // 실제 맵에 맞는 픽셀 단위 계산 (560x640 기준)
  const pxW = 560 / 28; // 20px
  const pxH = 640 / 31; // 약 20.645px
  // x, y는 맵 배열 기준(0부터 시작)
  element.style.left = `${x * pxW + pxW/2}px`;
  element.style.top = `${(y-1) * pxH + pxH/2}px`;

  // 디버깅: 유령 위치 확인
  if (element.id === 'RED' || element.id === 'PINK' || element.id === 'BLUE' || element.id === 'YELLOW') {
    console.log(`Setting position for ${element.id}: x=${x}, y=${y}`);
  }

  // 팩맨 방향 회전(부호 반전)
  if (element === PACMAN) {
    switch (Pacman.Direction) {
      case 'W':
        element.style.transform = 'translate(-50%, -50%) rotate(90deg)';
        break;
      case 'S':
        element.style.transform = 'translate(-50%, -50%) rotate(-90deg)';
        break;
      case 'A':
        element.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        break;
      case 'D':
        element.style.transform = 'translate(-50%, -50%) rotate(180deg)';
        break;
    }
  }
}

// 거리 계산 함수 (Original.Cs의 Fartest)
function Fartest(ax, ay, bx, by) {
  return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
}

// 점수 업데이트 함수
function updateScore(value) {
  score += value;
  document.getElementById('score-value').textContent = score;
}

// 목숨 업데이트 함수
function updateLives(value) {
  if (value < 0) {
    lives += value;  // 감소할 때는 더하기
  } else {
    lives = value;   // 초기화할 때는 직접 설정
  }
  document.getElementById('lives-value').textContent = lives;
  if (lives <= 0) {
    gameOver();
  }
}

// 게임 오버 처리
function gameOver() {
  gameRunning = false;  // 게임 루프 정지
  document.getElementById('final-score').textContent = score;
  document.getElementById('game-over').style.display = 'block';
}

// 점수 공유 함수
function shareScore() {
  const text = `팩맨 게임에서 ${score}점을 획득했습니다!`;
  if (navigator.share) {
    navigator.share({
      title: '팩맨 게임 점수',
      text: text
    });
  } else {
    // 클립보드에 복사
    navigator.clipboard.writeText(text).then(() => {
      alert('점수가 클립보드에 복사되었습니다!');
    });
  }
}

// 게임 초기화
let gameFrameCount = 0;
function initGame() {
  // 팩맨 시작 위치
  Pacman.Reset();

  // 유령 객체 인스턴스 생성
  redGhost = new RedGhost();
  pinkGhost = new PinkGhost();
  blueGhost = new BlueGhost();
  yellowGhost = new YellowGhost();

  // 유령 초기화
  redGhost.reset();
  pinkGhost.reset();
  blueGhost.reset();
  yellowGhost.reset();

  // 스테이지 설정 적용
  const settings = stageSettings[currentStage];
  Pacman.Speed = settings.pacmanSpeed;
  Ghost.NomalSpeed = settings.ghostSpeed;
  Ghost.FrightenedTime = settings.frightenedTime;

  updateScore(0);
}

// 게임 재시작 함수 수정
function restartGame() {
  gameRunning = true;
  document.getElementById('game-over').style.display = 'none';
  currentStage = 1;
  updateStage(currentStage);
  updateLives(3); // 게임 재시작 시에만 라이프 초기화
  createCookies(); // 게임 재시작 시 쿠키 생성
  initGame();
}

// 스테이지 재시작 함수 추가
function restartStage() {
  // 팩맨과 유령만 초기화
  Pacman.Reset();
  redGhost.reset();
  pinkGhost.reset();
  blueGhost.reset();
  yellowGhost.reset();
  createCookies();
  
  // 스테이지 설정 적용
  const settings = stageSettings[currentStage];
  Pacman.Speed = settings.pacmanSpeed;
  Ghost.NomalSpeed = settings.ghostSpeed;
  Ghost.FrightenedTime = settings.frightenedTime;
}

// 게임 승리 처리 수정
function gameWin() {
  if (currentStage < 5) {
    // 다음 스테이지로 진행
    currentStage++;
    updateStage(currentStage);
    createCookies(); // 쿠키 맵 초기화 및 재생성
    restartStage(); // 스테이지 재시작
  } else {
    // 최종 승리
    gameRunning = false;
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over').querySelector('h2').textContent = '최종 승리!';
  }
}

// 웹페이지 로드 시 실행되는 초기화 함수
window.onload = function() {
  createCookies(); // 초기 쿠키 생성
  initGame(); // 게임 초기화
  requestAnimationFrame(gameLoop); // 게임 루프 시작
};

// 게임 루프 시작
let lastFrameTime = 0;
const frameInterval = 1000 / 60; // 60 FPS를 위한 프레임 간격 (밀리초)

let gameRunning = true;  // 게임 실행 상태를 추적하는 변수 추가

function gameLoop(timestamp) {
  // 이전 프레임과의 시간 차이 계산
  const elapsed = timestamp - lastFrameTime;
  
  // 60 FPS에 맞춰 프레임 업데이트
  if (elapsed >= frameInterval && gameRunning) {  // gameRunning 체크 추가
    gameFrameCount++;
    Ghost.updateGlobalModes(gameFrameCount);

    Pacman.update();
    
    if (redGhost) redGhost.updateBehavior();
    if (pinkGhost) pinkGhost.updateBehavior();
    if (blueGhost) blueGhost.updateBehavior();
    if (yellowGhost) yellowGhost.updateBehavior();

    checkGhostCollision();
    
    lastFrameTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

// 유령 충돌 감지
function checkGhostCollision() {
    const ghosts = [redGhost, pinkGhost, blueGhost, yellowGhost];
    for (const ghost of ghosts) {
        if (ghost && Fartest(ghost.Float_x, ghost.Float_y, Pacman.Float_x, Pacman.Float_y) < 0.25) {
            if (ghost.MoveMode !== "Frightened" && ghost.MoveMode !== "Death") {
                Pacman.handleDeath();
                break;
            } else if (ghost.MoveMode === "Frightened") {
                ghost.MoveMode = "Death";
                updateScore(250);
            }
        }
    }
}

// 레벨별 설정
const stageSettings = {
  1: { pacmanSpeed: 0.25, ghostSpeed: 0.2, frightenedTime: 10 * 60 },
  2: { pacmanSpeed: 0.28, ghostSpeed: 0.22, frightenedTime: 9 * 60 },
  3: { pacmanSpeed: 0.31, ghostSpeed: 0.24, frightenedTime: 8 * 60 },
  4: { pacmanSpeed: 0.34, ghostSpeed: 0.26, frightenedTime: 7 * 60 },
  5: { pacmanSpeed: 0.37, ghostSpeed: 0.28, frightenedTime: 6 * 60 }
};

// 스테이지 업데이트 함수
function updateStage(value) {
  currentStage = value;
  document.getElementById('stage-value').textContent = currentStage;
}

// 쿠키 생성 및 배치
function createCookies() {
  const gameContainer = document.getElementById('pacman-game');
  
  // 기존 쿠키 제거
  for (let y = 0; y < cookieDomElements.length; y++) {
    for (let x = 0; x < cookieDomElements[y].length; x++) {
      if (cookieDomElements[y][x]) {
        cookieDomElements[y][x].remove();
        cookieDomElements[y][x] = null;
      }
    }
  }
  
  // Basic_Cookie_Map을 원본으로 복원
  for (let y = 0; y < Basic_Cookie_Map.length; y++) {
    for (let x = 0; x < Basic_Cookie_Map[y].length; x++) {
      Basic_Cookie_Map[y][x] = Original_Cookie_Map[y][x];
    }
  }
  
  cookieCount = 0; // 쿠키 카운트 초기화
  
  for (let y = 0; y < Basic_Cookie_Map.length; y++) {
    for (let x = 0; x < Basic_Cookie_Map[y].length; x++) {
      if (Basic_Cookie_Map[y][x] === 1 || Basic_Cookie_Map[y][x] === 2) { // 일반 쿠키나 파워 쿠키일 경우
        cookieCount++; // 쿠키 카운트 증가
      }
      if (Basic_Cookie_Map[y][x] === 1) { // 일반 쿠키
        const cookie = document.createElement('img');
        cookie.src = 'Image/N_Cookie.png';
        cookie.className = 'cookie';
        cookie.style.position = 'absolute';
        cookie.style.width = '4px';
        cookie.style.height = '4px';
        setPositionByGrid(cookie, x, y);
        gameContainer.appendChild(cookie);
        cookieDomElements[y][x] = cookie; // DOM 요소 저장
      } else if (Basic_Cookie_Map[y][x] === 2) { // 파워 쿠키
        const powerCookie = document.createElement('img');
        powerCookie.src = 'Image/P_Cookie.png';
        powerCookie.className = 'power-cookie';
        powerCookie.style.position = 'absolute';
        powerCookie.style.width = '12px';
        powerCookie.style.height = '12px';
        setPositionByGrid(powerCookie, x, y);
        gameContainer.appendChild(powerCookie);
        cookieDomElements[y][x] = powerCookie; // DOM 요소 저장
      }
    }
  }
}

// 쿠키 먹기 함수 수정
function Eat() {
  const cookieType = Basic_Cookie_Map[this.Int_y][this.Int_x];

  switch (cookieType) {
    case 1: // 일반 쿠키
      Basic_Cookie_Map[this.Int_y][this.Int_x] = 0; // 맵에서 쿠키 제거
      if (cookieDomElements[this.Int_y][this.Int_x]) {
        cookieDomElements[this.Int_y][this.Int_x].remove(); // 화면에서 쿠키 제거
        cookieDomElements[this.Int_y][this.Int_x] = null; // 참조 제거
        updateScore(10);
        cookieCount--; // 쿠키 카운트 감소
        if (cookieCount === 0) { // 모든 쿠키를 먹었을 때
          gameWin();
        }
      }
      break;
    case 2: // 파워 쿠키
      Basic_Cookie_Map[this.Int_y][this.Int_x] = 0; // 맵에서 쿠키 제거
      if (cookieDomElements[this.Int_y][this.Int_x]) {
        cookieDomElements[this.Int_y][this.Int_x].remove(); // 화면에서 쿠키 제거
        cookieDomElements[this.Int_y][this.Int_x] = null; // 참조 제거
        updateScore(20);
        cookieCount--; // 쿠키 카운트 감소
        if (cookieCount === 0) { // 모든 쿠키를 먹었을 때
          gameWin();
        }
      }
      Ghost.FrightenedLeft = Ghost.FrightenedTime; // Frightened 모드 지속 시간 설정
      const ghosts = [redGhost, pinkGhost, blueGhost, yellowGhost];
      for (const ghost of ghosts) {
        if (ghost && (ghost.MoveMode === "Scatter" || ghost.MoveMode === "Chase")) {
          ghost.MoveMode = "Frightened";
        }
      }
      break;
  }
}