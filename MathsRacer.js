// JavaScript source code for Maths Racer - Produced by: Rob Fagg (RobFCode)

// Initial Variable Declarations:
const timeBy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

let numOfQuestions = document.getElementById("questionnum").value;
let timeLimit = document.getElementById("timeset").value * 60000;
let timesTables = [];
let answers = [];
let timer;
let cDown = 4;
let testtype = "multi";
let carSelected = 1;
let selectVisible = document.querySelector(".car-selection");
let answerCount = 0;

// Race Track Variables:
let raceStart = 0;
let champStart = 0;
let rtHeight = 640;
let rtFinish = 580;
let racerAmount = 0;
let champAmount = 0;

// Function to Toggle 'All' or 'None' of the Times Tables:
function TimesToggle() {
  let checkboxes = document.querySelectorAll(".timesselect");
  let which = document.getElementById("toggle-sel");
  if (which.innerHTML === "All") {
    for (const cb of checkboxes) {
      cb.checked = true;
    }
    which.innerHTML = "None";
  } else {
    for (const cb of checkboxes) {
      cb.checked = false;
    }
    which.innerHTML = "All";
  }
}

// Function to Toggle display of the Car Selection Menu:
function OpenCarSelection() {
  if (selectVisible.style.display === "block") {
    selectVisible.style.display = "none";
  } else {
    selectVisible.style.display = "block";
  }
}

// Function to select the new Car and update selected images and variable:
function SelectCar(num) {
  document.querySelector("#select-car").src = "./images/car" + num + ".png";
  document.querySelector("#racerlane").style.backgroundImage =
    "url('./images/car" + num + ".png')";
  selectVisible.style.display = "none";
  carSelected = num;
}

// Function to Update the Type of Test on change:
function UpdateType() {
  testtype = document.getElementById("testtype").value;
}

// Function to Update the Numnber of Questions on change:
function UpdateQuestions() {
  numOfQuestions = document.getElementById("questionnum").value;
}

// Function to Update the time limit when changed:
function UpdateTimeSet() {
  timeLimit = document.getElementById("timeset").value * 60000;
}

