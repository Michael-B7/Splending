let indexValue = 1;
function tutorial(index) {
    shownStep(indexValue += index);
}

// parameter type: number
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


// const container = document.querySelector('.gamer-zone');
// const item1 = document.querySelector('#player-one');
// const item2 = document.querySelector('#player-two');

// const item1Parent = item1.parentNode;
// const item2Parent = item2.parentNode;

// const item1Index = Array.from(item1Parent.children).indexOf(item1);
// const item2Index = Array.from(item2Parent.children).indexOf(item2);
// console.log(item1Parent)
// console.log(item2Index)

// console.log(document.getElementById("player-one").previousElementSibling.previousElementSibling)
// document.getElementById("test").addEventListener("click", function() {
//     item1Parent.insertBefore(item2, container.children[item1Index]);
//     item2Parent.insertBefore(item1, container.children[item2Index]);
// });