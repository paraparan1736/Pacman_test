console.log('Level.js started');
const Pacman = {
  
  Start_x : 13, // 시작 위치 x
  Start_y : 24, // C# 원본 기준 하단 중앙(필요시 23 또는 24로 조정)
  
  Speed : 0.25,
  
  Int_x : 13,
  Int_y : 23,
  
  Float_x : 13,
  Float_y : 23,
  
  Floor_Tile : 0,
  
  Direction : 'W',
  Past_Direction : 'W',
  Controled_Direction : 'W',

 updateIntPosition() {
    this.Int_x = Math.round(this.Float_x);
    this.Int_y = Math.round(this.Float_y);
  },
  
  Reset()
  {
      this.Speed = 0.25;
      this.Int_x = this.Start_x;
      this.Int_y = this.Start_y;
      this.Float_x = this.Start_x;
      this.Float_y = this.Start_y;
      this.Floor_Tile = 0;
      this.Direction = 'W';
      this.Past_Direction = 'W';
      this.Controled_Direction = 'W';
      setPositionByGrid(PACMAN, this.Float_x, this.Float_y);
  },
  
  Get_Control() {
    this.Speed = 0.25;
    const key = window.lastKey; // 전역 변수나 이벤트 핸들러에서 마지막 키 입력을 저장
    console.log('Get_Control - Current key:', key);
    if (key) {
      switch(key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.Controled_Direction = 'W';
          break;
        case 's':
        case 'arrowdown':
          this.Controled_Direction = 'S';
          break;
        case 'a':
        case 'arrowleft':
          this.Controled_Direction = 'A';
          break;
        case 'd':
        case 'arrowright':
          this.Controled_Direction = 'D';
          break;
      }
      console.log('Get_Control - New direction:', this.Controled_Direction);
    }
  },
  Set_Control()
  {
    let nextX = this.Int_x;
    let nextY = this.Int_y;
    console.log('Set_Control - Current position:', {x: this.Int_x, y: this.Int_y});
    switch (this.Controled_Direction) {
      case 'W': nextY = Math.floor(this.Float_y - this.Speed); break;
      case 'S': nextY = Math.ceil(this.Float_y + this.Speed); break;
      case 'A': nextX = Math.floor(this.Float_x - this.Speed); break;
      case 'D': nextX = Math.ceil(this.Float_x + this.Speed); break;
    }
    console.log('Set_Control - Next position:', {x: nextX, y: nextY});
    if (BackGround_Map[nextY][nextX] != 1) {
      this.Direction = this.Controled_Direction;
      console.log('Set_Control - Direction changed to:', this.Direction);
    }
  },
  
  updateFloat() {
    if (this.Direction != this.Past_Direction) {
      switch (this.Direction) {
        case 'W':
        case 'S':
          if (this.Past_Direction === 'A') { this.Speed += this.Int_x - this.Float_x; }
          else if (this.Past_Direction === 'D') { this.Speed += this.Float_x - this.Int_x; }
          this.Float_x = this.Int_x;
          break;
  
        case 'A':
        case 'D':
          if (this.Past_Direction === 'W') { this.Speed += this.Int_y - this.Float_y; }
          else if (this.Past_Direction === 'S') { this.Speed += this.Float_y - this.Int_y; }
          this.Float_y = Math.round(this.Float_y);
          break;
      }
      this.Past_Direction = this.Direction;
    }
  },
  
  Move() {
    let nextX = this.Float_x;
    let nextY = this.Float_y;
    switch (this.Direction) {
      case 'W': nextY = this.Float_y - this.Speed; break;
      case 'S': nextY = this.Float_y + this.Speed; break;
      case 'A': nextX = this.Float_x - this.Speed; break;
      case 'D': nextX = this.Float_x + this.Speed; break;
    }

    // 방향에 따라 올림/내림 적용
    let nextIntX = this.Int_x;
    let nextIntY = this.Int_y;
    switch (this.Direction) {
      case 'W': nextIntY = Math.floor(nextY); break;
      case 'S': nextIntY = Math.ceil(nextY); break;
      case 'A': nextIntX = Math.floor(nextX); break;
      case 'D': nextIntX = Math.ceil(nextX); break;
    }

    if (BackGround_Map[nextIntY][nextIntX] !== 1) {
      this.Float_x = nextX;
      this.Float_y = nextY;
    }
    this.tunnelMove();
    this.updateIntPosition();
  },

  tunnelMove() {
    if (this.Int_y === 15 && this.Int_x === 1 && this.Direction === 'A') {
      this.Int_x = 26;
      this.Float_x = 26;
    } else if (this.Int_y === 15 && this.Int_x === 26 && this.Direction === 'D') {
      this.Int_x = 1;
      this.Float_x = 1;
    }
  },

  Eat() {
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
  },

  update() {
    console.log('Pacman update started');
    this.Get_Control();
    this.Set_Control();
    this.updateFloat();
    this.Move();
    this.Eat();
    setPositionByGrid(PACMAN, this.Float_x, this.Float_y);
    console.log('Pacman update completed - Position:', {x: this.Float_x, y: this.Float_y});
  },
  handleDeath() {
    updateLives(-1);
    this.Reset();
    if (redGhost) redGhost.reset();
    if (pinkGhost) pinkGhost.reset();
    if (blueGhost) blueGhost.reset();
    if (yellowGhost) yellowGhost.reset();
  },
};

