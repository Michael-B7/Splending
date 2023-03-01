document.getElementById("create").addEventListener("click", () => {
    document.getElementById("start").style.display = 'none'; 
    document.getElementById("game").style.display = 'flex';

    playerAmount()
    setName(4)
})

let indexValue = 1;
function tutorial(index) {
    shownStep(indexValue += index);
}

// e: number
// 
function shownStep(e) {
    const steps = document.querySelectorAll(".step");
    // resets back to start of index if past the last child
    if(e > steps.length) {
        indexValue = 1
    } 
    if(e < 1) {
        indexValue = steps.length
    }
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = "none";
    }
    steps[indexValue - 1].style.display = "flex";
}

document.getElementById("nav-right").addEventListener("click", function() {
    tutorial(1);
});
document.getElementById("nav-left").addEventListener("click", function() {
    tutorial(-1);
});


function cardActions() {
    const cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
        if(!cards[i].classList.contains("used")) {
            cards[i].classList.add("used");
            cards[i].addEventListener("click", function(e) {
                if (e.target.innerText == "Reserve") {
                    reserveCard(window.getComputedStyle(this).backgroundColor)
                } else if (e.target.innerText == "Purchase") {
                    console.log("purchase!!")
                } 
            })
        } 
    }
};
cardActions();

// sets the reserve card space of current player to the color of selected card
// only runs if reserve space is empty
const reserveSpace = document.getElementsByClassName("empty-card")
function reserveCard(cardColor) {
    let curPlaySpace = reserveSpace[currentPlayer]
    // rgba(0, 0, 0, 0) is empty background color
    // use (window.getComputedStyle() for background color
    if (window.getComputedStyle(curPlaySpace).backgroundColor == "rgba(0, 0, 0, 0)") {
        curPlaySpace.style.border = "none";
        curPlaySpace.style.backgroundColor = cardColor;
        nextTurn()
    }
}

// sets reserve card space back to defualt
    // let curPlaySpace = reserveSpace[currentPlayer - 1]
    // curPlaySpace.style.backgroundColor = "rgba(0, 0, 0, 0)";
    // curPlaySpace.style.border = "4px dashed white"
    // nextTurn()`

const colorList = {"red":'rgb(182, 45, 46)', "blue":'#1557A3', "green":'#21714A', "white":'#BCBCBC', "black":'#2C211D'};
const gemList = {"red":'ruby', "blue":'sapphire', "green":'emerald', "white":'diamond', "black":'onyx'}
const players = document.getElementsByClassName("player");

// player class
class Player {
    // gems: object of player gem count per color
    // cards: object of player card count per color
    // pp: num of player prestige points
    // np: num of player noble points
    // reserved: card object of reserved card
    // gold: boolean of whether player has gold or not
    constructor(name) {
        this.gems = {'red':0, 'blue':0, 'green':0, 'white':0, 'black':0};
        this.cards = {'red':0, 'blue':0, 'green':0, 'white':0, 'black':0};
        this.pp = 0;
        this.np = 0;
        this.reserved = null;
        this.gold = false;
        this.name = name;
    }
}

// card class
class Card {
    // color: string of the gem provided by card
    // image: string of url of background image of card
    // points: num of point value of card
    // cost: object of how many gems and color of gems card costs
    // level: num of difficulty to acquire
    constructor(image, level){
        this.color = ranColor(colorList)
        this.image = image;
        this.level = level;
        this.calcPoints = function(level){
            const possPoints = {1:[0,0,0,0,0,0,0,1], 2:[1,1,2,2,2,3], 3:[3,4,4,5]};
            let points;
            if(level == 1){
                points = possPoints[1][Math.floor(Math.random() * possPoints[1].length)];
            }else if(level == 2){
                points = possPoints[2][Math.floor(Math.random() * possPoints[2].length)];
            }else if(level == 3){
                points = possPoints[3][Math.floor(Math.random() * possPoints[3].length)];
            }
            return points;
        }
        this.points = this.calcPoints(level);
        this.calcCost = function(level, points){
            let possCosts = {
                1:[[1,1,1,1], [1,1,1,2], [1,2,2], [1,1,3], [1,2], [2,2], [3]],
                2:{1:[[2,2,3], [2,3,3]], 2:[[1,2,4], [3,5], [5]]},
                3:{3:[[3,3,3,5]], 4:[[7], [3,3,6]]}
            }

            let costNums;
            if(level == 1 && points == 1){
                costNums = [4];
            }else if(level == 2 && points == 3){
                costNums = [6];
            }else if(level == 3 && points == 5){
                costNums = [3,7]
            }else if(level == 1){
                costNums = possCosts[1][Math.floor(Math.random() * possCosts[1].length)]
            }else if(level == 2){
                costNums = possCosts[2][points][Math.floor(Math.random() * possCosts[2][points].length)]
            }else if(level == 3){
                costNums = possCosts[3][points][Math.floor(Math.random() * possCosts[3][points].length)]
            }

            let cost = {};
            let colors = selectColors(costNums.length);
            for(let i=0; i<costNums.length; i++){
                cost[colors[i]] = costNums[i]
            }

            return cost;
        }
        this.cost = this.calcCost(level, this.points);
    }
}

