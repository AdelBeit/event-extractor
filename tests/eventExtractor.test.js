const {
  getWeek,
  getStore,
  getDays,
  getDay,
} = require("../src/js/eventExtractor");

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
];

describe.only("getWeek", () => {
  test("extracts week when it's in this format: dd/dd/dddd - dd/dd/dddd", () => {
    const result = getWeek(dummyData[0]);
    expect(result).toBe("05/20/2024 - 05/26/2024");
  });

  test("returns null when date range is missing digits", () => {
    const result = getWeek("05/20/2024 - 05/20/202");
    expect(result).toBeNull();
  });

  test("returns null when it's missing a space", () => {
    const result = getWeek("05/20/2024-05/20/2024");
    expect(result).toBeNull();
  });

  test("returns null when an empty string is passed in", () => {
    const result = getWeek("");
    expect(result).toBeNull();
  });

  test("returns null when week is not found", () => {
    const result = getWeek("hello world");
    expect(result).toBeNull();
  });

  test("handles multiple date ranges, returning the first match", () => {
    const multipleDateRanges =
      "05/20/2024 - 05/26/2024 and 06/01/2024 - 06/07/2024";
    const result = getWeek(multipleDateRanges);
    expect(result).toBe("05/20/2024 - 05/26/2024");
  });

  test("can't discern when dates are swapped or week is invalid and will return it as it is", () => {
    const swappedDates = "26/05/2024 - 20/05/2024";
    const result = getWeek(swappedDates);
    expect(result).toBe("26/05/2024 - 20/05/2024");
  });
});

describe("getDay", () => {
  test("returns the first occurence of day from this regex /Mon |Tue |Wed |Thu |Fri |Sat |Sun /", () => {
    const line =
      "Today is Mon, but we also have Mon in the middle and at the end.";
    expect(getDay(line)).toBe("Mon");
  });

  test("returns null if day is not in 3 char format like mon", () => {
    const line =
      "Today is Monday.";
    expect(getDay(line)).toBeNull();
  });

  test("returns null if day is not capitalized", () => {
    const line =
      "Today is mon";
    expect(getDay(line)).toBeNull();
  });

  test("returns null if day is not followed by a space", () => {
    const line =
      "Today is mon, but we also have mon in the middle and at the end.";
    expect(getDay(line)).toBeNull();
  });
  
  test("returns the day when it's found", () => {
    const line = "Today is Mon , tomorrow is Tue, and the day after is Wed.";
    expect(getDay(line)).toBe("Mon");
  });

  test("returns null when no day is found", () => {
    const line = "There are no days in this string.";
    expect(getDay(line)).toBeNull();
  });

  test("returns null for an empty string", () => {
    expect(getDay("")).toBeNull();
  });

  test("returns null for a string with only whitespace", () => {
    expect(getDay("     ")).toBeNull();
  });

  test("returns null for a string with only non-day words", () => {
    const line = "Hello, world! This string has no days.";
    expect(getDay(line)).toBeNull();
  });

  test("returns null for a string with non-day characters", () => {
    const line = "There are no days in 123456.";
    expect(getDay(line)).toBeNull();
  });
});

describe("getStore", () => {
  test("extracts store number and the rest of the line starting from where this pattern is this found: ddddd", () => {
    expect(getStore(dummyData[0])).toBe("20088 - University Village South");
  });
});

describe("getDays", () => {
  test("returns an array of dates for a valid date range (inclusive)", () => {
    const dateRange = "05/20/2024 - 05/22/2024";
    const result = getDays(dateRange);
    expect(result).toEqual(["5/20/2024", "5/21/2024", "5/22/2024"]);
  });

  test("returns an array with a single date for a one-day range", () => {
    const dateRange = "05/20/2024 - 05/20/2024";
    const result = getDays(dateRange);
    expect(result).toEqual(["5/20/2024"]);
  });

  test("returns an empty array for an end date earlier than start date", () => {
    const dateRange = "05/22/2024 - 05/20/2024";
    const result = getDays(dateRange);
    expect(result).toBeNull();
  });

  test("returns an empty array for an invalid date range format", () => {
    const dateRange = "05/2024 - 05/22/2024";
    const result = getDays(dateRange);
    expect(result).toBeNull();
  });

  test("returns an empty array for a non-numeric date range", () => {
    const dateRange = "abc - xyz";
    const result = getDays(dateRange);
    expect(result).toBeNull();
  });

  test("returns an empty array for an empty string input", () => {
    const dateRange = "";
    const result = getDays(dateRange);
    expect(result).toBeNull();
  });
});
