const icons = ["bars","bugs", "bowling-ball", "coffee", "couch", "football-ball", "gem", "laptop"]
const btnStart = document.querySelector('.btnStart');
const gameOverEle = document.getElementById('gameOverElement');
const container = document.getElementById('container');
const box = document.querySelector('.box');
const base = document.querySelector('.base');
const scoreDash = document.querySelector('.scoreDash');
const progressbar = document.querySelector('.progress-bar');
const boxCenter = [box.offsetLeft + (box.offsetWidth/2), box.offsetTop + (box.offsetHeight/2)];
let gamePlay = false;
let player;
let animateGame;

btnStart.addEventListener('click', startGame);
container.addEventListener('mousedown', mouseDown);
container.addEventListener('mousemove', mousePosition);

function updateDash(){
    scoreDash.innerHTML = player.score;
    let tempPercent = (player.lives/player.barwidth)*100+'%'
    progressbar.style.width = tempPercent;
}

function mousePosition(e){
    let mouseAngle = getDeg(e);
    box.style.transform = 'rotate(' + mouseAngle + 'deg)';
    box.style.webkitTransform = 'rotate(' + mouseAngle + 'deg)';
    box.style.mozTransform = 'rotate(' + mouseAngle + 'deg)';
    box.style.msTransform = 'rotate(' + mouseAngle + 'deg)';
    box.style.oTransform = 'rotate(' + mouseAngle + 'deg)';

}

function isCollide(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
        )
}

function getDeg(e){
        let angle = Math.atan2(e.clientX - boxCenter[0], -(e.clientY - boxCenter[1]));
        return angle * (180 / Math.PI)
}

function degRad(deg){
    return deg*(Math.PI/180);

}

function mouseDown(e){
    if(gamePlay){
        moveShots();
        //  Update dashboards
        // Move enemy
        //animateGame = requestAnimationFrame(playGame);
        let div = document.createElement('div');
        let mouseAngle = getDeg(e);
        div.setAttribute('class','fire');
        div.moverx = 5 * Math.sin(degRad(mouseAngle));
        div.movery = -5 * Math.cos(degRad(mouseAngle));
        div.style.left = (boxCenter[0] - 5) + 'px';
        div.style.top = (boxCenter[1] - 5) + 'px';
        div.style.width = 10 + 'px';
        div.style.height = 10 + 'px';
        container.appendChild(div);
    }
}

function startGame(){
    gamePlay = true;
    gameOverElement.style.display = 'none'
    player = {
        score:0,
        barwidth: 100,
        lives: 100
    }
    setupEnemies(10);
    animateGame = requestAnimationFrame(playGame);
}

function setupEnemies(num) {

    for(let i=0;i<num;i++){
        generateEnemy();
    }
}

function returnIcon(num){
    return Math.floor(Math.random()*num)
}

function moveEnemy(){
    let tempEnemies = document.querySelectorAll('.enemy');
    let hitter = false;
    let tempShots = document.querySelectorAll('.fire');
    for(enemy of tempEnemies){
        if (enemy.offsetTop > 550 || enemy.offsetTop < 0 || enemy.offsetLeft > 750 || enemy.offsetLeft < 0) {
            enemy.parentNode.removeChild(enemy);
            generateEnemy();
        }
        else {
            enemy.style.top = enemy.offsetTop + enemy.movery + 'px';
            enemy.style.left = enemy.offsetLeft + enemy.moverx + 'px';
            for(let shot of tempShots){
                if(isCollide(shot,enemy) && gamePlay){
                    player.lives += 10;
                    if(player.lives>100){
                        player.lives = 100;
                    }
                    player.score += enemy.points;
                    enemy.parentNode.removeChild(enemy);
                    shot.parentNode.removeChild(shot);
                    updateDash();
                    generateEnemy();
                    break;
                }
            }
        }
        if(isCollide(box,enemy)){
            hitter = true;
            player.lives--;
            if(player.lives<0){gameOver()};
        }
    }
    if(hitter){
        base.style.backgroundColor = 'red';
        hitter = false;
    }else{
        base.style.backgroundColor = '';
    }

}

function gameOver(){
    cancelAnimationFrame(animateGame);
    gameOverEle.style.display = 'block';
    gameOverEle.querySelector('span').innerHTML = 'GAME OVER<br>Score '+player.score;
    gamePlay = false;
    let tempEnemy = document.querySelectorAll('.enemy');
    for(let enemy of tempEnemy){
        enemy.parentNode.removeChild(enemy);
    }
    let tempShots = document.querySelectorAll('.fire');
    for(let shot of tempShots){
        shot.parentNode.removeChild(shot);
    }
}

function generateEnemy(){
    let div = document.createElement('div');
    let randomIcon = 'fa-'+icons[returnIcon(icons.length)];
    let x,y,xmove,ymove;
    let randomPos = returnIcon(4);
    let dirSet = returnIcon(5)+2;
    let dirPos = returnIcon(7)-3;
    switch(randomPos){
        case 0:
            x = 0;
            y = returnIcon(600);
            ymove = dirPos;
            xmove = dirSet;
            break;
        case 1:
            x = 800;
            y = returnIcon(600);
            ymove = dirPos;
            xmove = dirSet*-1;
            break;
        case 2:
            x = returnIcon(800);
            y = 0;
            ymove = dirSet;
            xmove = dirPos;
            break;
        case 3:
            x = returnIcon(800);
            y = 600;
            ymove = dirSet*-1;
            xmove = dirPos;
            break;
    }
    div.style.color = randomColor();
    div.innerHTML = '<i class="fas '+randomIcon+'"></i>';
    div.setAttribute('class', 'enemy');
    div.style.fontSize = returnIcon(20)+30+'px';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.points = returnIcon(5)+1;
    div.moverx = xmove;
    div.movery = ymove;
    container.appendChild(div);
}

function randomColor(){
    function c(){
        let hex = returnIcon(256).toString(16);
        return ('0'+String(hex)).substr(-2);
    }
    return '#'+c()+c()+c()
}

function moveShots() {
    let tempShots = document.querySelectorAll('.fire');
    for(let shot of tempShots){
        if(shot.offsetTop>600 || shot.offsetTop <0 || shot.offsetLeft >800 || shot.offsetLeft <0){
            shot.parentNode.removeChild(shot)
        }else{
        shot.style.top = shot.offsetTop + shot.movery + 'px';
        shot.style.left = shot.offsetLeft + shot.moverx + 'px';
    }
    }
}

function playGame(){
    if (gamePlay){
        moveShots();
        updateDash();
        moveEnemy();
        animateGame = requestAnimationFrame(playGame);
    }
}
