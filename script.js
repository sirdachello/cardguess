"use strict";



let tds = document.querySelectorAll(`td`);
let tableCards = document.querySelectorAll(`.table-card`);
let resetButton = document.getElementById(`resetButton`);


// Animates Cards Reset;
function resetCardState(){
    for (let card of tableCards) {
        if (card.classList.contains(`clicked`)){
            card.classList.remove(`clicked`);
            card.classList.add(`reverting`);
            setTimeout(() => {
                card.classList.remove(`reverting`);
            }, 1100) 
        }
    }
}

function removeExistingGoals(){
    let spans = document.querySelectorAll(`span`);
    for (let span of spans) {
        span.remove();
    }
}

function addGoals(){
    // remove and add eventlisteners to prevent multiple goals from spawning
    resetButton.removeEventListener(`click`, addGoals);
    setTimeout(() => {
        setRandomCards()
        resetButton.addEventListener(`click`, addGoals);
    }, 1100);
}

function resetTimer(){
    clearInterval(myTimer)
    timerRunning = false;
    timerElement.classList.remove(`active`)
    timerElement.textContent = `30`
    winStateList = new Set();
    winCongratulation.classList.remove(`visible`);
}

function handleLoseStateAnimation() {
    loseState.classList.remove(`visible`);
}

resetButton.addEventListener(`click`, resetCardState);
resetButton.addEventListener(`click`, removeExistingGoals);
resetButton.addEventListener(`click`, addGoals);
resetButton.addEventListener(`click`, resetTimer);
resetButton.addEventListener(`click`, handleLoseStateAnimation);

// // make cards clickable by default
(function addClickableCards() {
    for (let card of tableCards){
        card.addEventListener(`click`, function() {
            card.classList.add(`clicked`);
        })
    }
})();



function setRandomCards(){
    let randomlyAssigned = new Set();
    let randomNumber;

    for (let i = 0; i < 10; i++) {
        let hiddenElement = document.createElement(`span`);
        hiddenElement.textContent = i + 1;

        randomNumber = Math.floor(Math.random() * tds.length);

        do {
            randomNumber = Math.floor(Math.random() * tds.length);
        } while (randomlyAssigned.has(randomNumber));

        randomlyAssigned.add(randomNumber);

        let goalCard = tds[randomNumber];
        goalCard.insertAdjacentElement(`afterbegin`, hiddenElement);
        goalCard.firstChild.classList.add(`goal-card`);
    }

};
setRandomCards()



let loseState = document.getElementById(`lose-state`);
let timerElement = document.getElementById(`timer`);
let timerRunning = false;
let myTimer;

document.addEventListener(`click`, startTimer);

function startTimer(e){
    if (timerRunning) {
        return;
    } else {
        if (e.target.classList.contains(`table-card`) ){
            timerRunning = true;
            timerElement.classList.add(`active`)

            myTimer = setInterval(() => {
                timerElement.textContent = +timerElement.textContent -1;
                if (+timerElement.textContent === 0 || timerRunning === false) {
                    winStateList = new Set()
                    clearInterval(myTimer)

                    for (let card of tableCards) {
                        card.classList.add(`non-clickable`);
                        setTimeout(() => {
                            card.classList.remove(`non-clickable`);
                        }, 500)
                    }

                    timerRunning = false;
                    loseState.classList.add(`visible`);
                    timerElement.classList.remove(`active`)
                    
                    for (let card of tableCards) {
                    card.classList.add(`clicked`);
                    }

                } 
            }, 1000)
        } 
}}


document.addEventListener(`click`, winCondition);

let winStateList = new Set();

function winCondition(e) {

    if (e.target.previousElementSibling && e.target.previousElementSibling.tagName === `SPAN`) {
        winStateList.add(e.target.previousElementSibling.textContent)
        console.log(winStateList);
        if(winStateList.size === 10){
            clearInterval(myTimer)
            timerElement.classList.remove(`active`)
            winCongratulation.classList.add(`visible`);
        }
    } else {
        return;
    }
}
let winCongratulation = document.getElementById(`win-state`)
