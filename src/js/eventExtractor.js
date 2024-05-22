var regex = {
  weekRange: new RegExp(/\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}/),
  mon: new RegExp(/Mon/),
  tue: new RegExp(/Tue/),
  wed: new RegExp(/Wed/),
  thu: new RegExp(/Thu/),
  fri: new RegExp(/Fri/),
  sat: new RegExp(/Sat/),
  sun: new RegExp(/Sun/),
  anyDay: new RegExp(/Mon |Tue |Wed |Thu |Fri |Sat |Sun /),
  shiftRange: new RegExp(/\d{2}:\d{2} (AM|PM) - \d{2}:\d{2} (AM|PM)/),
  storeInfo: new RegExp(/\d{5}/),
  noShift: new RegExp(/No Shift/),
  shift: new RegExp(/\d{2}:\d{2} (AM|PM)/),
  date: new RegExp(/\d{2}\/\d{2}\/\d{4}/),
};

var missingKeywordsInOCR = [];

function getIndex(text, key) {
  const i = text.search(key);
  if (i === -1) missingKeywordsInOCR.push(key);
  return i;
}

/* given an ocr body of text in the format that's returned by tesseractjs
 * process it into ical event format, this only works for starbucks picture formats right now
 * returns events[]
 * event: {title,description,location,start,end}
 */
function process(ocrText) {
  missingKeywordsInOCR = [];
  const text = ocrText.replaceAll("\n", "");
  let matchOrder = ["week", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  let keywordIndices = [];
  let extractedInfo = [];
  let extractedEvents = [];
  // extract all indices of keyword occurence
  for (let i = 0; i < matchOrder.length; i++) {
    let pattern = matchOrder[i];
    let index = getIndex(text, regex[pattern]);
    if (index < 0) {
      console.log(`couldn't find ${regex[pattern]}`);
      continue;
    }
    keywordIndices.push(index);
  }
  // extract all exerpts with keywords and separate them into an array
  let n = keywordIndices.length;
  keywordIndices.forEach((index, _i) => {
    // catch the last element
    if (_i === n - 1) {
      let from = keywordIndices[n - 1];
      let to = text.length;
      extractedInfo.push(text.substring(from, to));
      return;
    }
    let from = keywordIndices[_i];
    let to = keywordIndices[_i + 1];
    extractedInfo.push(text.substring(from, to).trim());
  });
  // initialize with a week from today in case week wasn't found in text
  let dateRange = getWeekRange();
  if (!missingKeywordsInOCR.includes("week"))
    // remove the week range and process it separately
    dateRange = getWeek(extractedInfo.shift());
  // get list of dates in week range
  let daysInWeek = getDays(dateRange);
  console.log(daysInWeek);
  // process each event exerpt
  // create event objects
  for (let i = 0; i < extractedInfo.length; i++) {
    let dayExerpt = extractedInfo[i];
    let dayOfTheWeek = getDay(dayExerpt).toLowerCase();
    if (missingKeywordsInOCR.includes(dayOfTheWeek)) continue;
    if (isShift(dayExerpt)) {
      console.log(i);
      let [shiftStart, shiftEnd] = getShift(dayExerpt).split(" - ");
      let startDate = formatDateTime(daysInWeek[i], shiftStart);
      let endDate = formatDateTime(daysInWeek[i], shiftEnd);
      let storeInfo = getStoreInfo(dayExerpt);
      let location = storeInfo.substr(8);
      let shiftDuration = getShiftDuration(shiftStart, shiftEnd);
      let event = {
        title: `Starbucks - ${location} - ${shiftDuration} hrs`,
        description: storeInfo,
        location: location,
        start: startDate,
        end: endDate,
      };
      extractedEvents.push(event);
    }
  }
  return extractedEvents;
}

/* returns 'mm/dd/yyyy - mm/dd/yyyy' */
function getWeek(line) {
  const pattern = regex["weekRange"];
  const i = line.search(pattern);
  if (i !== -1) {
    let week = line.substr(i, 23);
    return week;
  }
  throw "no week found";
}

/* dateRange: 'mm/dd/yyyy - mm/dd/yyyy'
 * date range must be a valid range going from date to date. if it's an invalid range this function will return null
 */
function getDays(dateRange) {
  const [start, end] = dateRange.split(" - ");
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates = [];
  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const formattedDate = new Intl.DateTimeFormat("en", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(date);
    dates.push(formattedDate);
  }

  if (dates.length < 1) {
    throw "wrong date range set in getDays";
  }

  return dates;
}

function getDay(line) {
  const pattern = regex["anyDay"];
  const i = line.search(pattern);
  if (i !== -1) {
    let day = line.substr(i, 3);
    return day;
  }
  throw "no day found";
}

function getStoreInfo(line) {
  // matches 'ddddd'
  const pattern = regex["storeInfo"];
  const i = line.search(pattern);
  if (i !== -1) {
    let storeInfo = line.substr(i);
    return storeInfo;
  }
  throw "can't find store number";
}

function isShift(line) {
  const pattern = regex["noShift"];
  const i = line.search(pattern);
  return i === -1;
}

/* returns shift range like so dd:dd AM/PM - dd:dd AM/PM */
function getShift(line) {
  const pattern = regex["shiftRange"];
  const i = line.search(pattern);
  if (i !== -1) {
    let shiftInfo = line.substr(i, 19);
    return shiftInfo;
  }
  throw "can't find shift info";
}

/* given a tuple [start,end] shift times, calculate duration between start and end time */
function getShiftDuration(shiftStart, shiftEnd) {
  if (
    shiftStart.search(regex["shift"]) === -1 ||
    shiftEnd.search(regex["shift"]) === -1
  )
    throw "invalid shift input, must be 'dd:dd (AM|PM)'";
  // dummy date not important for this usecase
  const d = "01/01/2020";
  const start = new Date(formatDateTime(d, shiftStart));
  const end = new Date(formatDateTime(d, shiftEnd));
  const lunchInMilliseconds = 30 * 60 * 1000;
  const durationInMilliseconds = end - start - lunchInMilliseconds;
  const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
  return durationInHours;
}

/* date: 'mm/dd/yyyy'
 * time: 'dd:dd AM' | 'dd:dd PM'
 * returns iso standard time for ical */
function formatDateTime(date, time) {
  if (date.search(regex["date"]) === -1)
    throw "invalid date input, must be 'mm/dd/yyyy'";
  if (time.search(regex["shift"]) === -1)
    throw "invalid shift input, must be 'dd:dd (AM|PM)'";
  let dateObject = new Date(`${date} ${time}`);
  let isoString = dateObject.toISOString();
  return isoString;
}

/* returns a date range from today to a week from today
 * this will be replaced when healing form is implemented
 */
function getWeekRange(firstDay = new Date()) {
  let afterOneWeek = new Date(new Date().setDate(firstDay.getDate() + 6));
  return `${firstDay.toLocaleDateString()} - ${afterOneWeek.toLocaleDateString()}`;
}

// Expose the function for testing if in a Node environment
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = {
    getIndex,
    process,
    getWeek,
    getDays,
    getDay,
    getStoreInfo,
    getShift,
    getShiftDuration,
    formatDateTime,
  };
} else {
  // browser related calls
  fileLoadedCheck();
}
