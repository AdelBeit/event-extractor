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
};

function getIndex(text, key) {
  const i = text.search(regex[key]);
  if (i === -1) {
    console.log("no matches found in text for", key);
    return null;
  }
  return i;
}

function process(ocrText) {
  const text = ocrText.replaceAll("\n", "");
  let matchOrder = ["week", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  let keywordIndices = [];
  let extractedInfo = [];
  let extractedEvents = [];
  // extract all indices of keyword occurence
  matchOrder.forEach((pattern, _i) => {
    let index = getIndex(text, pattern);
    keywordIndices.push(index);
  });
  // extract all exerpts with keywords and separate them into an array
  let n = keywordIndices.length;
  keywordIndices.forEach((index, _i) => {
    // catch the last element
    if (_i === n - 1) {
      let from = keywordIndices[n - 1];
      let to = text.length;
      extractedInfo.push(text.substring(from, to - 1));
      return;
    }
    let from = keywordIndices[_i];
    let to = keywordIndices[_i + 1];
    extractedInfo.push(text.substring(from, to - 1).trim());
  });
  // process each event exerpt
  let dateRange = getWeek(extractedInfo.shift());
  if (dateRange === null) {
    console.log("invalid date range");
    return null;
  }
  // create event objects
  let daysInWeek = getDays(dateRange);
  extractedInfo.forEach((dayExerpt, _i) => {
    if (isShift(dayExerpt)) {
      let [shiftStart, shiftEnd] = getShift(dayExerpt).split(" - ");
      let startDate = formatDateTime(daysInWeek[_i], shiftStart);
      let endDate = formatDateTime(daysInWeek[_i], shiftEnd);
      let event = {
        title: "Work",
        description: getStoreInfo(dayExerpt),
        location: getStoreInfo(dayExerpt).substr(8),
        start: startDate,
        end: endDate,
      };
      extractedEvents.push(event);
    }
  });
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
  console.log("no week found");
  return null;
}

function getDay(line) {
  const pattern = regex["anyDay"];
  const i = line.search(pattern);
  if (i !== -1) {
    let day = line.substr(i, 3);
    return day;
  }
  console.log("no day found");
  return null;
}

function getStoreInfo(line) {
  // matches 'ddddd'
  const pattern = regex["storeInfo"];
  const i = line.search(pattern);
  if (i !== -1) {
    let storeInfo = line.substr(i);
    return storeInfo;
  }
  console.log("can't find store number");
  return null;
}

function isShift(line) {
  const pattern = regex["noShift"];
  const i = line.search(pattern);
  return i === -1;
}

function getShift(line) {
  const pattern = regex["shiftRange"];
  const i = line.search(pattern);
  if (i !== -1) {
    let shiftInfo = line.substr(i, 19);
    return shiftInfo;
  }
  console.log("can't find shift duration");
  return null;
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
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    dates.push(formattedDate);
  }

  if (dates.length < 1) {
    console.log("wrong date range set in getDays");
    return null;
  }

  return dates;
}

function formatDateTime(date, time) {
  let dateObject = new Date(`${date} ${time}`);
  let isoString = dateObject.toISOString();
  return isoString;
}

// Expose the function for testing if in a Node environment
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = {
    getWeekgetWeek,
    getDaygetDay,
    getDaysgetDays,
    getStoreInfogetStoreInfo,
    processprocess,
  };
}
fileLoadedCheck();
