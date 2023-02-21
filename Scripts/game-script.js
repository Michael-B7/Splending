window.addEventListener("resize", function() {
    console.log(window.outerHeight)
})

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
    let curPlaySpace = reserveSpace[currentPlayer - 1]
    curPlaySpace.style.backgroundColor = "rgba(0, 0, 0, 0)";
    curPlaySpace.style.border = "4px dashed white"
    console.log(curPlaySpace.style.border)
    console.log("test")
    nextTurn()
});

