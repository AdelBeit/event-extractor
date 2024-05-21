// Demo
var cal = ics();
function createEvent(e) {
  cal.addEvent(Object.values(e));
}

function createEvents(events) {
  var icsCOMPLETE = false;
  events.forEach((e, _i) => {
    createEvent(e);
  });
  icsCOMPLETE = true;
}

// cal = ics();
// cal.addEvent(
//   "Christmas",
//   "Christian holiday celebrating the birth of Jesus Christ",
//   "Bethlehem",
//   "12/25/2013",
//   "12/25/2013"
// );
// cal.addEvent(
//   "Christmas",
//   "Christian holiday celebrating the birth of Jesus Christ",
//   "Bethlehem",
//   "12/25/2014",
//   "12/25/2014"
// );
// cal.addEvent(
//   "New Years",
//   "Watch the ball drop!",
//   "New York",
//   "01/01/2015",
//   "01/01/2015"
// );
// cal.addEvent(
//   "New Years",
//   "Watch the ball drop!",
//   "New York",
//   "01/01/2016",
//   "01/01/2016"
// );

// cal_single = ics();
// cal_single.addEvent(
//   "Best Day",
//   "This is the best day to demonstrate a single event.",
//   "New York",
//   "11/12/1987",
//   "11/12/1987"
// );

// You can use this for easy debugging
makelogs = function (obj) {
  console.log("Events Array");
  console.log("=================");
  console.log(obj.events());
  console.log("Calendar With Header");
  console.log("=================");
  console.log(obj.calendar());
};

/* ------------------------------------------ */
/* ------- Google calendar events ----------- */
/* ------------------------------------------ */
function generateGoogleCalendarURLs(events) {
  const baseURL = "https://calendar.google.com/calendar/u/0/r/eventedit";

  // Function to parse date and time strings into a Date object
  const parseDateTime = (dateStr, timeStr) => {
    const [month, date, year] = dateStr.split("/").map(Number);
    const [startTime, endTime] = timeStr.split(" - ");
    const parseTime = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (modifier === "pm" && hours !== 12) hours += 12;
      if (modifier === "am" && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const { hours: startHours, minutes: startMinutes } = parseTime(startTime);
    const { hours: endHours, minutes: endMinutes } = parseTime(endTime);

    const startDate = new Date(year, month - 1, date, startHours, startMinutes);
    const endDate = new Date(year, month - 1, date, endHours, endMinutes);

    return { date: startDate, time: endDate };
  };

  // Format dates to Google Calendar format
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const urls = events.map((event) => {
    const { date, time } = parseDateTime(event.startDate, event.time);

    const dateString = formatDate(date);
    const timeString = formatDate(time);

    const url = new URL(baseURL);
    url.searchParams.set("dates", `${dateString}/${timeString}`);
    url.searchParams.set("text", event.title);
    url.searchParams.set("details", event.description);

    return url.toString();
  });

  return urls;
}

// Example usage:
const events = [
  {
    date: "05/22/2024",
    time: "06:30 pm - 08:30 pm",
    title: "store 20088",
    description: "Here we go again",
  },
  {
    date: "05/23/2024",
    time: "06:30 pm - 08:30 pm",
    title: "Here we go again",
    description: "Here we go again",
  },
  // Add more events as needed
];

const urls = generateGoogleCalendarURLs(events);
console.log(urls);
