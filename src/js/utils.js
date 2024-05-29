const LOG_FILE_NAMES = false;
const DEBUG_MODE = false;
var EDIT_MODE = false;

function fileLoadedCheck() {
  if (LOG_FILE_NAMES)
    console.log("loaded", document.currentScript.src.split("/").pop());
}

function log(...args) {
  if (DEBUG_MODE) console.log(args);
}

function toggleButtonUIHandler(button) {
  button.classList.toggle("active");
}

function updateStage(newStage) {
  [...document.querySelectorAll(`.${stage}-stage`)].map((node) =>
    node.classList.toggle("hidden")
  );
  [...document.querySelectorAll(`.${newStage}-stage`)].map((node) =>
    node.classList.toggle("hidden")
  );
  stage = newStage;
}

function shuffleArray(a) {
  return a.sort(() => Math.random() - 0.5);
}

function getProgressMessages() {
  return shuffleArray([
    "waking the mastrena",
    "refilling the ice",
    "replacing the cold brew keg",
    "mastrena entering rest mode",
    "customer is asking for a lid",
    "used the wrong milk",
    "remaking the drink",
    "unjamming the printer",
    "dumping the grounds drawer",
    "refilling the beans",
    "fetching syrup",
  ]);
}

function updateProgress(messages) {
  var message = messages.pop();
  let log = document.querySelector("#log");
  log.querySelector("label").textContent = message;
  let waitTime = Math.random() * 2000 + 2500;
  let interval = setInterval(() => {
    message = messages.pop();
    dots = "";
    log.querySelector("label").textContent = message;
    waitTime = Math.random() * 2000 + 2500;
    if (messages.length <= 0 || stage !== "recognition") {
      clearInterval(interval);
    }
  }, waitTime);
  let dots = "";
  let elipsesInterval = setInterval(() => {
    dots = dots === "..." ? "" : dots + ".";
    document.querySelector("#log label").textContent = message + dots;
    if (stage !== "recognition") {
      clearInterval(elipsesInterval);
    }
  }, 300);
}

/* adapter to turn event object to calendar object */
function calEventAdapter(eventObject) {
  let [shiftStart, shiftEnd] = eventObject.shift.split("-");
  let startDate = formatDateTime(eventObject.date, shiftStart);
  let endDate = formatDateTime(eventObject.date, shiftEnd);
  let shiftDuration = eventObject.duration;
  let location = eventObject.location;
  let event = {
    title: `Starbucks - ${location} - ${shiftDuration} hrs`,
    description: location,
    location: location.substr(8),
    start: startDate,
    end: endDate,
  };
  return event;
}

/* stopwatch decorator */
function stopwatchDecorator(functionToBeTimed) {
  var startTime = new Date();
  functionToBeTimed();
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000);
  const timerLabel = document.createElement("div");
  timerLabel.textContent = `Recognition completed in ${duration} seconds`;
  document.querySelector("#log").appendChild(timerLabel);
}

fileLoadedCheck();
