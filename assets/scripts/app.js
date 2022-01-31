const monsterHealthBar = document.getElementById("monster-health");
const playerHealthBar = document.getElementById("player-health");
const bonusLifeEl = document.getElementById("bonus-life");

const attackBtn = document.getElementById("attack-btn");
const strongAttackBtn = document.getElementById("strong-attack-btn");
const healBtn = document.getElementById("heal-btn");
const logBtn = document.getElementById("log-btn");


const HEALTH_DEFAULT = 100;
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 30;
const STRONG_ATTACK_VALUE = 25;
const HEAL_VALUE = 20;
const BONUS_LIVES = 2;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let chosenMaxLife;

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let maxDamage;
let bonusLives = BONUS_LIVES;
let battleLog = [];

bonusLifeEl.innerText = bonusLives;

function getMaxLifeValues() {
    const enteredValue = prompt("Maximum life for you and monster", "100");
    const parsedValue = parseInt(enteredValue);

    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw {message: "Invalid user input"};
    }

    return parsedValue;
}

try {
    chosenMaxLife = getMaxLifeValues();
} catch(error) {
    console.log(error);
    alert(`Error:: ${error.message} 'Max Life will be set to 100 by default.`);
    chosenMaxLife = 100;
}

function adjustHealthBars(maxLife) {
    monsterHealthBar.max = maxLife;
    monsterHealthBar.value = maxLife;
    playerHealthBar.max = maxLife;
    playerHealthBar.value = maxLife;
}

adjustHealthBars(chosenMaxLife);

function dealMonsterDamage(damage) {
    const dealtDamage = Math.random() * damage;
    monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
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

function endRound() {
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if (currentPlayerHealth <= 0 && bonusLives > 0) {
        bonusLives -= 1;
        bonusLifeEl.innerText = bonusLives;
        currentPlayerHealth = chosenMaxLife;
        increasePlayerHealth(currentPlayerHealth);
        alert(`You have ${bonusLives} lives left.`);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("Monster is dead");
        writeToLog(LOG_EVENT_GAME_OVER, "PLAYER WIN", currentMonsterHealth, currentPlayerHealth);
        reset();
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("You are dead");
        writeToLog(LOG_EVENT_GAME_OVER, "MONSTER WIN", currentMonsterHealth, currentPlayerHealth);
        reset();
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("Draw");
        writeToLog(LOG_EVENT_GAME_OVER, "DRAW", currentMonsterHealth, currentPlayerHealth);
        reset();
    }
}

function attackMonster(mode) {
    let logEvent;
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function writeToLog(event, value, currentMonsterHealth, currentPlayerHealth) {
    let logEntry;
    logEntry = {
        event,
        value,
        currentMonsterHealth,
        currentPlayerHealth,
    };
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    bonusLifeEl.innerText = BONUS_LIVES;
    resetGame(chosenMaxLife);
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

    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function logHandler() {
    // For
    // console.log(battleLog);
    // for (let i = 0; i < battleLog.length; i++) {
    //     const element = battleLog[i];
    //     console.log(element);
    // }
    // While
    // let j = 0;
    // while (j < 3) {
    //     j++;
    //     console.log(j);
    // }
    // Do While
    // let l = 0;
    // do {
    //     console.log(l);
    //     l++;
    // } while (l < 10);
    // Recursion
    // let k = 0;
    // function iterateLog() {
    //     k = k+1;
    //     console.log(k);
    //     k < 3 && iterateLog();
    // }
    // iterateLog();

    for (const logEntry of battleLog) {
        for (const key in logEntry) {
            const element = logEntry[key];
            console.log(`${key} ${element}`);
        }
    }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", logHandler);
