var cal = ics();
function createEvent(e) {
  cal.addEvent(...Object.values(e));
}

function createEvents(events) {
  events.forEach((e, _i) => {
    createEvent(e);
  });
  cal.download('shift-schedule');
}

fileLoadedCheck();