// 키 입력을 저장할 전역 변수
window.lastKey = null;

// 이벤트 리스너는 한 번만 등록
window.addEventListener("keydown", (e) => {
  window.lastKey = e.key;
});

class GameObject {
  constructor(x, y, moveMode = 0, direction = 'W') {
    this.x = x;
    this.y = y;
    this.moveMode = moveMode;
    this.direction = direction;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    setPositionByGrid(this.dom, x, y);
  }
}

class Level {
  constructor(map, cookieMap) {
    this.map = map;
    this.cookieMap = cookieMap;
    this.pacman = new GameObject(13, 23, 0, 'W');
    // 유령도 GameObject로 생성
  }
  update() {
    // 팩맨 이동, 쿠키 먹기 등
  }
}

// Ghost Base Class
class Ghost {
  static NomalSpeed = 0.2;
  static HighSpeed = Ghost.NomalSpeed * 2;
  static SlowSpeed = Ghost.NomalSpeed / 2;
  static FrightenedTime = 10 * 60;
  static FrightenedLeft = 0;
  static ChaseTime = 1200;
  static ScatterTime = 4200;
  static DefaultMode = "Scatter";
  static GlobalMode = "Scatter";
  static lastModeChangeFrame = 0;

  constructor(id, start_x, start_y, scatter_target_x, scatter_target_y, domElement) {
    this.ID = id;
    this.Speed = Ghost.NomalSpeed;
    this.Int_x = start_x;
    this.Int_y = start_y;
    this.Float_x = start_x;
    this.Float_y = start_y;
    this.Direction = 'W';
    this.Target_x = start_x;
    this.Target_y = 12;
    this.MoveMode = "Birth";
    this.Start_x = start_x;
    this.Start_y = start_y;
    this.Scatter_Target_x = scatter_target_x;
    this.Scatter_Target_y = scatter_target_y;
    this.Chase_Target_x = 0;
    this.Chase_Target_y = 0;
    this.Can_Update_Direction = false;
    this.Px = start_x;
    this.Py = start_y;
    this.dom = domElement;
  }

  updateIntPosition() {
    this.Int_x = Math.round(this.Float_x);
    this.Int_y = Math.round(this.Float_y);
  }

  reset() {
    this.Speed = Ghost.NomalSpeed;
    this.Int_x = this.Start_x;
    this.Int_y = this.Start_y;
    this.Float_x = this.Start_x;
    this.Float_y = this.Start_y;
    this.Direction = 'W';
    this.MoveMode = "Birth";
    this.Can_Update_Direction = false;
    this.Px = this.Start_x;
    this.Py = this.Start_y;
    setPositionByGrid(this.dom, this.Float_x, this.Float_y);
    console.log(`Ghost ${this.ID} reset to: x=${this.Float_x}, y=${this.Float_y}`);
  }

