//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height = 700;
document.body.appendChild(canvas);

let spaceImage,spaceshipImage,bulletImage,monstorImage,gameoverImage;
let gameOver=false // true이면 게임이 끝남, false 이면 게임이 안끝남
let score=0;
//우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

//총알 좌표
let bulletList =[] //총알들을 저장하는 리스트
function Bullet(){
    this.x=0;
    this.y=0;

    //우주선 좌표에 맞춘 총알 좌표
    this.init=function (){
        this.x=spaceshipX+24;
        this.y=spaceshipY-12;

        this.alive=true //true면 살아있는 총알 false면 죽은 총알 총알상태표시
        bulletList.push(this);
    };
    this.update = function(){
        this.y -=7;
    }

    this.checkHit=function(){
        for(let i = 0; i< monstorList.length; i++){
        if(this.y<=monstorList[i].y && this.x>=monstorList[i].x && this.x<=monstorList[i].x+40){
            score++;
            this.alive = false; // 죽은 총알

            monstorList.splice(i,1);
        }
    }
    };
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let monstorList = []
function Monstor(){
    this.x=0;
    this.y=0;
    this.init = function(){
        this.y=0
        this.x=generateRandomValue(0,canvas.width-48)
        monstorList.push(this)
    }
    this.update=function(){
        this.y+=2; // 적군의 속도 조절

        if(this.y>=canvas.height-48){
            gameOver=true;
            console.log("gameover")
        }
    }
}

function loadImage() {
    spaceImage=new Image();
    spaceImage.src="images/space.jpg"

    spaceshipImage=new Image();
    spaceshipImage.src="images/spaceship.png"

    bulletImage=new Image();
    bulletImage.src="images/bullet.png"

    monstorImage=new Image();
    monstorImage.src="images/monstor.png"

    gameoverImage=new Image();
    gameoverImage.src="images/gameover.jpg"
}


//그려주는 작업 보여주는건 무조건 여기서 하기
function render(){
    ctx.drawImage(spaceImage,0,0, canvas.width,canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);

    ctx.fillText(`Score:${score}`,20,20);
    ctx.fillStyle="White";
    ctx.font = "20px Arial";
    
    for(let i=0;i< bulletList.length;i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage,bulletList[i].x, bulletList[i].y);
    }
    // ctx.drawImage(bulletImage,canvas.width/2-47.5,canvas.height-100);
    }
    for(let i=0;i<monstorList.length;i++){
        ctx.drawImage(monstorImage,monstorList[i].x, monstorList[i].y);
    }
}

let keysDown={};
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode]=true;
    });

    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];
    

    if(event.keyCode == 32){
        createBullet(); //총알 생성
    }
});
}

function createBullet(){
    let b = new Bullet(); //총알 하나 생성
    b.init();
    //console.log("새로운 총알 리스트",bulletList)
}

function createMonstor(){
    const interval = setInterval(function(){
        let e = new Monstor()
        //e 적군을 새로 만들어주겠다.
        e.init()
        //e를 초기화해주겟다
    },1000)
    //ms가 단위 1초는 1000
}

function update(){
    if(39 in keysDown)//right
    {spaceshipX +=3;}

    if(37 in keysDown)//right
    {spaceshipX -=3;}

    if(spaceshipX<=0){
        spaceshipX=0
    }

    if(spaceshipX>=canvas.width-64){
    spaceshipX=canvas.width-64}

    //총알의 y좌표 업데이트
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
        //이걸 넣어줘야 죽은 총알이 생성됨 이걸 넣지 않으면 살아있는 총알로 뒤에것도 자동 사라짐.
        bulletList[i].update();
        bulletList[i].checkHit();
    }
}

    //몬스터의 y좌표 업데이트
    for(let i=0;i<monstorList.length;i++){
        monstorList[i].update();
    }
}


function main(){
    if(!gameOver){
    update(); //좌표값을 업데이트하고
    render(); //그려주고
    requestAnimationFrame(main);
    //애니메이션처럼 여러번 호출해줌
    }else{
        ctx.drawImage(gameoverImage,10,100,380,380)
    }

}

loadImage();
setupKeyboardListener();
createMonstor();
main();

//캔버스는 계속 보여줘야함