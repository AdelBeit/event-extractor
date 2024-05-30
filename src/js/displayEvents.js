/* eventObject: {day,date,shift,duration,location} */
function createDayCards(numCards) {
  let eventsContainer = document.querySelector("div.extracted-events");
  let cardTemplate = eventsContainer.querySelector(
    "div.events-day-container.template"
  );
  if (eventsContainer.childElementCount === numCards) return;
  if (!cardTemplate)
    console.log(
      "error: card template has been removed, but there aren't enough cards present"
    );
  cardTemplate.classList.remove("template");
  [...Array(numCards)].forEach((n, _i) => {
    eventsContainer.appendChild(cardTemplate.cloneNode(true));
  });
  eventsContainer.removeChild(cardTemplate);
  initCheckBoxes();
}

function updateDayCard(inputEvent, index) {
  let { isShift, isSelected, ...event } = { ...inputEvent };
  let eventContainer = document.querySelectorAll(
    ".extracted-events .events-day-container"
  )[index];
  event.date = new Date(event.date).getDate();
  for (let [key, value] of Object.entries(event)) {
    eventContainer.querySelector(`.events-${key}`).textContent = value;
  }
  if (isShift) {
    eventContainer.querySelector(".events-shift").textContent =
      event.shift.replace("-", " - ");
    eventContainer
      .querySelector(".events-shift-info")
      .classList.remove("hidden");
    eventContainer.querySelector(".events-no-shift").classList.add("hidden");
    eventContainer.setAttribute("isSelected", "");
    eventContainer.setAttribute("isShift", "");
  } else {
    eventContainer.querySelector(".events-shift-info").classList.add("hidden");
    eventContainer.querySelector(".events-no-shift").classList.remove("hidden");
    eventContainer.removeAttribute("isSelected");
    eventContainer.removeAttribute("isShift");
  }
  eventContainer.querySelector("input").checked = isShift;
}

function createEventWeek(weekEvents, fileName) {
  weekEvents = [...weekEvents];
  let weekDate = `${weekEvents[0].date} - ${weekEvents.slice(-1)[0].date}`;
  let newWeekOption = document.createElement("option");
  newWeekOption.textContent = weekDate;
  newWeekOption.value = fileName;
  let weekSelector = document.querySelector("select.week-selector");
  weekSelector.appendChild(newWeekOption);
}

function changeSelectedWeek(fileName) {
  allExtractedWeeks[fileName].forEach((event, _i) => {
    updateDayCard(event, _i);
  });
  displayImage(fileName);
}

function initImageReader() {
  imageReader = new FileReader();
  imageReader.onload = function () {
    let dataURL = imageReader.result;
    document.querySelector("img.original").src = dataURL;
  };
}

function displayImage(fileName) {
  imageReader.readAsDataURL(imageFiles[fileName]);
}

function initCheckBoxes() {
  let eventCards = document.querySelectorAll("div.events-day-container");
  [...eventCards].map((card, _i) => {
    let checkBox = card.querySelector("input");
    checkBox.addEventListener("change", (e) => {
      if (!card.hasAttribute("isShift")) return;
      checkBox.checked = !checkBox.checked;
      card.toggleAttribute("isSelected");
      allExtractedWeeks[selectedWeek][_i].isSelected = checkBox.checked;
    });
    checkBox.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      if (!card.hasAttribute("isShift")) return;
      checkBox.checked = !checkBox.checked;
    });
    card.addEventListener("click", (e) => {
      if (!card.hasAttribute("isShift")) return;
      checkBox.dispatchEvent(new Event("change"));
    });
  });
}
