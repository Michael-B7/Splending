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

const reserveSpace = document.getElementsByClassName("empty-card")
function cardActions() {
    const cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
        if(!cards[i].classList.contains("used")) {
            cards[i].classList.add("used");
            cards[i].addEventListener("click", function(e) {
                if (e.target.classList.contains("reserve-button")) {
                    reserveCard(hands[currentPlayer], e.target.parentElement.parentElement)

                } else if (e.target.classList.contains("buy-button")) {
                    buyCard(hands[currentPlayer], e.target.parentElement.parentElement);
                }
            })
        } 
    }
};
cardActions();

const colors = ["red", "green", "blue", "white", "black"];
const colorList = {"red":'rgb(182, 45, 46)', "green":'rgb(33, 113, 74)', "blue":'rgb(21, 87, 163)', "white":'rgb(188, 188, 188)', "black":'rgb(44, 33, 29)'};
const reverseColorList = {'rgb(182, 45, 46)':"red", 'rgb(33, 113, 74)':"green", 'rgb(21, 87, 163)':"blue", 'rgb(188, 188, 188)':"white", 'rgb(44, 33, 29)':"black"};
const gemList = {"red":'ruby', "green":'emerald', "blue":'sapphire', "white":'diamond', "black":'onyx'}
let gemAmounts = {"red": 80, "green": 80, "blue": 80, "white": 80, "black": 80, "gold": 4} 
const players = document.getElementsByClassName("player");
const gemDisplays = document.querySelectorAll(".gem");

// player class
class Player {
    // gems: object of player gem count per color
    // cards: object of player card count per color
    // pp: num of player prestige points
    // np: num of player noble points
    // reserved: card object of reserved card
    // gold: boolean of whether player has gold or not
    constructor(name) {
        this.gems = {'red':0, 'green':0, 'blue':0, 'white':0, 'black':0};
        this.cards = {'red':0, 'green':0, 'blue':0, 'white':0, 'black':0};
        this.pp = 0;
        this.np = 0;
        this.reserved = false;
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
        this.image = image;
        this.color = ranColor(colorList);
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
                1:[[10,10,10,10], [10,10,10,20], [10,20,20], [10,10,30], [10,20], [20,20], [30]],
                2:{1:[[20,20,30], [20,30,30]], 2:[[10,20,40], [30,50], [50]]},
                3:{3:[[30,30,30,50]], 4:[[70], [30,30,60]]}
            }