  updateChaseTarget() {
    this.Chase_Target_x = Pacman.Int_x;
    this.Chase_Target_y = Pacman.Int_y;
  }

  print() {
    if (this.MoveMode === "Frightened") {
        this.dom.src = 'Image/FrightenedGhost.PNG';
    } else if (this.MoveMode === "Death") {
        this.dom.src = 'Image/DeathGhost.PNG';
    } else {
        switch(this.ID) {
            case 2: this.dom.src = 'Image/Red.PNG'; break;
            case 3: this.dom.src = 'Image/Pink.PNG'; break;
            case 4: this.dom.src = 'Image/Blue.PNG'; break;
            case 5: this.dom.src = 'Image/Yellow.PNG'; break;
        }
    }
  }

  updateMoveMode() {
    switch (this.MoveMode) {
      case "Birth":
        if (this.Int_y === this.Target_y) {
          this.MoveMode = Ghost.GlobalMode;
        }
        break;
      case "Frightened":
        if (Ghost.FrightenedLeft <= 0) {
          this.MoveMode = Ghost.GlobalMode;
        }
        break;
      case "Death":
        if (this.Int_x === this.Target_x && this.Int_y === this.Target_y) {
          this.MoveMode = "Birth";
        }
        break;

    }
  }

  moveModeEffect() {
    switch (this.MoveMode) {
      case "Birth":
        this.Speed = Ghost.NomalSpeed;
        this.Target_x = this.Start_x;
        this.Target_y = this.Start_y - 2;
        break;
      case "Chase":
        this.Speed = Ghost.NomalSpeed;
        this.updateChaseTarget();
        this.Target_x = this.Chase_Target_x;
        this.Target_y = this.Chase_Target_y;
        break;
      case "Scatter":
        this.Speed = Ghost.NomalSpeed;
        this.Target_x = this.Scatter_Target_x;
        this.Target_y = this.Scatter_Target_y;
        break;
      case "Frightened":
        this.Speed = Ghost.SlowSpeed;
        break;
      case "Death":
        this.Speed = Ghost.HighSpeed;
        this.Target_x = this.Start_x;
        this.Target_y = this.Start_y;
        break;
    }
  }

  updateDirection() {

    let Check_Set = (this.Px !== this.Int_x || this.Py !== this.Int_y );
    const Set_Done = () => { this.Px = this.Int_x; this.Py = this.Int_y; this.Can_Update_Direction = true; };

    // 3-1. 방향 전환점(3)인 경우에만 진행 // 3-2. 이미 검사한 칸인지 확인
    if (BackGround_Map[this.Int_y][this.Int_x] === 3 && Check_Set ) {
        // 3-3. 이동 축에 따른 위치 정렬
        switch (this.Direction) {
          case 'W':
            if (this.Float_y <= this.Int_y) {
              this.Speed += this.Int_y - this.Float_y;
              this.Float_y = this.Int_y;
              Set_Done();
            }
            break;
          case 'S':
            if (this.Float_y >= this.Int_y) {
              this.Speed += this.Float_y - this.Int_y;
              this.Float_y = this.Int_y;
              Set_Done();
            }
            break;
          case 'A':
            if (this.Float_x <= this.Int_x) {
              this.Speed += this.Int_x - this.Float_x;
              this.Float_x = this.Int_x;
              Set_Done();
            }
            break;
          case 'D':
            if (this.Float_x >= this.Int_x) {
              this.Speed += this.Float_x - this.Int_x;
              this.Float_x = this.Int_x;
              Set_Done();
            }
            break;
          }

      if( this.Can_Update_Direction ){
          this.Can_Update_Direction = false;
          let possibleDirections = [];
          let distances = {};
          const currentTileX = this.Int_x;
          const currentTileY = this.Int_y;
          
          let Next_X;
          let Next_Y;
          
          Next_X = this.Int_x;
          Next_Y = Math.floor(this.Float_y - this.Speed);
          // 각 방향별 거리 계산
          if (this.Direction !== 'S' && BackGround_Map[Next_Y][Next_X] !== 1) {
            possibleDirections.push('W');
            distances['W'] = Fartest(Next_X, Next_Y, this.Target_x, this.Target_y);
          }

          // 아래쪽 방향 체크
          Next_X = this.Int_x;
          Next_Y = Math.ceil(this.Float_y + this.Speed);

          if (this.Direction !== 'W' && BackGround_Map[Next_Y][Next_X] !== 1) {
            if (!((this.Int_x === 13 || this.Int_x === 14) && this.Int_y === 12 && this.MoveMode !== "Death")) {
              possibleDirections.push('S');
              distances['S'] = Fartest(Next_X, Next_Y, this.Target_x, this.Target_y);
            }
          }

          // 왼쪽 방향 체크
          Next_X = Math.floor(this.Float_x - this.Speed);
          Next_Y = this.Int_y;

          if (this.Direction !== 'D' && BackGround_Map[Next_Y][Next_X] !== 1) {
            possibleDirections.push('A');
            distances['A'] = Fartest(Next_X, Next_Y, this.Target_x, this.Target_y);
          }

          // 오른쪽 방향 체크
          Next_X = Math.ceil(this.Float_x + this.Speed);
          Next_Y = this.Int_y;
          
          if (this.Direction !== 'A' && BackGround_Map[Next_Y][Next_X] !== 1) {
            possibleDirections.push('D');
            distances['D'] = Fartest(Next_X, Next_Y, this.Target_x, this.Target_y);
          }
          
          // Frightened 모드일 경우 랜덤 방향 선택
          if (this.MoveMode === "Frightened") {
            this.Direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
          } else  {
            // 거리가 가장 가까운 방향 선택
            let bestDirection = '';
            let minDistance = Infinity;
            for (let dir of possibleDirections) {
              if (distances[dir] < minDistance) {
                minDistance = distances[dir];
                bestDirection = dir;
              }
            }
            this.Direction = bestDirection;
          }
        }
      }
      }
      
