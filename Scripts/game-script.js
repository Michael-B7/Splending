let winPoints = 0

document.getElementById("create").addEventListener("click", () => {
    document.getElementById("start").style.display = 'none'; 
    document.getElementById("game").style.display = 'flex';
    playerAmount()
})

let indexValue = 1;
function tutorial(index) {
    shownStep(indexValue += index);
}

let attackIcons;

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

let tutPop = true;
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
        this.attackable = false;
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
                1:[[10,10,10,10,0], [10,10,10,20,0], [10,20,20,0,0], [10,10,30,0,0], [10,20,0,0,0], [20,20,0,0,0], [30,0,0,0,0]],
                2:{1:[[20,20,30,0,0], [20,30,30,0,0]], 2:[[10,20,40,0,0], [30,50,0,0,0], [50,0,0,0,0]]},
                3:{3:[[30,30,30,50,0]], 4:[[70,0,0,0,0], [30,30,60,0,0]]}
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
            let possCosts = [[3,3,3,0,0], [4,4,0,0,0]];
            let costNums = possCosts[Math.floor(Math.random() * possCosts.length)];
            let colors = selectColors(costNums.length);
            let cost = {};
            for(let i=0; i<costNums.length; i++){
                cost[colors[i]] = costNums[i];
            }
            cost = colorSort(cost);
            return cost;
        }
        this.cost = this.calcCost();
    }
}


function colorSort(cost) {
    let entries = Object.entries(cost);
    let keys = Object.keys(cost);
    let tempObj = {};
    for (let i = 0; i < entries.length; i++) {
        for (let j = 0; j < colors.length; j++) {
            if (keys[i] == colors[j]) {
                tempObj[colors[j]] = entries[i][1];
            }
        }
    }
    return tempObj;
}

let hands = [];

let chosenGems = [];

let currentPlayer = 0;
// current player begins at player 1
// function will add 1 to current player
function nextTurn() {
    let win = checkWin(hands[currentPlayer])
    if(win){return}
    currentPlayer += 1;
    if(currentPlayer > players.length-1) {
        // resets back to start of index if past the last child
        currentPlayer = 0
    }
    
    if(singlePlayer && currentPlayer != 0){
        console.log("start cpu")
        cpuTurn()
        console.log("end cpu")
    }

    if (tutPop && !(singlePlayer && currentPlayer != 0)) {
    modal.style.display = "block"
    document.querySelector("#feedback").style.display = "flex"
    document.querySelector("#feedback .modal-text").style.textAlign = "left"
    document.querySelector("#feedback .modal-text").innerHTML = `<h4>It is Player ${currentPlayer+1}'s Turn</h4><p>You Can:<br>1. Take Two of One Color Gem<br>2. Take One of Three Different Color Gems<br>3. Buy a Development Card<br>4. Reserve a Development Card<br>5. Attract a Noble<br>6. Attack Another Player's Noble</p>`
    }

    playerGlow()
    chosenGems = [];
}

