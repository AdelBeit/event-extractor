var cal = ics();
function createEvent(e) {
  cal.addEvent(...Object.values(e));
  console.log('added event',cal.events());
}

function createEvents(events) {
  events.forEach((e, _i) => {
    createEvent(e);
  });
  console.log('events:',cal.events());
  console.log('downloading now');
  cal.download('shift-schedule');
}

fileLoadedCheck();
