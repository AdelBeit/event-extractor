var cal = ics();
function createEvent(eventObject) {
  let calEvent = calEventAdapter(eventObject);
  cal.addEvent(...Object.values(calEvent));
}

function createCal(events) {
  events.forEach((event, _i) => {
    if (event.isSelected && event.isShift) createEvent(event);
  });
}

// create .ics & download
function download() {
  function handleErrors(msg) {
    let errorNode = document.querySelector("button.error-events");
    errorNode.querySelector("span").textContent = msg;
    errorNode.classList.remove('hidden');
  }
  Object.keys(allExtractedWeeks).forEach((week) =>
    createCal(allExtractedWeeks[week])
  );
  if (cal.events().length === 0) {
    handleErrors('no events selected! Please select at least one event to download.')
    return;
  }
  ET('distributed');
  cal.download("shift-schedule");
}

fileLoadedCheck();
