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
    constructor() {
        this.gems = {'red':0, 'blue':0, 'green':0, 'white':0, 'black':0};
        this.cards = {'red':0, 'blue':0, 'green':0, 'white':0, 'black':0};
        this.pp = 0;
        this.np = 0;
        this.reserved = null;
        this.gold = false;
    }
}

// card class
class Card {
    // color: string of the gem provided by card
    // image: string of url of background image of card
    // points: num of point value of card
    // cost: object of how many gems and color of gems card costs
    // level: num of difficulty to acquire
    constructor(color, image, level){
        this.color = color;
        this.image = image;
        this.points
        this.cost
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
    }
}

// noble class
class Noble{
    // cost: object of color of card and number of that color of card required
    // np: num of point value assigned to noble
    // image: string of url of background image of noble
    constructor(cost, np, image){
        this.cost = cost;
        this.np = np;
        this.image = image;
    }
}

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

document.getElementById("test").addEventListener("click", function() {
    document.getElementById("game-settings").style.display = "flex";
    document.getElementById("board").style.display = "none";
});

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
    let name = localStorage.getItem("userName") 

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