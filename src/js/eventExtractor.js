const extractor = {};

// new plan: string.replaceAll('\n'). 
// split string into array pieces with each pieces starting with day , or week range for the first one
// then split those pieces into smaller details for time of day and day itself for processing into ics

extractor.getWeek = (line) => {
  const pattern = /\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}/;
  const i = line.search(pattern);
  if (i !== -1) {
    let week = line.substr(i, 23).split(" - ");
    return week;
  }
  console.warning("no week found");
  return null;
};

extractor.getShiftDay = (line) =>{
  const d = line.substr(0,3);
  const pattern = /\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}/;
  const i = line.search(pattern);
  if (i !== -1) {
    let week = line.substr(i, 23).split(" - ");
    return week;
  }
  console.warning("can't find a valid day");
  return null;
}

extractor.getDay = (line) => {
  return;
}
extractor.getDay = (line) => {
  return;
}
extractor.getStore = (line) => {
  // matches 'ddddd'
  const pattern = /\d{5}/;
  const i = line.search(pattern);
  console.log(line,i);
  if(i!==-1){
    let storeNumber = line.substr(i);
    return storeNumber;
  }
  console.warning("can't find store number");
  return null;
}

// Expose the function for testing if in a Node environment
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = extractor;
}
