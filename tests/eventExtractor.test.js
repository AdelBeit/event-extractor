const {
  getIndex,
  process,
  getWeek,
  getDays,
  getDay,
  getStoreInfo,
  getShift,
  getShiftDuration,
  formatDateTime,
  preProcess,
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
  `05/20/2024 - 05/26/2024 |
    Mon 09:15 AM - 05:30 PM 7.75 hrs
    a Coverage, NonCoverage, Coverage
    © 20088 - University Village South
    Tue 11:00 AM - 04:30 PM 5.00 hrs
    @) a Coverage, NonCoverage
    © 20088 - University Village South
    Wed`,
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
    Schedule Swap Shift Time Off More
    mT =`,
  "Sat 07:30 AM - 04:00 PM 8.00 hrs (25) © Coverage Q  20088 - University Village South Schedule Swap Shift Time Off More mT =",
  "Sat 8.00 hrs (25) © Coverage Q  20088 - University Village South Schedule Swap Shift Time Off More mT =",
];

describe.only("preProcess", () => {
  test("cleanup text", () => {
    const text = `Sat 8.00 hrs (25)
A 2 Claim Shifts
© Coverage Q
20088 - University Village South Schedule Swap Shift Time Off More mT =`;
    const check =
      "Sat 8.00 hrs (25) © Coverage Q 20088 - University Village South ";
    const result = preProcess(text);
    expect(result).toBe(check);
  });
  test("will return the same text if there's nothing to clean ", () => {
    const text = "waldo";
    const check = "waldo";
    const result = preProcess(text);
    expect(result).toBe(check);
  });
});

describe("getIndex", () => {
  test("return the index of the key when it's found", () => {
    const key = "waldo";
    const text = "waldo is here";
    const result = getIndex(text, key);
    expect(result).toBe(0);
  });
  test("will return -1 when key is not found in text", () => {
    const key = "waldo";
    const text = "he's not here";
    const result = getIndex(text, key);
    expect(result).toBe(-1);
  });
});

describe("getWeek", () => {
  test("extracts week when it's in this format: dd/dd/dddd - dd/dd/dddd", () => {
    const result = getWeek(dummyData[0]);
    expect(result).toBe("05/20/2024 - 05/26/2024");
  });

  test("throw error when date range is missing digits", () => {
    const result = () => getWeek("05/20/2024 - 05/20/202");
    expect(result).toThrow();
  });

  test("throw error when date range is missing spaces", () => {
    const result = () => getWeek("05/20/2024-05/20/2024");
    expect(result).toThrow();
  });

  test("throw error when an empty string is passed in", () => {
    const result = () => getWeek("");
    expect(result).toThrow();
  });

  test("throw error when week is not found", () => {
    const result = () => getWeek("hello world");
    expect(result).toThrow();
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

describe("getDays", () => {
  test("returns an array of dates for a valid date range (inclusive)", () => {
    const dateRange = "05/20/2024 - 05/22/2024";
    const result = getDays(dateRange);
    expect(result).toEqual(["05/20/2024", "05/21/2024", "05/22/2024"]);
  });

  test("returns an array with a single date for a one-day range", () => {
    const dateRange = "05/20/2024 - 05/20/2024";
    const result = getDays(dateRange);
    expect(result).toEqual(["05/20/2024"]);
  });

  test("throws an error for an end date earlier than start date", () => {
    const dateRange = "05/22/2024 - 05/20/2024";
    const result = () => getDays(dateRange);
    expect(result).toThrow();
  });

  test("throws an error for an invalid date range format", () => {
    const dateRange = "05/2024 - 05/22/2024";
    const result = () => getDays(dateRange);
    expect(result).toThrow();
  });

  test("throws an error for a non-numeric date range", () => {
    const dateRange = "abc - xyz";
    const result = () => getDays(dateRange);
    expect(result).toThrow();
  });

  test("throws an error for an empty string input", () => {
    const dateRange = "";
    const result = () => getDays(dateRange);
    expect(result).toThrow();
  });
});

describe("getDay", () => {
  test("returns the first occurence of a capitalized 3 char day name (i.e. Mon) that's followed by a space", () => {
    const line =
      "Today is Mon , but we also have Mon in the middle and at the end.";
    const result = getDay(line);
    expect(result).toBe("Mon");
  });

  test("throws an error because day is not followed by space", () => {
    const line = "Mon.";
    const result = () => getDay(line);
    expect(result).toThrow();
  });

  test("throws an error if no day is found", () => {
    const line = "Today is Monday.";
    const result = () => getDay(line);
    expect(result).toThrow();
  });
});

describe("getStoreInfo", () => {
  test("extracts store number and the rest of the line", () => {
    const text =
      "Sat 07:30 AM - 04:00 PM 8.00 hrs (25) © Coverage Q  20088 - University Village South Schedule Swap Shift Time Off More mT =";
    const result = getStoreInfo(text);
    expect(result).toBe(
      "20088 - University Village South Schedule Swap Shift Time Off More mT ="
    );
  });

  test("throws error when store number is not found", () => {
    const text =
      "Sat 07:30 AM - 04:00 PM 8.00 hrs (25) © Coverage Q  2008 - University Village South Schedule Swap Shift Time Off More mT =";
    const result = () => getStoreInfo(text);
    expect(result).toThrow();
  });
});

describe("getShift", () => {
  test("extracts shift info", () => {
    let text = "Sat 07:30 AM - 04:00 PM 8.00 hrs";
    let result = getShift(text);
    expect(result).toBe("07:30 AM-04:00 PM");
    text = "Sat 07:30 AM -04:00PM 8.00 hrs";
    result = getShift(text);
    expect(result).toBe("07:30 AM-04:00 PM");
  });

  test("throws error when shift info is not found or improperly formatted", () => {
    const text = "Sat 07:30 AM - 5:00 PM 8.00 hrs";
    const result = () => getShift(text);
    expect(result).toThrow();
  });
});

describe("getShiftDuration", () => {
  test("calculates shift duration given shift beginning and end times", () => {
    let shift = "07:30 AM - 04:00 PM";
    let result = getShiftDuration(shift);
    expect(result).toBe(8);
    shift = "07:30 AM -04:00 PM";
    result = getShiftDuration(shift);
    expect(result).toBe(8);
    shift = "09:30 AM - 02:15 PM";
    result = getShiftDuration(shift);
    expect(result).toBe(4.75);
    shift = "04:00 PM - 08:45 PM";
    result = getShiftDuration(shift);
    expect(result).toBe(4.75);
  });

  test("throws error when shift info is incorrectly formatted", () => {
    const shift = "07:30-04:00 PM";
    const result = () => getShiftDuration(shift);
    expect(result).toThrow();
  });

  test("throws error when one of the strings has more than just shift info", () => {
    const shift = "Sun 07:30 AM-04:00 PM";
    const result = () => getShiftDuration(shift);
    expect(result).toThrow();
  });
});

describe("formatDateTime", () => {
  test("return iso format when inputs are correct", () => {
    const date = "01/01/2020";
    const time = "07:30 AM";
    const result = formatDateTime(date, time);
    expect(result).toBe("2020-01-01T15:30:00.000Z");
  });

  test("throws error if date is in the wrong format", () => {
    const date = "01/01/020";
    const time = "07:30 AM";
    const result = () => formatDateTime(date, time);
    expect(result).toThrow();
  });

  test("throws error if time is in wrong format", () => {
    const date = "01/01/2020";
    const time = "07:30";
    const result = () => formatDateTime(date, time);
    expect(result).toThrow();
  });
});

// describe("process", () => {
//   test("extract events from tesseract ocr text body", () => {
//     const events = [{}];
//     const result = process(dummyData[1]);
//     expect(result).toBe("20088 - University Village South");
//   });
// });
