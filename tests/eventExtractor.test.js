const {getWeek,getStore} = require("../src/js/eventExtractor");

let dummyData = [
  `4:04 [ICT TORS
  05/20/2024 - 05/26/2024 |
  Mon 09:15 AM - 05:30 PM 7.75 hrs
  a Coverage, NonCoverage, Coverage
  © 20088 - University Village South
  Tue 11:00 AM - 04:30 PM 5.00 hrs
  @) a Coverage, NonCoverage
  © 20088 - University Village South
  Wed
  (2) - No Shift -
  Thu 09:15 AM - 05:00 PM 7.25 hrs
  (23) a Coverage, NonCoverage, Coverage
  © 20088 - University Village South
  Fri 12:15 PM - 04:45 PM 4.50 hrs
  © Coverage
  Q 20088 - University Village South
  Sat 07:30 AM - 04:00 PM 8.00 hrs
  (25) © Coverage
  Q 20088 - University Village South
  Sun No Shift -
  A 6 Claim Shifts
  & ® =
  Schedule Swap Shift Time Off More
  mT =`,
].map(s => s.toLowerCase());

describe("getWeek", () => {
  test("extracts week when its in this format: dd/dd/dddd - dd/dd/dddd", () => {
    expect(getWeek(dummyData[0])).toEqual(["05/20/2024", "05/26/2024"]);
  });
  test("returns null when date range is missing digits", () => {
    expect(getWeek("05/20/2024 - 05/20/202")).toBeNull();
  });
  test("returns null when it's missing a space", () => {
    expect(getWeek("05/20/2024-05/20/2024")).toBeNull();
  });
  test("returns null when empty string is passed in", () => {
    expect(getWeek("")).toBeNull();
  });
  test("returns null when week is not found", () => {
    expect(getWeek("hello world")).toBeNull();
  });
  test("handles multiple date ranges, returning the first match", () => {
    const multipleDateRanges =
      "05/20/2024 - 05/26/2024 and 06/01/2024 - 06/07/2024";
    expect(getWeek(multipleDateRanges)).toEqual(["05/20/2024", "05/26/2024"]);
  });
  test("can't discern when dates are swapped or week is invalid and will return it as it is", () => {
    const swappedDates = "26/05/2024 - 20/05/2024";
    expect(getWeek(swappedDates)).toEqual(["26/05/2024", "20/05/2024"]);
  });
});

describe.only("getStore", () => {
  test("extracts store number and the rest of the line starting from where this pattern is this found: ddddd", () => {
    expect(getStore(dummyData[0])).toBe('20088 - University Village South');
  });
});

