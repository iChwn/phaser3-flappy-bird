function randomNumber(min,max) {
  return Math.floor((Math.random())*(max-min+1))+min;
}

let score = 0;
function counter(pointElement) {
  var i = 0;
  // This block will be executed 100 times.
  setInterval(function() {
    if (i == 100) clearInterval(this);
    i++
    pointElement.setText('Score: ' + i);
    pointElement.setDepth(2)
    // console.log(i)
    // if(i%2 == 0) {
    //   score+=1
    //   console.log("Score " +  score)
    // }
  }, 1000);
}

function msToS(milliseconds) {
  return Math.floor((milliseconds / 1000) % 60)
}