      move() {
        let nextX = this.Float_x;
        let nextY = this.Float_y;
        switch (this.Direction) {
          case 'W': nextY -= this.Speed; break;
          case 'S': nextY += this.Speed; break;
      case 'A': nextX -= this.Speed; break;
      case 'D': nextX += this.Speed; break;
    }

    // 터널 이동 처리
    if (this.Int_y === 15) {
      if (this.Int_x <= 1 && this.Direction === 'A') {
        this.Float_x = 26;
        this.Int_x = 26;
        setPositionByGrid(this.dom, this.Float_x, this.Float_y);
        return;
      } else if (this.Int_x >= 26 && this.Direction === 'D') {
        this.Float_x = 1;
        this.Int_x = 1;
        setPositionByGrid(this.dom, this.Float_x, this.Float_y);
        return;
      }
    }

    let potentialNextIntX = this.Int_x;
    let potentialNextIntY = this.Int_y;
    switch (this.Direction) {
      case 'W': potentialNextIntY = Math.floor(nextY); break;
      case 'S': potentialNextIntY = Math.ceil(nextY); break;
      case 'A': potentialNextIntX = Math.floor(nextX); break;
      case 'D': potentialNextIntX = Math.ceil(nextX); break;
    }

    const nextMapTile = BackGround_Map[potentialNextIntY]?.[potentialNextIntX];

    if (nextMapTile !== 1 || ((this.MoveMode === "Death" || this.MoveMode === "Birth") && nextMapTile === 2)) {
      this.Float_x = nextX;
      this.Float_y = nextY;
    } else {
        this.Float_x = this.Int_x;
        this.Float_y = this.Int_y;
    }

    this.updateIntPosition();
    setPositionByGrid(this.dom, this.Float_x, this.Float_y);
    console.log(`Ghost ${this.ID} moving to: x=${this.Float_x}, y=${this.Float_y}, Mode: ${this.MoveMode}`);
  }