// noble class
class Noble{
    // cost: object of color of card and number of that color of card required
    // np: num of point value assigned to noble
    // image: string of url of background image of noble
    constructor(image){
        this.np = Math.floor(Math.random() * 4) + 3;
        this.image = image;
        this.calcCost = function(){
            let possCosts = [[3,3,3], [4,4]];
            let costNums = possCosts[Math.floor(Math.random() * possCosts.length)];
            let colors = selectColors(costNums.length);
            let cost = {};
            for(let i=0; i<costNums.length; i++){
                cost[colors[i]] = costNums[i];
            }
            return cost;
        }
        this.cost = this.calcCost();
    }
}

let playerCount = 4;
let hands = []
for(let i=0; i<playerCount; i++){
    hands.push(new Player);
}

let gems = [];

let currentPlayer = 0;
// current player begins at player 1
// function will add 1 to current player
function nextTurn() {
    currentPlayer += 1;
    if(currentPlayer > players.length-1) {
        // resets back to start of index if past the last child
        currentPlayer = 0
    } 
    // console.log(currentPlayer)
    playerGlow()
    gems = [];
}

// sets all player box shadow to default
// current player's box is set with bright box shadow
function playerGlow() {
    for (let i = 0; i < players.length; i++) {
        players[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)";
    }
    // console.log(players[currentPlayer])
    players[currentPlayer].style.boxShadow = "0 0 10px 2.5px #EDD534";
}
playerGlow();

const innerCard =
`<div class="card-content">
<div class="card-header">
  <div class="card-points"></div>
  <div class="card-worth"></div>
</div>
<div class="card-body">
  <div class="card-costs">
    <div class="red-cost"></div>
    <div class="blue-cost"></div>
    <div class="green-cost"></div>
    <div class="white-cost"></div>
    <div class="black-cost"></div>
  </div>
</div>
</div>`

function ranColor(colors){
    let keys = Object.keys(colors);
    return keys[Math.floor(Math.random()*keys.length)];
};

// makes sure the cost object of a card does not have a repeated key
function selectColors(numTerms){
    let colors = new Set();
    while(colors.size < numTerms){
        colors.add(ranColor(colorList));
    };
    let temp = [];
    colors.forEach(function(value){
        temp.push(value)
    });
    colors = temp;
    return colors;
}

// inner HTML of displayed players
const innerPlayer = 
`<div class="player">
<h4 class="player-name">Player</h4>
<div class="player-gems">
  <div class="player-gem red">0</div>
  <div class="player-gem green">0</div>
  <div class="player-gem blue">0</div>
  <div class="player-gem white">0</div>
  <div class="player-gem black">0</div>
  <div class="player-card red">0</div>
  <div class="player-card green">0</div>
  <div class="player-card blue">0</div>
  <div class="player-card white">0</div>
  <div class="player-card black">0</div>
</div>
<div class="player-balance">Prestige Points:</div>
<div class="noble-balance">Nobles:</div>
</div>`;

// inner HTML of reserved cards
const innerReserve = 
`<div class="reserved-container">
<h4 class="player-name">Player</h4>      
<div class="empty-card"></div>
</div>`

// start game button, removes settings, displays board
document.getElementById("start-game").addEventListener("click", () => {
    document.getElementById("game-settings").style.display = "none";
    document.getElementById("board").style.display = "grid";
    playerGlow();
})

// saves username to local storage
document.getElementById("name").addEventListener("blur", (e) => {
    window.localStorage.setItem("userName", e.target.value);
})

// sets name in local storage to game board
// pAmount: num, the amount of players in a game
function setName(pAmount) {
    let name = localStorage.getItem("userName");

    // sets name to player if name blank or no local storage
    if (name == "" || name == null) {
        name = "Player";
    }

    document.getElementsByClassName("player-name")[0].innerText = name;
    document.getElementsByClassName("player-name")[+pAmount].innerText = name;
}

// displays how many players are in a game
// updates on game setting dropdown
function playerAmount() {
    let playerAmount = 4;
    playerAmount = document.getElementById("player-amount").value;
    console.log(playerAmount);

    document.getElementById("players").innerHTML = innerPlayer.repeat(playerAmount);
    document.getElementById("reserved-cards").innerHTML = innerReserve.repeat(playerAmount);
    setName(playerAmount)
}

// resets player amount to 1, prepares for players to join online
function setOnline() {
    document.getElementById("players").innerHTML = innerPlayer.repeat(1);
    document.getElementById("reserved-cards").innerHTML = innerReserve.repeat(1);
    setName(1)
}

document.getElementById("name").value = localStorage.getItem("userName");
document.getElementById("player-amount").addEventListener("change", playerAmount);

