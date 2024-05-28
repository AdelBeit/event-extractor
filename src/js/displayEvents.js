
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