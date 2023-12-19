 //落下サイクル(小さい方が速い)
const speed = 300;
// ブロック1マスの大きさ
const blockSize = 30;
// ボードサイズ(縦横数指定)
const boardRow = 20;
const boardCol = 10;
// キャンバスの取得
const cvs = document.getElementById("cvs");
// コンテキスト取得
const ctx = cvs.getContext("2d");
// キャンバスサイズ
const canvasW = blockSize * boardCol;
const canvasH = blockSize * boardRow;
cvs.width = canvasW;
cvs.height = canvasH;
// コンテナの設定
const container = document.getElementById("container");
container.style.width = canvasW + 'px';


//tetの1辺の大きさ
const tetSize = 4;
//テトリミノの種類
const tetTypes = [
    [], //最初の要素を空としておく
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ];

   //テトリミノの色
   const tetColors = [
    '',//これが選択されることはない
    '#f6fe85',
    '#07e0e7',
    '#7ced77',
    '#f78ff0',
    '#f94246',
    '#9693fe',
    '#f2b907',
  ];
  //テトリミノのindex
  let tet_idx;
   //選択されたtet
   let tet;

//テトリミノのオフセット量(何マス分ずれているか)
let offsetX = 0;
let offsetY = 0;

//ボード本体
const board = [];


//タイマーID
let timerId = NaN;

 //ゲームオーバーフラグ
let isGameOver = false;


// 描画処理
const draw = () => {
    // 塗り色を黒に設定
    ctx.fillStyle = '#000';
    // キャンバスを塗りつぶす
    ctx.fillRect(0, 0, canvasW, canvasH);


    //ボードに存在しているブロックを塗る
    for (let y = 0; y < boardRow; y++) {
        for (let x = 0; x < boardCol; x++) {
            if (board[y][x]) {
                drawBlock(x, y, board[y][x]);
            }
        }
    }

    //テトリミノの描画
    for (let y = 0; y < tetSize; y++) {
        for (let x = 0; x < tetSize; x++) {
            //もし、1だったら 0=false それ以外=true
            if (tet[y][x]) {
                //四角を描画
                drawBlock(offsetX + x, offsetY + y, tet_idx);
            }
        }
    }

    if (isGameOver) {
    const s = 'GAME OVER';
    ctx.font = "40px 'MS ゴシック'";
    const w = ctx.measureText(s).width;
    const x = canvasW / 2 - w / 2;
    const y = canvasH / 2 - 20;
    ctx.fillStyle = 'white';
    ctx.fillText(s,x,y);
    }
};



// ブロックを１つ描画する
const drawBlock = (x, y,tet_idx) => {
    let px = x * blockSize;
    let py = y * blockSize;
    // 塗りを設定
    ctx.fillStyle = tetColors[tet_idx];
    ctx.fillRect(px, py, blockSize, blockSize);
    //線を設定
    ctx.strokeStyle = 'black';
    //線を描画
    ctx.strokeRect(px, py, blockSize, blockSize);
};


//指定された方向に移動できるか？(x移動量,y移動量)
const canMove = (dx, dy , nowTet = tet) => {
    for (let y = 0; y < tetSize; y++) {
        for (let x = 0; x < tetSize; x++) {
            //その場所にブロックがあれば (1なら)
            if (nowTet[y][x]) {
                //ボード座標に変換
                let nx = offsetX + x + dx;
                let ny = offsetY + y + dy;
                if (
                    //調査する座標がボード外だったらできない
                    ny < 0 ||
                    nx < 0 ||
                    ny >= boardRow ||
                    nx >= boardCol ||
                    //移動したいボード上の場所にすでに存在してたらできない
                    board[ny][nx]
                ) {
                    return false;
                }
            }
        }
    }
    // 移動できる
    return true;
};

//回転
const createRotateTet = () => {
    //新しいtetを作る
    let newTet = [];
    for (let y = 0; y < tetSize; y++) {
        newTet[y] = [];
        for (let x = 0; x < tetSize; x++) {
            //時計回りに90度回転させる
            newTet[y][x] = tet[tetSize - 1 - x][y];
        }
        console.log("newTet[${y}")
    }
    return newTet;
}


document.onkeydown = (e) => {
    if (isGameOver) return;
    switch (e.keyCode) {
        case 37: //左
            if (canMove(-1, 0)) offsetX--;
            break;
        case 38: //上
            if (canMove(0, -1)) offsetY--;
            break;
        case 39: //右
            if (canMove(1, 0)) offsetX++;
            break;
        case 40: //下
            if (canMove(0, 1)) offsetY++;
            break;
        case 32: //space
           let newTet = createRotateTet();
           if(canMove(0, 0, newTet)) {
            tet = newTet;
           }
    }
    draw();
};


//動きが止まったtetをボード座標に書き写す
const fixTet = () => {
    for (let y = 0; y < tetSize; y++) {
      for (let x = 0; x < tetSize; x++) {
        if (tet[y][x]) {
          //ボードに書き込む
          board[offsetY + y][offsetX + x] = tet_idx;
        }
      }
    }
  };


const clearLine = () => {
    //ボードの行を上から調査
    for (let y = 0; y < boardRow; y++) {
        //一列揃ってると仮定する
        let isLineOK = true;
        //列に0が入っていないか調査
        for (let x = 0; x < boardCol; x++) {
            if (board[y][x] === 0) {
                //0が入ってたのでフラグをfalseF
                isLineOK = false;
                break;
            }
        }
        if (isLineOK) {//ここに来るということはその列が揃っていたことを意味する
            //その行から上に向かってfor文を動かす
            for (let ny = y; ny > 0 ; ny--) {
                for (let nx = 0; nx < boardCol; nx++) {
                    //一列上の情報をコピーする
                    board[ny][nx] = board[ny - 1][nx];
                }
            }
        }
    }
}


// 繰り返し行われる落下処理
const dropTet = () => {
    if(isGameOver) return;
    //下に行けたら
    if (canMove(0, 1)) {
        // 下に行く
        offsetY++;
    } else {
        // 行けなかったら固定する  
        fixTet();
        //揃ったラインがあったら消す
        clearLine();
        //抽選
        tet_idx = randomIdx();
        tet = tetTypes[tet_idx]
        // 初期位置に戻す
        initStarePos();
        if(!canMove(0, 0)) {
            isGameOver = true;
            clearInterval(timerId);
        }
    }
    draw();
}


// テトリミノの出現位置
const initStarePos = () => {
    offsetX = boardCol / 2 - tetSize / 2
    offsetY = 0;
};

//テトリミノのindexを抽選
const randomIdx = () => {
    return Math.floor(Math.random() * (tetTypes.length - 1)) + 1;
}


// 初期化処理
const init = () => {
    for (let y = 0; y < boardRow; y++) {
        board[y] = [];
        for (let x = 0; x < boardCol; x++) {
            board[y][x] = 0;
        }
    }

    //最初のテトリミノを抽選
    tet_idx = randomIdx();
    tet = tetTypes[tet_idx];


    initStarePos();
    // 繰り返し処理
    timerId=setInterval(dropTet,speed);

    draw();
};

