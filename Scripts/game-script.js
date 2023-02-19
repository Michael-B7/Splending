
window.addEventListener("resize", function() {
    console.log(window.outerHeight)
})

console.log(location.href);

console.log(document.getElementsByClassName("card"))
const cards = document.getElementsByClassName("card");

for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function() {
        console.log("yipeeee", this)
    })
    cards[i].addEventListener('mouseover', function(event) {
        console.log("wowowowowo")
        console.log(event.target)
        this.querySelector('.card-options').style.display = 'none';
        this.querySelector('.card-content').style.opacity = 1;
    });
}