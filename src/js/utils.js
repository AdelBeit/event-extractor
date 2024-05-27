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
  document.querySelector(`#${stage}-stage`).classList.toggle("hidden");
  document.querySelector(`#${newStage}-stage`).classList.toggle("hidden");
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
    if (messages.length <= 0) {
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

/* eventObject: {day,date,shift,duration,location} */
function createDayCard(eventObject) {
  let eventsContainer = document.querySelector("div.extracted-events");
  let cardTemplate = eventsContainer.querySelector("div.template");
  let newCard = cardTemplate.cloneNode(true);
  eventObject.date = new Date(eventObject.date).getDate();
  let { isShift } = eventObject;
  Object.entries(eventObject).forEach(([key, val], _i) => {
    if (key !== "isShift")
      newCard.querySelector(`.events-${key}`).textContent = val;
  });
  if (isShift) {
    newCard.querySelector(".events-shift").textContent =
      eventObject.shift.replace("-", " - ");
    newCard.querySelector(".events-shift-info").classList.remove("hidden");
    newCard.querySelector(".events-no-shift").classList.add("hidden");
    newCard.setAttribute("data-noShift", false);
  }
  eventsContainer.appendChild(newCard);
}

function updateDayCard(event, index) {
  event = { ...event };
  let eventContainer = document.querySelectorAll(
    ".extracted-events .events-day-container"
  )[index];
  let { isShift } = event;
  event.date = new Date(event.date).getDate();
  for (let [key, value] of Object.entries(event)) {
    if (key === "isShift") continue;
    eventContainer.querySelector(`.events-${key}`).textContent = value;
  }
  if (isShift) {
    eventContainer.querySelector(".events-shift").textContent =
      event.shift.replace("-", " - ");
    eventContainer
      .querySelector(".events-shift-info")
      .classList.remove("hidden");
    eventContainer.querySelector(".events-no-shift").classList.add("hidden");
    eventContainer.setAttribute("data-noShift", false);
  } else {
    eventContainer.querySelector(".events-shift-info").classList.add("hidden");
    eventContainer.querySelector(".events-no-shift").classList.remove("hidden");
    eventContainer.setAttribute("data-noShift", true);
  }
}

function createEventWeek(weekEvents, index) {
  weekEvents = [...weekEvents];
  let weekDate = `${weekEvents[0].date} - ${weekEvents.slice(-1)[0].date}`;
  let newWeekOption = document.createElement("option");
  newWeekOption.textContent = weekDate;
  newWeekOption.value = index;
  let weekSelector = document.querySelector("select.week-selector");
  weekSelector.appendChild(newWeekOption);
}

function changeSelectedWeek(index) {
  allExtractedWeeks[index].forEach((event, _i) => {
    updateDayCard(event, _i);
  });
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