// event listener on settings radio buttons, displays or hides local/online
const radioButtons = document.querySelectorAll(`input[type="radio"]`);
for (let i = 0; i < radioButtons.length; i++) {
    const element = radioButtons[i];

    element.addEventListener("click", () => {
        if (element.value == "online") {
            document.getElementsByClassName("local")[0].style.display = "none"
            setOnline();
        } else {
            document.getElementsByClassName("online")[0].style.display = "none"
            playerAmount()
        } document.getElementsByClassName(element.value)[0].style.display = "flex"
    })
}

const modal = document.getElementById("modal");
const modalIcons = document.querySelectorAll(".open-modal");
const modalSections = document.querySelectorAll(".modal-section");
const modalHeader = document.getElementById("modal-header");
// removes modal from display when modal content is not clicked
window.onclick = function(e) {
    if (e.target == modal) {
      modal.style.display = "none";
      for (let i = 0; i < modalSections.length; i++) {
        modalSections[i].style.display = "none";
      }
    }
}

// displays modal when an icon with the modal-icon class is selected
for (let i = 0; i < modalIcons.length; i++) {
    modalIcons[i].addEventListener("click", (e) => {
        modal.style.display = "block";
        openModal(e.target)
    })
}

// sets correct modal content
// parameter: string, takes in the icon that is selected
function openModal(icon) {
    document.getElementById("modal-username").innerText = localStorage.getItem("userName");
    if (icon.classList.contains("fa-circle-question")) {
        modalHeader.innerText = "How to play";
        document.getElementById("settings").style.display = "flex";
    } else if (icon.classList.contains("fa-chart-simple")) {
        modalHeader.innerText = "Statistics";
        document.getElementById("statistics").style.display = "flex";
    } else {
        modalHeader.innerText = "Settings";
        document.getElementById("settings").style.display = "flex";
    }
}

// changes css variables to color blind friendly colors and back
document.getElementById("color-check").addEventListener("change", function() {
    if (this.checked) {
      document.documentElement.style.setProperty('--red', '#D55E00');
      document.documentElement.style.setProperty('--green', '#009E73');
      document.documentElement.style.setProperty('--blue', '#0072B2');
      document.documentElement.style.setProperty('--gold', '#F0E442');
    } else {
      document.documentElement.style.setProperty('--red', '#B62D2E');
      document.documentElement.style.setProperty('--green', '#21714A');
      document.documentElement.style.setProperty('--blue', '#1557A3');
      document.documentElement.style.setProperty('--gold', '#B8B030');
    }
});

// display cards
let cards1 = []; let cards2 = []; let cards3 = [];

for(let i=0; i<4; i++){
    cards1.push(new Card(undefined, 1));
    cards2.push(new Card(undefined, 2));
    cards3.push(new Card(undefined, 3));
};

let dispCards = {1:cards1, 2:cards2, 3:cards3};
function displayCards(cardList){
    for(let level in cardList){
        let row = document.getElementsByClassName(`level-${level} used`);
        for(let i=0; i<row.length; i++){
            let card = dispCards[level][i]
            let cardHeader = row[i].children[1].children[0]
            row[i].style.backgroundColor = colorList[card.color]
            cardHeader.children[1].innerHTML = gemList[card.color]
            if(card.points == 0){
                cardHeader.children[0].innerHTML = ''
            }else{
                cardHeader.children[0].innerHTML = card.points;
            }
            let costItems = row[i].children[1].children[1].children[0]
            for(let i=0; i<Object.keys(card.cost).length; i++){
                let currColor = Object.keys(card.cost)[i]
                costItems.innerHTML = costItems.innerHTML + `<div class="${currColor} cost">${card.cost[currColor]}</div>`;
            }
        }
    }
}

displayCards(dispCards);

// take gems
function takeGems(player, gems){
    gemColors = []
    for(let i=0; i<gems.length; i++){
        gemColors.push(window.getComputedStyle(gems[i]).backgroundColor);
    }
    if(gems.length == 2 && gemColors[0] == gemColors[1] && gems[0].innerHTML >= 4){
        player.gems[Object.keys(colorList).find(key => colorList[key] == gemColors[0])] += 2;
        console.log(Object.keys(colorList).find(key => colorList[key] == gemColors[0]));
        nextTurn();
    }else if(gems.length == 3 && gems[0].innerHTML > 0 && gems[1].innerHTML > 0 && gems[2].innerHTML > 0){
        if(gemColors[0] != gemColors[1] && gemColors[0] != gemColors[2] && gemColors[1] != gemColors[2]){
            for(let i=0; i<gems.length; i++){
                player.gems[Object.keys(colorList).find(key => colorList[key] === gemColors[i])] += 1;
            }
            nextTurn();
        }
    }
    console.log(hands)
}

for(let i=0; i<Object.keys(colorList).length; i++){
    document.getElementsByClassName(`gem ${Object.keys(colorList)[i]}`)[0].addEventListener("click", function(e){
        gems.push(e.target)
        console.log(hands[currentPlayer])
        takeGems(hands[currentPlayer], gems)
    })
}

// display gems
function displayGems(player, gems){

}

// purchase cards
// function buyCard(card, player){

// }
