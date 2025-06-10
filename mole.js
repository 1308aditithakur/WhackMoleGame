let currMoleTile, currPlantTile, currBombTile, currPowerTile;
let score = 0, gameOver = false, timeLeft = 30;
let highScore = localStorage.getItem("highScore") || 0;
let selectedCharacter = "mario";
let doublePoints = false;
let moleInterval, plantInterval, difficultyInterval;
let moleSpeed = 1000, plantSpeed = 2000;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("highScore").innerText = "High Score: " + highScore;
});

window.onload = function () {
    const savedCharacter = localStorage.getItem("character");
    if (savedCharacter) selectCharacter(savedCharacter);
    setGame();
    startTimer();
};

function selectCharacter(character) {
    selectedCharacter = character;
    document.body.className = character;
    localStorage.setItem("character", character);
    document.getElementById("characterSelect").style.display = "none";
    document.getElementById("bgMusic").src = `${character}-theme.mp3`;
    document.getElementById("bgMusic").play();
}

function setGame() {
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    moleInterval = setInterval(setMole, moleSpeed);
    plantInterval = setInterval(setPlant, plantSpeed);
    setInterval(setPowerUp, 7000);
    setInterval(setBomb, 10000);
    difficultyInterval = setInterval(increaseDifficulty, 10000);
}

function increaseDifficulty() {
    if (moleSpeed > 300) moleSpeed -= 100;
    if (plantSpeed > 800) plantSpeed -= 200;
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    moleInterval = setInterval(setMole, moleSpeed);
    plantInterval = setInterval(setPlant, plantSpeed);
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function setMole() {
    if (gameOver) return;
    if (currMoleTile) currMoleTile.innerHTML = "";

    const mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if (currPlantTile?.id === num || currBombTile?.id === num || currPowerTile?.id === num) return;

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) return;
    if (currPlantTile) currPlantTile.innerHTML = "";

    const plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if (currMoleTile?.id === num || currBombTile?.id === num || currPowerTile?.id === num) return;

    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function setBomb() {
    if (gameOver) return;
    if (currBombTile) currBombTile.innerHTML = "";

    const bomb = document.createElement("img");
    bomb.src = "bomb.png";

    let num = getRandomTile();
    if ([currMoleTile?.id, currPlantTile?.id, currPowerTile?.id].includes(num)) return;

    currBombTile = document.getElementById(num);
    currBombTile.appendChild(bomb);
}

function setPowerUp() {
    if (gameOver) return;
    if (currPowerTile) currPowerTile.innerHTML = "";

    const power = document.createElement("img");
    power.src = "star.png";

    let num = getRandomTile();
    if ([currMoleTile?.id, currPlantTile?.id, currBombTile?.id].includes(num)) return;

    currPowerTile = document.getElementById(num);
    currPowerTile.appendChild(power);
}

function activatePowerUp() {
    const power = Math.floor(Math.random() * 3);
    if (power === 0) {
        doublePoints = true;
        setTimeout(() => doublePoints = false, 5000);
    } else if (power === 1) {
        clearInterval(plantInterval);
        setTimeout(() => {
            plantInterval = setInterval(setPlant, plantSpeed);
        }, 5000);
    } else if (power === 2) {
        document.getElementById("lives").innerText += "❤️";
    }
    showScoreBubble({ pageX: window.innerWidth / 2, pageY: 100 }, "POWER!", "gold");
}

function selectTile(event) {
    if (gameOver) return;
    document.body.classList.add("hammer-hit");
    setTimeout(() => document.body.classList.remove("hammer-hit"), 150);

    if (this === currMoleTile) {
        let points = doublePoints ? 20 : 10;
        score += points;
        document.getElementById("score").innerText = score.toString();
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = "High Score: " + highScore;
        }
        showScoreBubble(event, `+${points}`, "white");
    } else if (this === currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score;
        gameOver = true;
    } else if (this === currBombTile) {
        score = Math.max(0, score - 20);
        document.getElementById("score").innerText = score;
        showScoreBubble(event, "-20", "red");
        currBombTile.innerHTML = "";
    } else if (this === currPowerTile) {
        activatePowerUp();
        currPowerTile.innerHTML = "";
    }
}

function restartGame() {
    location.reload();
}

function startTimer() {
    const timer = setInterval(() => {
        if (gameOver || timeLeft <= 0) {
            clearInterval(timer);
            if (!gameOver) {
                gameOver = true;
                document.getElementById("score").innerText = "TIME'S UP: " + score;
            }
        }
        document.getElementById("timer").innerText = timeLeft;
        timeLeft--;
    }, 1000);
}

function showScoreBubble(event, text = "+10", color = "white") {
    const bubble = document.createElement("div");
    bubble.className = `score-bubble ${selectedCharacter}`;
    bubble.innerText = text;
    bubble.style.left = event.pageX + "px";
    bubble.style.top = event.pageY + "px";
    bubble.style.color = color;
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1000);
}