  updateBehavior() {
    this.updateMoveMode();
    this.moveModeEffect();
    this.updateDirection();
    this.move();
    this.print();
    
    // 디버그 정보 출력
    console.log(`Ghost ${this.ID} 상태:`, {
      위치: `(${this.Float_x.toFixed(2)}, ${this.Float_y.toFixed(2)})`,
      정수위치: `(${this.Int_x}, ${this.Int_y})`,
      모드: this.MoveMode,
      방향: this.Direction,
      속도: this.Speed,
      목표: `(${this.Target_x}, ${this.Target_y})`,
      추적목표: `(${this.Chase_Target_x}, ${this.Chase_Target_y})`,
      Scatter목표: `(${this.Scatter_Target_x}, ${this.Scatter_Target_y})`
    });
  }

  static updateGlobalModes(gameFrameCount) {
    // 1초 = 60프레임
    const seconds = Math.floor(gameFrameCount / 60);
    
    // 7초 동안 Scatter 모드
    if (seconds < 7) {
        this.GlobalMode = "Scatter";
    }
    // 20초 동안 Chase 모드
    else if (seconds < 27) {
        this.GlobalMode = "Chase";
    }
    // 7초 동안 Scatter 모드
    else if (seconds < 34) {
        this.GlobalMode = "Scatter";
    }
    // 20초 동안 Chase 모드
    else if (seconds < 54) {
        this.GlobalMode = "Chase";
    }
    // 5초 동안 Scatter 모드
    else if (seconds < 59) {
        this.GlobalMode = "Scatter";
    }
    // 20초 동안 Chase 모드
    else if (seconds < 79) {
        this.GlobalMode = "Chase";
    }
    // 5초 동안 Scatter 모드
    else if (seconds < 84) {
        this.GlobalMode = "Scatter";
    }
    // 그 이후는 계속 Chase 모드
    else {
        this.GlobalMode = "Chase";
    }
  }
}

class RedGhost extends Ghost {
  constructor() {
    super(2, 14, 14, 27, -2, RED);
  }

  updateChaseTarget() {
    this.Chase_Target_x = Pacman.Int_x;
    this.Chase_Target_y = Pacman.Int_y;
  }
}

class PinkGhost extends Ghost {
  constructor() {
    super(3, 13, 14, 2, -2, PINK);
  }

  updateChaseTarget() {
    let targetX = Pacman.Int_x;
    let targetY = Pacman.Int_y;

    switch (Pacman.Direction) {
      case 'W': targetY -= 2; break;
      case 'S': targetY += 2; break;
      case 'A': targetX -= 2; break;
      case 'D': targetX += 2; break;
    }
    this.Chase_Target_x = targetX;
    this.Chase_Target_y = targetY;
  }
}

class BlueGhost extends Ghost {
  constructor() {
    super(4, 11, 15, 27, 32, BLUE);
  }

  updateChaseTarget() {
    // 분홍색 유령의 목표 위치 계산
    pinkGhost.updateChaseTarget();
    
    // 빨간색 유령의 위치를 기준으로 대칭점 계산
    this.Chase_Target_x = 27 - (redGhost.Int_x - pinkGhost.Chase_Target_x);
    this.Chase_Target_y = redGhost.Int_y - (pinkGhost.Chase_Target_y - redGhost.Int_y);
  }
}

class YellowGhost extends Ghost {
  constructor() {
    super(5, 16, 15, 0, 32, YELLOW);
  }

  updateChaseTarget() {
    const distanceToPacman = Math.sqrt(
      Math.pow(this.Float_x - Pacman.Float_x, 2) + Math.pow(this.Float_y - Pacman.Float_y, 2)
    );

    if (distanceToPacman >= 8) { // 64f를 8로 변환 (맵 크기 차이 고려)
      // 팩맨이 멀리 있을 때는 빨간색 유령과 동일한 목표를 추적
      this.Chase_Target_x = redGhost.Chase_Target_x;
      this.Chase_Target_y = redGhost.Chase_Target_y;
    } else {
      // 팩맨이 가까이 있을 때는 자신의 위치를 기준으로 대칭점 계산
      this.Chase_Target_x = 27 - (redGhost.Chase_Target_x - this.Int_x);
      this.Chase_Target_y = redGhost.Chase_Target_y - (this.Int_y - redGhost.Chase_Target_y);
    }
  }
}

// ... existing GameObject and Level classes ...

function initGame() {
  createCookies();
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

  updateScore(0);
  updateLives(3);
}
