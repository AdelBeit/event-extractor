var cal = ics();
function createEvent(eventObject) {
  let calEvent = calEventAdapter(eventObject);
  cal.addEvent(...Object.values(calEvent));
}

function createEvents(events) {
  events.forEach((e, _i) => {
    createEvent(e);
  });
}

fileLoadedCheck();