// Function to Generate and display the Questions wehn race starts:
function GenerateQuestions() {
  let numChecked = 0;
  for (let i = 2; i < 13; i++) {
    let ttname = i + "times";
    if (document.getElementById(ttname).checked) {
      timesTables.push(i);
      numChecked++;
    }
  }

  // If the player has selected some Times Tables - Start the Race:
  if (numChecked > 0) {

    // Work out Track Height etc...
    if (numOfQuestions > 10) {
      rtHeight += (numOfQuestions - 10) * 42;
      rtFinish = rtHeight - 60;
    }

    // Set Race Track Height:
    document.querySelector(".racer-cont-cols").style.height = rtHeight + "px";

    // Work out movement amounts for cars:
    racerAmount = (rtFinish - 136) / numOfQuestions;
    champAmount = (rtFinish - 136) / (document.getElementById("timeset").value * 60);

    // Disable the Options to prevent changing values:
    const mrsel = document.querySelectorAll(".mrsel");
    for (const sel of mrsel) {
      sel.disabled = true;
    }
    // Close the car selector if left open at Race Start:
    if (selectVisible.style.display === "block") {
      selectVisible.style.display = "none";
    }

    let toDisplay =
      "<p>Go!</p>";

    for (let i = 0; i < numOfQuestions; i++) {
      let randTab = Math.floor(Math.random() * timesTables.length);
      let randBy = Math.floor(Math.random() * timeBy.length);
      let answer = timeBy[randBy] * timesTables[randTab];

      if (testtype === "multi") {
        // Multiplication Questions
        answers[i] = [timeBy[randBy], timesTables[randTab], answer, "x"];
        toDisplay +=
          "<p><strong>" +
          timeBy[randBy] +
          " x " +
          timesTables[randTab] +
          '</strong> =<input pattern="[0-9]*" inputmode="numeric" type="text" size="3" maxlength="3" id="q' +
          (i + 1) +
          '" name="q' +
          (i + 1) +
          '" autocomplete="off" onblur="CheckAnswer(' + (i + 1) + ', ' + answer + ')"></p>';
      } else if (testtype === "div") {
        // Division Questions
        answers[i] = [answer, timesTables[randTab], timeBy[randBy], "/"];
        toDisplay +=
          "<p><strong>" +
          answer +
          " / " +
          timesTables[randTab] +
          '</strong> =<input pattern="[0-9]*" inputmode="numeric" type="text" size="3" maxlength="3" id="q' +
          (i + 1) +
          '" name="q' +
          (i + 1) +
          '" autocomplete="off" onblur="CheckAnswer(' + (i + 1) + ', ' + timeBy[randBy] + ')"></p>';
      } else if (testtype === "both") {
        // Mixture of Both Types
        if (Math.floor(Math.random() * 10) < 5) {
          answers[i] = [timeBy[randBy], timesTables[randTab], answer, "x"];
          toDisplay +=
            "<p><strong>" +
            timeBy[randBy] +
            " x " +
            timesTables[randTab] +
            '</strong> =<input pattern="[0-9]*" inputmode="numeric" type="text" size="3" maxlength="3" id="q' +
            (i + 1) +
            '" name="q' +
            (i + 1) +
            '" autocomplete="off" onblur="CheckAnswer(' + (i + 1) + ', ' + answer + ')"></p>';
        } else {
          answers[i] = [answer, timesTables[randTab], timeBy[randBy], "/"];
          toDisplay +=
            "<p><strong>" +
            answer +
            " / " +
            timesTables[randTab] +
            '</strong> =<input pattern="[0-9]*" inputmode="numeric" type="text" size="3" maxlength="3" id="q' +
            (i + 1) +
            '" name="q' +
            (i + 1) +
            '" autocomplete="off" onblur="CheckAnswer(' + (i + 1) + ', ' + timeBy[randBy] + ')"></p>';
        }
      }
    }

    // Send Questions to Screen, but hide until Green Lights:
    document.getElementById("mracer").style.display = "none";
    document.getElementById("mracer").innerHTML = toDisplay

    // Scroll the Player so that the Race Track is position at the top of the scroll position:
    document.getElementById("comms-section").scrollIntoView({behaviour: "smooth"});

    // Start the Timer:
    timer = setInterval(CountDown, 1000);

    // Hide and disable the Start Button:
    let startbtn = document.getElementById("start");
    startbtn.disabled = true;
    startbtn.style.opacity = 0;
    startbtn.style.cursor = "initial";

  } else {

    // If the player has not selected at least 1 times table - Display message:
    document.getElementById("mracer").innerHTML =
      '<p><strong><span style="color:#cc0000">You have not selected any Times Tables!</span></strong></p>';
  }
}

// Function to Run and Show the Countdown Timer:
function CountDown() {
  let cdownMessage = "";
  if (cDown > 1) {
    cdownMessage = "<strong>" + (cDown - 1) + "</strong>"
    if (cDown == 4) {
      document.getElementById("lights").style.backgroundPositionY = -46 + "px";
    } else if (cDown == 3) {
      document.getElementById("lights").style.backgroundPositionY = -92 + "px";
    } else {
      document.getElementById("lights").style.backgroundPositionY = -138 + "px";
    }
    cDown -= 1
  } else if (cDown == 1) {
    cdownMessage = "<strong>Go!</strong>"
    document.getElementById("lights").style.backgroundPositionY = -184 + "px";
    document.getElementById("comms-end").innerHTML = "<strong>Go Go Go!</strong>"
    document.getElementById("mracer").style.display = "block";
    document.getElementById("q1").focus();
    document.getElementById("comms-section").scrollIntoView({behaviour: "smooth"});
    // Display and enable the Finish Button:
    let finishbtn = document.getElementById("finish");
    finishbtn.disabled = false;
    finishbtn.style.opacity = 1;
    finishbtn.style.cursor = "pointer";
    let resetBtn = document.getElementById("reset");
    resetBtn.style.display = "inline-block";
    resetBtn.style.opacity = 1;
    resetBtn.style.cursor = "pointer";
    cDown -= 1000
    champStart += champAmount;
    document.getElementById("champlane").style.transform = "translateY(" + champStart + "px)";
  } else {
    timeLimit -= 1000;
    let mins = Math.floor((timeLimit % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeLimit % (1000 * 60)) / 1000);
    cdownMessage =
      '<strong>Time: <span style="color:red">' +
      mins +
      " Mins, " +
      seconds +
      " Secs</span></strong>";
    
    // Move champ car:
    champStart += champAmount;
    document.getElementById("champlane").style.transform = "translateY(" + champStart + "px)";
    
    if (timeLimit <= 0) {
      document.getElementById("comms-end").innerHTML = "You Lost!";
      CheckAnswers(answers, numOfQuestions);
      return;
    }
  }
  document.getElementById("comms").innerHTML = cdownMessage;
}