function updatePlayers(){
    for(let i=0; i<hands.length; i++){
        for(let iGems=0; iGems<Object.keys(hands[i]["gems"]).length; iGems++){
            players[i].children[2].children[iGems].innerHTML = hands[i]["gems"][colors[iGems]]
        }
        for(let iCards=5; iCards<Object.keys(hands[i]["cards"]).length+5; iCards++){
            players[i].children[2].children[iCards].innerHTML = hands[i]["cards"][colors[iCards-5]]
        }
        players[i].children[3].innerHTML = `Prestige Points: ${hands[i]["pp"]}`
        if(hands[i]["np"] > 0){
            players[i].children[1].children[0].style.opacity = 1
            hands[i]["attackable"] = true;
        }else{
            players[i].children[1].children[0].style.opacity = .3
        }
        players[i].children[4].innerHTML = `Noble Points: ${hands[i]["np"]}`
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
    let colorSet = new Set();
    while(colorSet.size < numTerms){
        colorSet.add(ranColor(colorList));
    };
    let temp = [];
    colorSet.forEach(function(value){
        temp.push(value)
    });
    colorSet = temp;

    let tempArray = []
    for (let i = 0; i < colors.length; i++) {
        tempArray.push()
    }

    return colorSet;
}

// inner HTML of displayed player
// inner HTML of reserved cards
const innerReserve = 
`<div class="reserved-container">
<h4 class="player-name">Player</h4>    
<div class="empty-card"></div>
</div>`

let singlePlayer = false

// start game button, removes settings, displays board
document.getElementById("start-game").addEventListener("click", () => {
    if(document.querySelector("#single-player input").checked){
        singlePlayer = true;
    }
    winPoints = document.getElementById("points").value;
    document.getElementById("game-settings").style.display = "none";
    document.getElementById("board").style.display = "grid";
    for (let i = 0; i < document.querySelectorAll(".gem").length; i++) {
        document.querySelectorAll(".gem")[i].style.display = "flex";
    }
    updatePlayers();
    // nextTurn();
    currentPlayer = 0;
    if (tutPop) {
        modal.style.display = "block"
        document.querySelector("#feedback").style.display = "flex"
        document.querySelector("#feedback .modal-text").style.textAlign = "left"
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>It is Player ${currentPlayer+1}'s Turn</h4><p>You Can:<br>1. Take Two of One Color Gem<br>2. Take One of Three Different Color Gems<br>3. Buy a Development Card<br>4. Reserve a Development Card<br>5. Attract a Noble<br>6. Attack Another Player's Noble</p>`
    }
    playerGlow();
})

// displays how many players are in a game
// updates on game setting dropdown
function playerAmount() {
    let playerCount = document.getElementById("player-amount").value;
    hands = []
    for(let i=0; i<playerCount; i++){
        hands.push(new Player);
    }
    // hands[0]["pp"] = 1
    // hands[0]["cards"]["red"] = 4
    // hands[0]["cards"]["blue"] = 4
    // hands[0]["cards"]["green"] = 4
    // hands[0]["cards"]["white"] = 4
    // hands[0]["cards"]["black"] = 4
    // hands[1]["cards"]["red"] = 10
    // hands[1]["cards"]["blue"] = 10
    // hands[1]["cards"]["green"] = 10
    // hands[1]["cards"]["white"] = 10
    // hands[1]["cards"]["black"] = 10
    let innerPlayers = "";
    for(let i=0; i<playerCount; i++){
        let innerPlayer = `<div class="player player${i}">
        <h4 class="player-name">Player ${i+1}</h4>
        <div class="attack"> <img src="/Images/sword.png" alt=""> </div>  
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
    attackIcons = document.querySelectorAll(".attack img");
    for(let i=0; i<attackIcons.length; i++){
        attackIcons[i].addEventListener("click", function(e){
            if(e.target.style.opacity != 1 || hands[currentPlayer]["np"] == 0 || e.target.parentElement.parentElement.classList[1].slice(-1) == currentPlayer){

                modal.style.display = "block"
                document.querySelector("#feedback").style.display = "flex";
                document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Attack This Player</h4><p>Both you and the player you want to attack must have more than 0 Noble Points.</p>";

            }else{
                nobleAttack(hands[currentPlayer], hands[e.target.parentElement.parentElement.classList[1].slice(-1)]);
            }
        })
    }
}

// resets player amount to 1, prepares for players to join online
function setOnline() {
    document.getElementById("players").innerHTML = 
    `<div class="player">
        <h4 class="player-name">Player</h4>
        <div class="attack"> <img src="/Images/sword.png" alt=""> </div>  
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
    document.getElementById("reserved-cards").innerHTML = innerReserve.repeat(1);
}

document.getElementById("player-amount").addEventListener("change", playerAmount);

const modal = document.getElementById("modal");
const modalIcons = document.querySelectorAll(".open-modal");
const modalSections = document.querySelectorAll(".modal-section");
const modalHeader = document.getElementById("modal-header");
// removes modal from display when modal content is not clicked
let clickType = "onclick";
if (window.outerWidth <= 950) {
    clickType = "ontouchstart";
}

window[clickType] = function(e) {
    let gemClick = true
    for(let i=0; i<document.querySelectorAll(".gems .gem").length-1; i++){
        if(e.target != document.querySelectorAll(".gems .gem")[i]){
            gemClick = false
        }else{
            gemClick = true
            break
        }
    }

    if(!gemClick){
        chosenGems = []
        for(let i=0; i<document.querySelectorAll(".gems .gem").length-1; i++){
            document.querySelectorAll(".gems .gem")[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
        }
    }
    
    if (e.target == modal && !(singlePlayer && currentPlayer != 0)) {
        if(document.querySelector(".win").style.display == "flex"){
            location.reload()
        }
        modal.style.display = "none";
        modalHeader.innerText = "";
        
        if (window.outerWidth <= 950) {
            document.querySelectorAll(".modal-content")[0].style.width = "350px";
        } else {
            document.querySelectorAll(".modal-content")[0].style.width = "500px";
        }
        for (let i = 0; i < modalSections.length; i++) {
            modalSections[i].style.display = "none";
        }
    }
}

// displays modal when an icon with the modal-icon class is selected
for (let i = 0; i < modalIcons.length; i++) {
    modalIcons[i].addEventListener("click", (e) => {
        modal.style.display = "block";
        if (e.target.classList.contains("fa-circle-question")) {
            document.getElementById("modal-header").innerText = "How to play";
            document.getElementById("how-play").style.display = "flex";
            if (window.outerWidth <= 950) {
                document.querySelectorAll(".modal-content")[0].style.width = "400px";
            } else {
                document.querySelectorAll(".modal-content")[0].style.width = "1000px";
            }
        } else {
            document.getElementById("modal-header").innerText = "Settings";
            document.getElementById("settings").style.display = "flex";
        }
    })
}


// changes css variables to color blind friendly colors and back
document.getElementById("color-check").addEventListener("change", function() {
    if (this.checked) {
        tutPop = true;
    } else {
        tutPop = false;
    }
});

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
                if (card["cost"][currColor] > 0) {
                    costItems.innerHTML = costItems.innerHTML + `<div class="${currColor} cost">${card.cost[currColor]}</div>`;
                }
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
                    let currColor = Object.keys(board[level][i].cost)[j];
                    if (board[level][i].cost[currColor] > 0) {
                        costItems.innerHTML = costItems.innerHTML + `<div class="${currColor} cost">${board[level][i].cost[currColor]}</div>`;
                    }
                }
                if (level == 3) {
                    cards3.splice(i, 1, new Card(undefined, 3));
                    displayCards(board);
                }else if (level == 2) {
                    cards2.splice(i, 1, new Card(undefined, 2));
                    displayCards(board);
                }else if (level == 1) {
                    cards1.splice(i, 1, new Card(undefined, 1));
                    displayCards(board);
                }
            }
        }
        curPlaySpace.children[0].addEventListener("click", function(e) {
            if (e.target.classList.contains("buy-button")) {
                if (curPlaySpace.parentElement.classList[1] == currentPlayer) {
                    buyCard(hands[currentPlayer], e.target.parentElement.parentElement, true);
                } else {
                    modal.style.display = "block";
                    document.querySelector("#feedback").style.display = "flex";
                    document.querySelector("#feedback .modal-text").innerHTML = "<h4>Not Your Card</h4><p>You may only buy your own reserved card.</p>";
                }
            } else if (e.target.classList.contains("gold-button")) {
                if (curPlaySpace.parentElement.classList[1] == currentPlayer && !player.gold ) {
                    modal.style.display = "block";
                    document.getElementById("select-gold").style.display = "flex";
                } else if (curPlaySpace.parentElement.classList[1] != currentPlayer) {
                    modal.style.display = "block";
                    document.querySelector("#feedback").style.display = "flex";
                    document.querySelector("#feedback .modal-text").innerHTML = "<h4>Not Your Gold</h4><p>Use gold from your own reserve space.</p>";
                } else {
                    modal.style.display = "block";
                    document.querySelector("#feedback").style.display = "flex";
                    document.querySelector("#feedback .modal-text").innerHTML = "<h4>No Gold</h4><p>You have already used your gold.</p>";
                }
            }
        });

        cardActions();
        nextTurn();
    } else {
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Reserve Card</h4><p>You have already reserved a card.</p>";
    }
}

// take gems
function takeGems(player, gems){
    var take = false
    let gemColors = []
    for(let i=0; i<gems.length; i++){
        gemColors.push(window.getComputedStyle(gems[i]).backgroundColor);
    }
    let total = 0;
    for(let i=0; i<Object.keys(hands[currentPlayer]["gems"]).length; i++){
        total += hands[currentPlayer]["gems"][Object.keys(hands[currentPlayer]["gems"])[i]]
    }
    if (total == 90) {
        if (gemAmounts[reverseColorList[gemColors[0]]] > 0) {
            player.gems[Object.keys(colorList).find(key => colorList[key] == gemColors[0])] += 10;
            gemAmounts[reverseColorList[gemColors[0]]] -= 10;
            gems[0].innerHTML = gemAmounts[reverseColorList[gemColors[0]]];
            gems[0].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
            updatePlayers();
            nextTurn();
            take = true
        } 
    }
    if (total == 80 && gems.length == 2) {
        for(let i=0; i<gems.length; i++){
            if (gemAmounts[reverseColorList[gemColors[i]]] > 0) {
                player.gems[Object.keys(colorList).find(key => colorList[key] == gemColors[i])] += 10;
                gemAmounts[reverseColorList[gemColors[i]]] -= 10;
                gems[i].innerHTML = gemAmounts[reverseColorList[gemColors[i]]];
                updatePlayers();
                nextTurn();
                take = true;
            } 
        }
        for(let i=0; i<gems.length; i++){
            gems[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)";
        }
    }
    if(gems.length == 2 && gemColors[0] == gemColors[1]){
        if(gemAmounts[reverseColorList[gemColors[0]]] >= 40){
            player.gems[Object.keys(colorList).find(key => colorList[key] == gemColors[0])] += 20;
            gemAmounts[reverseColorList[gemColors[0]]] -= 20;
            gems[0].innerHTML = gemAmounts[reverseColorList[gemColors[0]]];
            gems[0].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
            total = 0;
            for(let i=0; i<Object.keys(hands[currentPlayer]["gems"]).length; i++){
                total += hands[currentPlayer]["gems"][Object.keys(hands[currentPlayer]["gems"])[i]]
            }
            if(total > 100){
                modal.style.display = "block"
                document.querySelector("#feedback").style.display = "flex"
                
                document.querySelector("#feedback .modal-text").innerHTML = "<h4>You Have Too Many Gems</h4><p>Players can have a maximum of 100 gems<br>(Excluding gems gained from gold)</p>"
                chosenGems = []
                gems[0].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
                player.gems[Object.keys(colorList).find(key => colorList[key] == gemColors[0])] -= 20;
                gemAmounts[reverseColorList[gemColors[0]]] += 20;
                gems[0].innerHTML = gemAmounts[reverseColorList[gemColors[0]]];
            }else{
                updatePlayers();
                nextTurn();
                take = true;
            }
        }else{
            modal.style.display = "block"
            document.querySelector("#feedback").style.display = "flex"
            
            document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Take Two of This Gem</h4><p>If a gem has less than 40 gems in the stack you cannot take two</p>"
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
            total = 0;
            for(let i=0; i<Object.keys(hands[currentPlayer]["gems"]).length; i++){
                total += hands[currentPlayer]["gems"][Object.keys(hands[currentPlayer]["gems"])[i]]
            }
            
            if(total > 100){
                modal.style.display = "block"
                document.querySelector("#feedback").style.display = "flex"
                
                document.querySelector("#feedback .modal-text").innerHTML = "<h4>You Have Too Many Gems</h4><p>Players can have a maximum of 100 gems</p>"
                chosenGems = []
                for(let i=0; i<gems.length; i++){
                    gems[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
                    player.gems[Object.keys(colorList).find(key => colorList[key] === gemColors[i])] -= 10;
                    gemAmounts[reverseColorList[gemColors[i]]] += 10;
                    gems[i].innerHTML = gemAmounts[reverseColorList[gemColors[i]]];
                }
            }else{
                updatePlayers();
                nextTurn();
                take = true;
            }
        }else{
            modal.style.display = "block"
            document.querySelector("#feedback").style.display = "flex"
            
            document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Take These Gems</h4>"
            chosenGems = []
            for(let i=0; i<gems.length; i++){
                gems[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)"
            }
        }
    }else if(gems.length > 2 ){
        modal.style.display = "block"
        document.querySelector("#feedback").style.display = "flex"
        document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Take These Gems</h4><p>You can take either one of three different colors of gems or two of the same color of gem</p>"
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
    return take;
}

for(let i=0; i<Object.keys(colorList).length; i++){
    document.getElementsByClassName(`gem ${Object.keys(colorList)[i]}`)[0].addEventListener("click", function(e){
        e.target.style.boxShadow = `0 0 10px 5px rgb(188, 188, 188)`
        chosenGems.push(e.target)
        takeGems(hands[currentPlayer], chosenGems)
    })
}

// purchase cards
// player: int, current player
// card: object, card trying to be bought
// reserved: booleon, true if purchasing from reserved spot
function buyCard(player, card, reserved){
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
                    modal.style.display = "block";
                    document.querySelector("#feedback").style.display = "flex";
                    document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Buy Card</h4><p>You do not wealth required to buy this development card.</p>";
                }
            }
        }
    } else {
        let afford = checkAfford(player, player["reserved"])
        if (afford && player["gold"]) {
            returnGems(player, player["reserved"])
            player["cards"][player["reserved"]["color"]] ++;
            let curPlaySpace = reserveSpace[currentPlayer]
            curPlaySpace.style.backgroundColor = "rgba(0, 0, 0, 0)";
            curPlaySpace.style.border = "4px dashed white"
            curPlaySpace.innerHTML = ""
            player["reserved"] = false;
            updatePlayers();
            nextTurn();
        } else if(!player["gold"]){
            modal.style.display = "block";
            modalHeader.innerText = "Use Gold Before Purchasing"
            document.getElementById("select-gold").style.display = "flex";
        } else {
            modal.style.display = "block";
            document.querySelector("#feedback").style.display = "flex";
            document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Buy Card</h4><p>You do not have the wealth required to buy this development card.</p>";
        }
    }
    
}

function checkAfford(player, card) {
    let afford = false
    for(let j=0; j<Object.keys(card["cost"]).length; j++){
        let currColor = Object.keys(card["cost"])[j];
        if(player["gems"][currColor] >= (card["cost"][currColor] - player["cards"][currColor]*10) ){
            afford = true;
        }else{
            console.log("can't afford")
            afford = false;
            break;
        }
    }
    return afford;
}

function returnGems(player, card) {
    for(let j=0; j<Object.keys(card["cost"]).length; j++){
        let currColor = Object.keys(card["cost"])[j]
        if(!((card["cost"][currColor] - player["cards"][currColor]*10) < 0)){
            player["gems"][currColor] -= (card["cost"][currColor] - player["cards"][currColor]*10)
        }

        if (player["gold"] == currColor) {
            if(!((card["cost"][currColor] - 10 - player["cards"][currColor]*10) < 0)){
                gemAmounts[currColor] += (card["cost"][currColor] - 10 - player["cards"][currColor]*10)
                player["gold"] = false
            }
        } else {
            if(!((card["cost"][currColor] - player["cards"][currColor]*10) < 0)){
                gemAmounts[currColor] += (card["cost"][currColor] - player["cards"][currColor]*10)
            }
        }

        document.querySelector(`.gem.${currColor}`).innerHTML = gemAmounts[currColor];
    }
    player["pp"] += card["points"]
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
            if(nobles[i]["cost"][currColor] > 0){
                nobleHTML[i].children[0].children[1].innerHTML = nobleHTML[i].children[0].children[1].innerHTML + `<div class="${currColor} cost">${nobles[i].cost[currColor]}</div>`;
            }
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
        modal.style.display = "block"
        document.querySelector("#feedback").style.display = "flex"
        document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Attract Noble</h4><p>You may only have one noble at a time.</p>"
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
                    modal.style.display = "block";
                    document.querySelector("#feedback").style.display = "flex";
                    document.querySelector("#feedback .modal-text").innerHTML = "<h4>Cannot Attract Noble</h4><p>You do not wealth required to attract this noble.</p>";
                }
            }
        }
    }
}

const modalGems = document.getElementsByClassName("select-gem");
for (let i = 0; i < modalGems.length; i++) {
    modalGems[i].addEventListener("click", (e) => {
        useGold(hands[currentPlayer], e.target.classList[1])
        
    })
}
function useGold(player, color) {
    player["gems"][color] += 10;
    player["gold"] = color;
    gemAmounts["gold"]++;
    document.querySelector(`.gem.gold`).innerHTML = gemAmounts["gold"];
    updatePlayers();

    modalHeader.innerText = "";
    modal.style.display = "none";
    for (let i = 0; i < modalSections.length; i++) {
        modalSections[i].style.display = "none";
    }
}

function nobleAttack(attacker, defender){
    let newNpD = defender["np"] - attacker["np"];
    let differenceD = defender["np"] - newNpD
    let newNpA = attacker["np"] - defender["np"];
    let differenceA = attacker["np"] - newNpA
    defender["pp"] -= differenceD;
   
    if(newNpD < 0){
        defender["np"] = 0
    }else{
        defender["np"] = newNpD
    }
    attacker["pp"] -= differenceA;
    if(newNpA < 0){
        attacker["np"] = 0
    }else{
        attacker["np"] = newNpA
    }
    updatePlayers();
    nextTurn();
}

function checkWin(player){
    if(player["pp"] >= winPoints){
        modal.style.display = "block"
        document.querySelector(".win").style.display = "flex"
        document.querySelector(".win .modal-text").style.display = "block"
        document.querySelector(".win .modal-text").style.textAlign = "center"
        document.querySelector(".win .modal-text").innerHTML = `<h4>Congratulations!</h4><p>Player ${currentPlayer+1} Won!</p>`
        return true
    }
}

function checkPrice(obj, type) {
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        if (!(hands[currentPlayer][type] >= obj[keys[i]])) {
            return false;
        }
    }
    return true;
}

// show cards, only works on smaller screens
let stacks = document.querySelectorAll(".face-down, .noble-stack, .card-deck")
function clickStack(e) {
    
    if (window.outerWidth <= 950) {
        for (let i = 0; i < stacks.length; i++) {
            stacks[i].style.display = "none"
        }
        if (e.slice(-1) > 0) {
            for (let i = 0; i < document.querySelectorAll(`.${e}.used`).length; i++) {
                document.querySelectorAll(`.${e}.used`)[i].style.display = "block"
            }
        } else {
            document.querySelectorAll(`.${e}`)[3].style.display = "block"
            document.querySelectorAll(`.${e}`)[4].style.display = "block"
        }
        document.getElementById("back-button").style.display = "block"
    } 
}

document.getElementById("back-button").addEventListener("click", function() {
    document.getElementById("back-button").style.display = "none"
    if (document.querySelectorAll(`.noble`)[3].style.display == "block") {
        document.querySelectorAll(`.noble`)[3].style.display = "none"
        document.querySelectorAll(`.noble`)[4].style.display = "none"
    } else if(document.querySelectorAll(".level-3.used")[0].style.display == "block") {
        for (let i = 0; i < document.querySelectorAll(`.level-3.used`).length; i++) {
            document.querySelectorAll(`.level-3.used`)[i].style.display = "none"
        }
    } else if(document.querySelectorAll(".level-2.used")[0].style.display == "block") {
        for (let i = 0; i < document.querySelectorAll(`.level-2.used`).length; i++) {
            document.querySelectorAll(`.level-2.used`)[i].style.display = "none"
        }
    } else {
        for (let i = 0; i < document.querySelectorAll(`.level-1.used`).length; i++) {
            document.querySelectorAll(`.level-1.used`)[i].style.display = "none"
        }
    }
    for (let i = 0; i < stacks.length; i++) {
        stacks[i].style.display = "flex"
    }
})

for (let i = 0; i < stacks.length; i++) {
    stacks[i].addEventListener("click", function(e){
        let stack = e.target.classList[1]
        clickStack(stack)
    });
}

// window.addEventListener("resize", function() {
//     console.log(window.outerWidth)
//     if (window.outerWidth > 950) {
//         for (let i = 0; i < stacks.length; i++) {
//             stacks[i].style.display = "flex"
//         }
//         for (let j = 0; j < 3; j++) {
//             for (let i = 0; i < document.querySelectorAll(`.level${j}.used, .noble`); i++) {
//                 document.querySelectorAll(`level${j}`).style.display = "block"
//             }
//         }
//     } 
// })

async function cpuTurn(){
    let player = hands[currentPlayer];
    const attackChance = Math.ceil(Math.random()*10)
    let attackable = [];
    for(let hand in hands){
        if(hand["attackable"]){
            attackable.push(hand)
        }
    }

    let total = 0

    for (let i = 0; i < Object.keys(player["gems"]).length; i++) {
        total += Object.values(player["gems"])[i]
    }

    let ranNum = Math.floor(Math.random()*4);
    let ranLevel = Math.ceil(Math.random()*3)
    let gemTake = Math.ceil(Math.random()*2+1);
    let gemsTaken;

    if(total == 90){
        gemTake = 1
        selectColors(1)
    }else if(total == 80){
        gemTake = 2
    }else if(total == 100){
        gemTake = false
    }


    if(gemTake === 3){
        gemsTaken = selectColors(3)
    }else {
        gemsTaken = selectColors(1)
    } 

    for (let i = 0; i < gemsTaken.length; i++) {
        if (gemAmounts[gemsTaken[i]] == 0) {
            gemTake = false;
        }
    }

    let reservedCard = false;
    if (player["reserved"]) {
        reservedCard = checkAfford(player, player["reserved"])
    }
    if (player["gold"]) {
        console.log("use gold")
        useGold(player, gemsTaken[0]);
    }

    console.log("Tyler Fursman is very cool and aweseome!")
    if(attackChance == 10 && (player["np"] > 0)){
        console.log("attack")

        modal.style.display = "block"
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} attacked a player</p>`;

        await sleep(2500);
        modal.style.display = "none"
        nobleAttack(player, attackable[Math.floor(Math.random()*attackable.length)]);
    }else if(checkPrice(nobles[0], "cost")){
        console.log("noble1")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} attracted a noble</p>`;

        await sleep(2500);
        modal.style.display = "none"
        attractNobles(player, nobles[0]);
    }else if(checkPrice(nobles[1], "cost")){
        console.log("noble2")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} attracted a noble</p>`;

        await sleep(2500);
        modal.style.display = "none"
        attractNobles(player, nobles[1]);
    }else if(player["reserved"] && reservedCard){
        console.log("buy reserve")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought their reserve card</p>`;

        await sleep(2500);
        modal.style.display = "none";
        buyCard(player, document.getElementsByClassName("empty-card")[currentPlayer], true);
    }else if(checkAfford(player, board[3][ranNum])){
        console.log("buy3")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought a level 3 card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        buyCard(player, document.querySelectorAll(".level-3.used")[ranNum], false)
    }else if(checkAfford(player, board[2][ranNum])){
        console.log("buy2")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought a level 2 card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        buyCard(player, document.querySelectorAll(".level-2.used")[ranNum], false)
    }else if(checkAfford(player, board[1][ranNum])){
        console.log("buy1")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought a level 1 card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        buyCard(player, document.querySelectorAll(".level-1.used")[ranNum], false)
    }else if(gemTake == 3 ){
        console.log("gem3")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} collected three gems</p>`;

        await sleep(2500);
        modal.style.display = "none"
        console.log(`going to take ${gemsTaken}`)
        takeGems(player, [document.querySelector(`.gem.${gemsTaken[0]}`), document.querySelector(`.gem.${gemsTaken[1]}`), document.querySelector(`.gem.${gemsTaken[2]}`)]);
    }else if(gemTake == 2 && gemAmounts[gemsTaken[0]] > 30){
        console.log("gem2")

        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} collected two gems</p>`;

        await sleep(2500);
        modal.style.display = "none"
        console.log(`going to take ${gemsTaken}`)
        takeGems(player, [document.querySelector(`.gem.${gemsTaken[0]}`), document.querySelector(`.gem.${gemsTaken[0]}`)]);
    }else if(gemTake == 1) {
        console.log("gem1")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} collected one gem</p>`;
        
        await sleep(2500);
        modal.style.display = "none"
        console.log(`going to take ${gemsTaken}`)
        takeGems(player, [document.querySelector(`.gem.${gemsTaken[0]}`)]);
    }else if(checkAfford(player, board[1][0])){
        console.log("final check, buy(0)")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought a level 1 card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        buyCard(player, document.querySelectorAll(".level-1.used")[0], false)
    }else if(checkAfford(player, board[1][1])) {
        console.log("final check, buy(1)")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought a level 1 card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        buyCard(player, document.querySelectorAll(".level-1.used")[1], false)
    }else if(checkAfford(player, board[1][2])) {
        console.log("final check, buy(2)")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought a level 1 card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        buyCard(player, document.querySelectorAll(".level-1.used")[2], false)
    }else if(checkAfford(player, board[1][3])) {
        console.log("final check, buy(3)")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} bought a level 1 card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        buyCard(player, document.querySelectorAll(".level-1.used")[3], false)
    }else if(!player["reserved"]) {
        console.log("reserve")
        modal.style.display = "block";
        document.querySelector("#feedback").style.display = "flex";
        document.querySelector("#feedback .modal-text").innerHTML = `<h4>CPU ${currentPlayer} Ended Turn</h4><p>CPU ${currentPlayer} reserved a card</p>`;

        await sleep(2500);
        modal.style.display = "none"
        reserveCard(player, document.querySelectorAll(`.level-${ranLevel}.used`)[ranNum]);
    }else {
        console.log("cpu stuck")
        nextTurn();
    }
}

function sleep(ms) {
    console.log("timeout" + ms)
    return new Promise((resolve) => setTimeout(resolve, ms));
}