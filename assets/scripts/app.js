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

function removeBonusLife() {
    bonusLifeEl.parentNode.removeChild(bonusLifeEl);
}

function setPlayerHealth(health) {
    playerHealthBar.value = health;
}

const ATTACK_VALUE = 5;
const MONSTER_ATTACK_VALUE = 50;
const STRONG_ATTACK_VALUE = 30;
const HEAL_VALUE = 10;
const BONUS_LIVES = 3;

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let maxDamage;
let bonusLives = BONUS_LIVES;

bonusLifeEl.innerText = bonusLives;


adjustHealthBars(chosenMaxLife);

function endRound() {
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;


    if (currentPlayerHealth <=0 && bonusLives > 0) {
        bonusLives -= 1;
        bonusLifeEl.innerText = bonusLives;
        currentPlayerHealth = chosenMaxLife;
        increasePlayerHealth(currentPlayerHealth);
        alert(`You have ${bonusLives} lives left.`);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("Monster is dead");
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("You are dead");
    } else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("Draw");
    }
}

function attackMonster(mode) {

    if (mode === "ATTACK") {
        maxDamage = ATTACK_VALUE;
    } else {
        maxDamage = STRONG_ATTACK_VALUE;
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    endRound();
}

function attackHandler() {
    attackMonster("ATTACK");
}

function strongAttackHandler() {
    attackMonster("STRONG_ATTACK");

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