            let costNums;
            if(level == 1 && points == 1){
                costNums = [40];
            }else if(level == 2 && points == 3){
                costNums = [60];
            }else if(level == 3 && points == 5){
                costNums = [30,70]
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
        this.points = Math.floor(Math.random() * 3) + 4 ;
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

let hands = [];

// hands[0]["cards"]["red"] = 10
// hands[0]["cards"]["blue"] = 10
// hands[0]["cards"]["green"] = 10
// hands[0]["cards"]["white"] = 10
// hands[0]["cards"]["black"] = 10
// hands[0]["gems"]["red"] = 100
// hands[0]["gems"]["blue"] = 100
// hands[0]["gems"]["green"] = 100
// hands[0]["gems"]["white"] = 100
// hands[0]["gems"]["black"] = 100

let chosenGems = [];

let currentPlayer = 0;
// current player begins at player 1
// function will add 1 to current player
function nextTurn() {
    
    currentPlayer += 1;
    if(currentPlayer > players.length-1) {
        // resets back to start of index if past the last child
        currentPlayer = 0
    } 
    playerGlow()
    chosenGems = [];
}

function updatePlayers(){
    for(let i=0; i<hands.length; i++){
        for(let iGems=0; iGems<Object.keys(hands[i]["gems"]).length; iGems++){
            players[i].children[1].children[iGems].innerHTML = hands[i]["gems"][colors[iGems]]
        }
        for(let iCards=5; iCards<Object.keys(hands[i]["cards"]).length+5; iCards++){
            players[i].children[1].children[iCards].innerHTML = hands[i]["cards"][colors[iCards-5]]
        }
        players[i].children[2].innerHTML = `Prestige Points: ${hands[i]["pp"]}`
        players[i].children[3].innerHTML = `Noble Points: ${hands[i]["np"]}`
    }
    
}

// sets all player box shadow to default
// current player's box is set with bright box shadow
function playerGlow() {
    for (let i = 0; i < players.length; i++) {
        players[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)";
    }
    players[currentPlayer].style.boxShadow = "0 0 10px 2.5px #EDD534";
}
// playerGlow();

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

// inner HTML of displayed player
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
    for (let i = 0; i < document.querySelectorAll(".gem").length; i++) {
        document.querySelectorAll(".gem")[i].style.display = "flex";
    }
    updatePlayers();
    nextTurn();
    currentPlayer = 0;
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
    let playerCount = document.getElementById("player-amount").value;
    hands = []
    for(let i=0; i<playerCount; i++){
        hands.push(new Player);
    }
    let innerPlayers = "";
    for(let i=0; i<playerCount; i++){
        let innerPlayer = `<div class="player player${i}">
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
        </div>`

        innerPlayers += innerPlayer;
    }
    const playerColumn = document.getElementById("players");
    playerColumn.innerHTML = innerPlayers;
    const reserveRow = document.getElementById("reserved-cards");
    reserveRow.innerHTML = innerReserve.repeat(playerCount);
    for (let i = 0; i < reserveRow.children.length; i++) {
        reserveRow.children[i].classList.add(i)
    }

    if (playerCount < 4) {
        playerColumn.style.justifyContent = "normal";
    } else {
        playerColumn.style.justifyContent = "space-between";
    }
    setName(playerCount)
}

// resets player amount to 1, prepares for players to join online
function setOnline() {
    document.getElementById("players").innerHTML = 
    `<div class="player">
    <h4 class="player-name"></h4>
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
            document.getElementById("players").innerHTML = ""
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
    if (icon.classList.contains("fa-circle-question")) {
        modalHeader.innerText = "How to play";
        document.getElementById("how-play").style.display = "flex";
    } else {
        modalHeader.innerText = "Settings";
        document.getElementById("settings").style.display = "flex";
    }
}

function goldMenu() {
    modal.style.display = "block";
    modalHeader.innerText = "How to play";
    document.getElementById("select-gold").style.display = "flex";
}

// changes css variables to color blind friendly colors and back
// document.getElementById("color-check").addEventListener("change", function() {
//     if (this.checked) {
//       document.documentElement.style.setProperty('--red', 'rgb(213, 94, 0)');
//       document.documentElement.style.setProperty('--green', 'rgb(0, 158, 115)');
//       document.documentElement.style.setProperty('--blue', 'rgb(0, 114, 178)');
//       document.documentElement.style.setProperty('--gold', 'rgb(240, 228, 66)');
//     } else {
//       document.documentElement.style.setProperty('--red', '#B62D2E');
//       document.documentElement.style.setProperty('--green', '#21714A');
//       document.documentElement.style.setProperty('--blue', '#1557A3');
//       document.documentElement.style.setProperty('--gold', '#B8B030');
//     }
// });

// display cards
let cards1 = []; let cards2 = []; let cards3 = [];

for(let i=0; i<4; i++){
    cards1.push(new Card(undefined, 1));
    cards2.push(new Card(undefined, 2));
    cards3.push(new Card(undefined, 3));
};

let board = {1:cards1, 2:cards2, 3:cards3};
function displayCards(cardList){
    let cards = document.getElementsByClassName("card");
    for(let i=0; i<cards.length; i++){
        cards[i].querySelector(".card-points").innerHTML = ''
        cards[i].querySelector(".card-worth").innerHTML = ''
        cards[i].querySelector(".card-costs").innerHTML = ''
    }

    for(let level in cardList){
        let row = document.getElementsByClassName(`level-${level} used`);
        for(let i=0; i<row.length; i++){
            let card = board[level][i];
            let cardHeader = row[i].children[1].children[0];
            row[i].style.backgroundColor = colorList[card.color]
            cardHeader.children[1].innerHTML = gemList[card.color]
            if(card.points == 0){
                cardHeader.children[0].innerHTML = '';
            }else{
                cardHeader.children[0].innerHTML = card.points;
            }
            let costItems = row[i].children[1].children[1].children[0]
            for(let j=0; j<Object.keys(card.cost).length; j++){
                let currColor = Object.keys(card.cost)[j];
                costItems.innerHTML = costItems.innerHTML + `<div class="${currColor} cost">${card.cost[currColor]}</div>`;
            }
        }
    }
}
displayCards(board);

// sets the reserve card space of current player to the color of selected card
// only runs if reserve space is empty

function reserveCard(player, eventCard) {
    let curPlaySpace = reserveSpace[currentPlayer]
    if (!player.reserved) {
        curPlaySpace.style.border = "none";
        gemAmounts["gold"]--;
        document.querySelector(".gem + .gold").innerHTML = gemAmounts["gold"];
        curPlaySpace.innerHTML = eventCard.innerHTML;
        // level: num, the card level of the selected card
        let level = eventCard.classList[1].slice(-1);
        let row = document.getElementsByClassName(`level-${level} used`);
        for (let i = 0; i < row.length; i++) {
            if (row[i] == eventCard) {
                player.reserved = board[level][i];
                
                curPlaySpace.children[1].children[0].children[0].innerHTML = player["reserved"]["points"];
                curPlaySpace.children[0].innerHTML = 
                `<div class="buy-button">Purchase</div>
                <div class="gold-button">Use Gold</div>`
                curPlaySpace.children[1].children[0].children[1].innerHTML = gemList[player["reserved"]["color"]];
                curPlaySpace.style.backgroundColor = colorList[player["reserved"]["color"]];
                if (board[level][i].points < 1) {
                    curPlaySpace.children[1].children[0].children[0].innerHTML = "";
                }
                let costItems = curPlaySpace.children[1].children[1].children[0] 
                costItems.innerHTML = ""
                for (let j = 0; j < Object.keys(board[level][i].cost).length; j++) {
                    let currColor = Object.keys(board[level][i].cost)[j]
                    costItems.innerHTML = costItems.innerHTML + `<div class="${currColor} cost">${board[level][i].cost[currColor]}</div>`;
                }
                if (level == 3) {
                    cards3.splice(i, 1, new Card(undefined, 3));
                    displayCards(board)
                }else if (level == 2) {
                    cards2.splice(i, 1, new Card(undefined, 2));
                    displayCards(board)
                }else if (level == 1) {
                    cards1.splice(i, 1, new Card(undefined, 1));
                    displayCards(board)
                }
            }
        }
        curPlaySpace.children[0].addEventListener("click", function(e) {
            if (e.target.classList.contains("buy-button")) {
                buyCard(hands[currentPlayer], e.target.parentElement.parentElement, true);
            } else if (e.target.classList.contains("gold-button")) {
                if (curPlaySpace.parentElement.classList[1] == currentPlayer && !player.gold) {
                    goldMenu()
                } else {
                    console.log("booo")
                }
            }
        })

        // reserveSize();
        cardActions();
        nextTurn();
    } else {
        console.log("can not reserve");
    }
}

// take gems
function takeGems(player, gems){

    let gemColors = []
    for(let i=0; i<gems.length; i++){
        gemColors.push(window.getComputedStyle(gems[i]).backgroundColor);
    }
    if(gems.length == 2 && gemColors[0] == gemColors[1]){
        if(gemAmounts[reverseColorList[gemColors[0]]] >= 40){
            player.gems[Object.keys(colorList).find(key => colorList[key] == gemColors[0])] += 20;
            gemAmounts[reverseColorList[gemColors[0]]] -= 20;
            gems[0].innerHTML = gemAmounts[reverseColorList[gemColors[0]]];
            gems[0].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
            updatePlayers();
            nextTurn();
        }else{
            console.log("cant take")
            chosenGems = []
            gems[0].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
        }
    }else if(gems.length == 3 && gemColors[0] != gemColors[1] && gemColors[0] != gemColors[2] && gemColors[1] != gemColors[2]){
        if(gemAmounts[reverseColorList[gemColors[0]]] > 0 && gemAmounts[reverseColorList[gemColors[1]]] > 0 && gemAmounts[reverseColorList[gemColors[2]]] > 0){

            for(let i=0; i<gems.length; i++){
                player.gems[Object.keys(colorList).find(key => colorList[key] === gemColors[i])] += 10;
                gemAmounts[reverseColorList[gemColors[i]]] -= 10;
                gems[i].innerHTML = gemAmounts[reverseColorList[gemColors[i]]];
                gems[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
            }
            updatePlayers();
            nextTurn();
        }else{
            console.log("cant take")
            chosenGems = []
            for(let i=0; i<gems.length; i++){
                gems[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
            }
        }
    }else if(gems.length > 2 ){
        console.log("cant take")
        chosenGems = []
        for(let i=0; i<gems.length; i++){
            gems[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
        }
    }
    
    for (let i = 0; i < gemDisplays.length; i++) {
        if (gemDisplays[i].innerHTML != gemAmounts[Object.keys(gemAmounts)[i]]) {
            console.log("nonono")
            gems[i].innerHTML = gemAmounts[reverseColorList[gemColors[i]]];
        }
    }
}

for(let i=0; i<Object.keys(colorList).length; i++){
    document.getElementsByClassName(`gem ${Object.keys(colorList)[i]}`)[0].addEventListener("click", function(e){
        e.target.style.boxShadow = `0 0 10px 5px rgb(188, 188, 188)`
        chosenGems.push(e.target)
        takeGems(hands[currentPlayer], chosenGems)
    })
}

// purchase cards
function buyCard(player, card, reserved){
    console.log("double")
    if (!reserved) {
        let color = reverseColorList[window.getComputedStyle(card).backgroundColor]
        let level = card.classList[1].slice(-1);
        let row = document.getElementsByClassName(`level-${level} used`);
        for(let i=0; i<row.length; i++){
            if(row[i] == card){
                let afford = checkAfford(player, board[level][i])
                if(afford){
                    returnGems(player, board[level][i])
                    player["cards"][color] ++;
                        if (level == 3) {
                            cards3.splice(i, 1, new Card(undefined, 3));
                            displayCards(board)
                        }else if (level == 2) {
                            cards2.splice(i, 1, new Card(undefined, 2));
                            displayCards(board)
                        }else if (level == 1) {
                            cards1.splice(i, 1, new Card(undefined, 1));
                            displayCards(board)
                        }
                    updatePlayers();
                    nextTurn();
                }else{
                    alert("cant buy")
                }
            }
        }
    } else {
        let afford = checkAfford(player, player["reserved"])
        if (afford) {
            returnGems(player, player["reserved"])
            player["cards"][player["reserved"]["color"]] ++;
            player["gold"] = false;
            let curPlaySpace = reserveSpace[currentPlayer]
            curPlaySpace.style.backgroundColor = "rgba(0, 0, 0, 0)";
            curPlaySpace.style.border = "4px dashed white"
            curPlaySpace.innerHTML = ""
            player["reserved"] = false;
            updatePlayers();
            nextTurn();
        } else {
            alert("cant buy")
        }
    }
    
}

function checkAfford(player, card) {
    let afford = false
    for(let j=0; j<Object.keys(card["cost"]).length; j++){
        let currColor = Object.keys(card["cost"])[j]
        if(player["gems"][currColor] >= (card["cost"][currColor] - player["cards"][currColor]*10) ){
            afford = true
            console.log("yipeeeeeeeeeeeeeeeeeeeeeee")
        }else{
            afford = false
            console.log("no yipeeeeeeeeeeeeeeeeeeeeeee")
        }
    }
    return afford;
}

function returnGems(player, card) {
    for(let j=0; j<Object.keys(card["cost"]).length; j++){
        let currColor = Object.keys(card["cost"])[j]
        console.log(currColor)
        player["gems"][currColor] -= (card["cost"][currColor] - player["cards"][currColor]*10)
        player["pp"] += card["points"]
        if (player["gold"] == currColor) {
            gemAmounts[currColor] += (card["cost"][currColor] -10)
        } else {
            gemAmounts[currColor] += (card["cost"][currColor] - player["cards"][currColor]*10)
        }

        document.querySelector(`.gem.${currColor}`).innerHTML = gemAmounts[currColor];
    }
}

// nobles
let nobles = [new Noble(undefined), new Noble(undefined)]
function displayNobles(){
    let nobleHTML = document.querySelectorAll(".noble:not(.noble-stack)");
    for(let i=0; i<nobleHTML.length; i++){
        if(!nobleHTML[i].children[1].children[0].classList.contains("used")){
            nobleHTML[i].children[1].children[0].addEventListener("click", function(e){attractNobles(hands[currentPlayer], e.target.parentElement.parentElement)});
            nobleHTML[i].children[1].children[0].classList.add("used")
        }
        nobleHTML[i].children[0].innerHTML = `<div class="noble-points">${nobles[i].points}</div> <div class="noble-cost"></div>`
        for(let j=0; j<Object.keys(nobles[i].cost).length; j++){
            let currColor = Object.keys(nobles[i].cost)[j];
            nobleHTML[i].children[0].children[1].innerHTML = nobleHTML[i].children[0].children[1].innerHTML + `<div class="${currColor} cost">${nobles[i].cost[currColor]}</div>`;
        }
    }
}
displayNobles()

// sets size for reserve cards
function reserveSize() {
    let card = document.getElementsByClassName("card");
    let rCard = document.getElementsByClassName("empty-card");
    if (card[0].offsetWidth + "px" > 0) {
        for (let i = 0; i < rCard.length; i++) {
            rCard[i].style.height = card[0].offsetWidth + "px";
        }
    }
}
// reserveSize()

function attractNobles(player, noble){
    let noblesHTML = document.querySelectorAll(".noble:not(.noble-stack)");
    if(player["np"] > 0){
        console.log("you already have noble")
    }else{
        for(let i=0; i<noblesHTML.length; i++){
            if(noblesHTML[i] == noble){
                let afford = false;
                for(let j=0; j<Object.keys(nobles[i]["cost"]).length; j++){
                    let currColor = Object.keys(nobles[i]["cost"])[j]
                    if(player["cards"][currColor] >= nobles[i]["cost"][currColor]){
                        afford = true
                    }else{
                        afford = false
                    }
                }
                if(afford){
                    player["pp"] += nobles[i]["points"]
                    player["np"] = nobles[i]["points"]
                    nobles.splice(i, 1, new Noble(undefined));
                    displayNobles()
                    updatePlayers();
                    nextTurn();
                }else{
                    console.log("cant attract")
                }
            }
        }
    }
}

const modalGems = document.getElementsByClassName("select-gem");
for (let i = 0; i < modalGems.length; i++) {
    modalGems[i].addEventListener("click", (e) => {
        let selectedColor = e.target.classList[1];
        console.log(`awoooga ${i}`)
        hands[currentPlayer]["gems"][selectedColor] += 10;
        hands[currentPlayer]["gold"] = selectedColor;
        updatePlayers();

        modal.style.display = "none";
        for (let i = 0; i < modalSections.length; i++) {
            modalSections[i].style.display = "none";
        }
    })
}