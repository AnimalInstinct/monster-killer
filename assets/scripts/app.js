const monsterHealthBar = document.getElementById("monster-health");
const playerHealthBar = document.getElementById("player-health");
const bonusLifeEl = document.getElementById("bonus-life");

const attackBtn = document.getElementById("attack-btn");
const strongAttackBtn = document.getElementById("strong-attack-btn");
const healBtn = document.getElementById("heal-btn");
const logBtn = document.getElementById("log-btn");

function adjustHealthBars(maxLife) {
    monsterHealthBar.max = maxLife;
    monsterHealthBar.value = maxLife;
    playerHealthBar.max = maxLife;
    playerHealthBar.value = maxLife;
}

function dealMonsterDamage(damage) {
    const dealtDamage = Math.random() * damage;
    monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
    console.log("Monster hitted by ", dealtDamage);
    return dealtDamage;
}

function dealPlayerDamage(damage) {
    const dealtDamage = Math.random() * damage;
    playerHealthBar.value = +playerHealthBar.value - dealtDamage;
    return dealtDamage;
}

function increasePlayerHealth(healValue) {
    playerHealthBar.value = +playerHealthBar.value + healValue;
}

function resetGame(value) {
    playerHealthBar.value = value;
    monsterHealthBar.value = value;
}

function setPlayerHealth(health) {
    playerHealthBar.value = health;
}

const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 30;
const STRONG_ATTACK_VALUE = 30;
const HEAL_VALUE = 30;
const BONUS_LIVES = 2;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = parseInt(
    prompt("Maximum life for you and the monster", "100")
);

let chosenMaxLife = parseInt(enteredValue);

if (isNaN(enteredValue) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
    alert("Wrong max life value entered. Max life will be 100 by default.");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let maxDamage;
let bonusLives = BONUS_LIVES;
let battleLog = [];

bonusLifeEl.innerText = bonusLives;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value) {
    let logEntry;
    logEntry = {
        event,
        value,
        currentMonsterHealth,
        currentPlayerHealth
    };
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    bonusLifeEl.innerText = BONUS_LIVES;
    resetGame(chosenMaxLife);
}

function endRound() {
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage);

    if (currentPlayerHealth <= 0 && bonusLives > 0) {
        bonusLives -= 1;
        bonusLifeEl.innerText = bonusLives;
        currentPlayerHealth = chosenMaxLife;
        increasePlayerHealth(currentPlayerHealth);
        alert(`You have ${bonusLives} lives left.`);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("Monster is dead");
        reset();
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("You are dead");
        reset();
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("Draw");
        reset();
    }
}

function attackMonster(mode) {
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(LOG_EVENT_PLAYER_ATTACK, damage);
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;

    if (currentPlayerHealth >= chosenMaxLife - healValue) {
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }

    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;

    endRound();
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