// Function to check the answers once Race Finished is Pressed or time runs out:
function CheckAnswers(answers, numOfQuests) {
  let correctAnswers = 0;
  let toDisplay = "<p>Your Results are as follows: </p>";
  document.getElementById("lights").style.backgroundPositionY = "-230px";
  clearInterval(timer);

  for (let i = 0; i < numOfQuests; i++) {
    toDisplay +=
      "<p>Q" +
      (i + 1) +
      ": <strong>" +
      answers[i][0] +
      " " +
      answers[i][3] +
      " " +
      answers[i][1] +
      " = ";

    let qId = "q" + (i + 1);
    if (document.getElementById(qId).value) {
      let userAnswer = document.getElementById(qId).value;
      if (answers[i][2] == userAnswer) {
        correctAnswers += 1;
        toDisplay +=
          '<span style="color:green">' + userAnswer + '</span></strong>';
      } else {
        toDisplay +=
          '<span style="color:red">' + userAnswer + '</span></strong>';
      }
    } else {.0
      toDisplay +=
        '<span style="color:grey">Empty!</strong></span>';
    }
    toDisplay += "</p>";
  }

  toDisplay +=
    "<p>You got " +
    correctAnswers +
    " out of " +
    numOfQuests +
    " Answers Correct!</p>";

  document.getElementById("mracer").innerHTML = toDisplay;
  document.getElementById("comms").innerHTML = "Race over!";
}

function CheckAnswer(qnum, ans) {
  const ansElement = document.getElementById("q" + qnum);
  if (ansElement.value) {
    if (ansElement.value == ans) {
      // Mark as Correct Answer:
      ansElement.style.background = "green";
      ansElement.disabled = true;
      answerCount += 1;
      raceStart += racerAmount;
      document.getElementById("racerlane").style.transform = "translateY(" + raceStart + "px)";
      if (answerCount == numOfQuestions) {
        document.getElementById("comms-end").innerHTML = "YOU WON!!";
        CheckAnswers(answers, numOfQuestions);
      }
    } else {
      // Mark as Wrong Answer:
      ansElement.style.background = "darkred";
    }
  } else {
    ansElement.style.background = "var(--second-color)";
  }
}

function RestartRace() {
  // Stop Timer and reset appropriate vairables:
  clearInterval(timer);
  answerCount = 0;
  raceStart = 0;
  champStart = 0;
  timesTables = [];
  answers = [];
  cDown = 4;
  rtHeight = 640;
  rtFinish = 580;
  racerAmount = 0;
  champAmount = 0;
  timeLimit = document.getElementById("timeset").value * 60000;
  numOfQuestions = document.getElementById("questionnum").value;
  // Re-position the cars:
  document.getElementById("champlane").style.transform = "translateY(" + champStart + "px)";
  document.getElementById("racerlane").style.transform = "translateY(" + raceStart + "px)";
  // Re-generate a new set of questions:
  GenerateQuestions();
}