var cal = ics();
function createEvent(eventObject) {
  let calEvent = calEventAdapter(eventObject);
  cal.addEvent(...Object.values(calEvent));
}

function createCal(events) {
  events.forEach((event, _i) => {
    if (event.isSelected && !event.isShift) createEvent(event);
  });
}

// create .ics & download
function download() {
  allExtractedWeeks.forEach((weekEvents) => createCal(weekEvents));
  cal.download("shift-schedule");
}

fileLoadedCheck();
