window.addEventListener("resize", function() {
    console.log(window.outerHeight)
})

const colors = ['red', 'blue', 'green', 'white', 'black'];
const players = document.getElementsByClassName("player");

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


let currentPlayer = 1;
// current player begins at player 1
// function will add 1 to current player
function nextTurn() {
    currentPlayer += 1;
    if(currentPlayer > players.length) {
        // resets back to start of index if past the last child
        currentPlayer = 1
    } 
    console.log(currentPlayer)
    playerGlow()
}

// sets all player box shadow to default
// current player's box is set with bright box shadow
function playerGlow() {
    for (let i = 0; i < players.length; i++) {
        players[i].style.boxShadow = "2px 2px 4px rgba(255, 255, 255, 0.25)";
    }
    players[currentPlayer - 1].style.boxShadow = "0 0 10px 2.5px #EDD534";
}
playerGlow();

// sets the reserve card space of current player to the color of selected card
// only runs if reserve space is empty
const reserveSpace = document.getElementsByClassName("empty-card")
function reserveCard(cardColor) {
    let curPlaySpace = reserveSpace[currentPlayer - 1]
    // rgba(0, 0, 0, 0) is empty background color
    // use (window.getComputedStyle() for background color
    if (window.getComputedStyle(curPlaySpace).backgroundColor == "rgba(0, 0, 0, 0)") {
        curPlaySpace.style.border = "none";
        curPlaySpace.style.backgroundColor = cardColor;
        nextTurn()
    }
}

document.getElementById("test").addEventListener("click", function() {
    // let curPlaySpace = reserveSpace[currentPlayer - 1]
    // curPlaySpace.style.backgroundColor = "rgba(0, 0, 0, 0)";
    // curPlaySpace.style.border = "4px dashed white"
    // console.log(curPlaySpace.style.border)
    // console.log("test")
    // nextTurn()
    // console.log(p1.gems);
});

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
    constructor(color, image, points, cost, level){
        this.color = color;
        this.image = image;
        this.points = points;
        this.cost = cost;
        this.level = level;
        this.calcPoints = function(level){
            const possPoints = {1:[0,0,0,0,0,0,0,1], 2:[1,1,2,2,2,3], 3:[3,4,4,5]};
            let cost;
            if(level == 1){
                cost = possPoints[1][Math.floor(Math.random() * possPoints[1].length)];
            }else if(level == 2){
                cost = possPoints[2][Math.floor(Math.random() * possPoints[2].length)];
            }else if(level == 3){
                cost = possPoints[3][Math.floor(Math.random() * possPoints[3].length)];
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

