function updateProgressBar(progressBar, text , value) {
    value = Math.round(value);
    progressBar.querySelector(".progress__fill").style.width = `${value}%`;
    progressBar.querySelector(".progress__text").textContent = `${text + value}%`;
}
//sleep did not work switching to interval
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//sleep requires async function
async function forSleep(value, wait){
  for (let i = 0; i < value; i++) {
    await sleep(wait)
    // do extra shit here
  }
}

function beautyload(progressBar,text,value,wait){
  var i = 0;
  var intervalId;
  intervalId = setInterval(function() {
      updateProgressBar(progressBar, text, i)
      if(i >= value){
        clearInterval(intervalId);
      }
      i++;
  }, wait);
}


const myProgressBar4 = document.querySelector("#pr4");
const myProgressBar5 = document.querySelector("#pr5");
const myProgressBar6 = document.querySelector("#pr6");
const myProgressBar7 = document.querySelector("#pr7");
const myProgressBar8 = document.querySelector("#pr8");
const myProgressBar9 = document.querySelector("#pr9");
const myProgressBar10 = document.querySelector("#pr10");
const myProgressBar11 = document.querySelector("#pr11");

function skills_show() {
    var x = document.getElementById("theskills");
    var y = document.getElementById("skillsShow")
    if (y.style.display === "none") {
      y.style.display = "inline-block";
    } else {
      y.style.display = "none";
    }
    $(x).fadeIn();
    $(x).fadeIn("slow");
    $(x).fadeIn(3000);

    beautyload(myProgressBar4,"ICDL ", 75, 100)
    beautyload(myProgressBar5,"Wordpress ", 70, 110)
    beautyload(myProgressBar6,"HTML ", 70, 110)
    beautyload(myProgressBar7,"CSS ", 73, 105)
    beautyload(myProgressBar8,"JavaScript ", 65, 140)
    beautyload(myProgressBar9,"Editing ", 85, 95)
    beautyload(myProgressBar10,"Adobe Premiere ", 65, 140)
    beautyload(myProgressBar11,"Adobe AfterEffects ", 50, 145)

  }
  // not using this function anymore
  function skills_hide() {
    var x = document.getElementById("theskills");
    var y = document.getElementById("skillsShow")
    if (y.style.display === "none") {
      y.style.display = "inline-block";
    } else {
      y.style.display = "none";
    }
    $(x).fadeOut();
    $(x).fadeOut("slow");
    $(x).fadeOut(3000);
  }

const myProgressBar = document.querySelector("#pr1");
const myProgressBar2 = document.querySelector("#pr2");
const myProgressBar3 = document.querySelector("#pr3");

/* Example */
updateProgressBar(myProgressBar,"C# ", 84);
updateProgressBar(myProgressBar2,"Java(Android) ", 80);
updateProgressBar(myProgressBar3,"Python ", 86);