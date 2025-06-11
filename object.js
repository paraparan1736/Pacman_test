<script src="System.js"></script>

const Pacman = {
  
  Start_x : 13, // 시작 위치 x
  Start_y : 24, // 시작 위치 
  
  Speed,
  
  Int_x,
  Int_y,
  
  Float_x,
  Float_y,
  
  Floor_Tile,
  
  Direction,
  Past_Direction,
  Controled_Direction,

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
  },
  
  Get_Control()
  {
      window.addEventListener
      ("keydown",(e) => 
          {
              switch (e.key)
              {
                  case "ArrowUp":    Controled_Direction = 'W'; break;
                  case "ArrowDown":  Controled_Direction = 'S'; break;
                  case "ArrowLeft":  Controled_Direction = 'A'; break;
                  case "ArrowRight": Controled_Direction = 'D'; break;
              }
          }
      );
  },
  Set_Control()
  {
      switch (Controled_Direction)
      {
          case 'W': {
              const nextY = Math.floor(Float_y - Speed);
              if (BackGround_Map[nextY][Int_x] === 1) break; // 위에 벽이 있으면 이동 X
              Direction = Controled_Direction;
              break;
          }
  
          case 'S': {
              const nextY = Math.ceil(Float_y + Speed);
              if (BackGround_Map[nextY][Int_x] === 1) break;
              Direction = Controled_Direction;
              break;
          }
  
          case 'A': {
              const nextX = Math.floor(Float_x - Speed);
              if (BackGround_Map[Int_y][nextX] === 1) break;
              Direction = Controled_Direction;
              break;
          }
  
          case 'D': {
              const nextX = Math.ceil(Float_x + Speed);
              if (BackGround_Map[Int_y][nextX] === 1) break;
              Direction = Controled_Direction;
              break;
          }
      }
  },
  updateFloat() {
    if (Direction !== Past_Direction) {
      switch (Direction) {
        case 'W':
        case 'S':
          if (Past_Direction === 'A') {
            Speed += Int_x - Float_x;
          } else if (Past_Direction === 'D') {
            Speed += Float_x - Int_x;
          }
          Float_x = Int_x;
          break;
  
        case 'A':
        case 'D':
          if (Past_Direction === 'W') {
            Speed += Int_y - Float_y;
          } else if (Past_Direction === 'S') {
            Speed += Float_y - Int_y;
          }
          Float_y = Int_y;
          break;
      }
      Past_Direction = Direction;
    }
  },
  tunnelMove() {
    let result = false;
    if (Int_y === 15 && Int_x === 1 && Direction === 'A') {
      Int_x = 26;
      Float_x = 26;
      result = true;
    } else if (Int_y === 15 && Int_x === 26 && Direction === 'D') {
      Int_x = 1;
      Float_x = 1;
      result = true;
    }
    return result;
  },
  normalMove() {
    switch (Direction) {
      case 'W':
        if (BackGround_Map[Math.floor(Float_y - Speed)][Int_x] === 1) break;
        Float_y -= Speed;
        break;
  
      case 'S':
        if (BackGround_Map[Math.ceil(Float_y + Speed)][Int_x] === 1) break;
        Float_y += Speed;
        break;
  
      case 'A':
        if (BackGround_Map[Int_y][Math.floor(Float_x - Speed)] === 1) break;
        Float_x -= Speed;
        break;
  
      case 'D':
        if (BackGround_Map[Int_y][Math.ceil(Float_x + Speed)] === 1) break;
        Float_x += Speed;
        break;
    }
  
    updateIntPosition(); // 정수 좌표로 업데이트 (필수)
  },
};
setPositionByGrid(Pacman, Pacman.Float_x, Pacman.Float_y)
