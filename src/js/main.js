document.addEventListener("DOMContentLoaded", __main__);

var scheduler = undefined;
var stage = "upload";
var allExtractedWeeks = [];
var selectedWeek;

function __main__() {
  initTesseractScheduler();
  var input = document.querySelector(".upload-button input");

  input.addEventListener("change", fileInputChangeHandler);
  function fileInputChangeHandler(e) {
    let files = Object.values(this.files);
    // TODO: handle iphone screenshot file type conversion
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (
        !file.type.includes("bmp") &&
        !file.type.includes("jpg") &&
        !file.type.includes("jpeg") &&
        !file.type.includes("png") &&
        !file.type.includes("pbm") &&
        !file.type.includes("webp")
      ) {
        alert(
          `Invalid file type ${file.type}. Please select valid image files.`
        );
        return;
      }
    }

    try {
      initRecognition(this.files);
    } catch (e) {
      console.log(e);
    }
    
    // Firefox bug fix
    input.addEventListener("focus", function () {
      input.classList.add("has-focus");
    });
    input.addEventListener("blur", function () {
      input.classList.remove("has-focus");
    });
  }

  const editButton = document.querySelector("button.toggle-button.edit");
  editButton.addEventListener("click", (e) => {
    toggleButtonUIHandler(editButton);
    EDIT_MODE = !EDIT_MODE;
  });

  const weekSelector = document.querySelector("select.week-selector");
  weekSelector.addEventListener("change", () => {
    var selectedValue = weekSelector.value;
    changeSelectedWeek(selectedValue);
  });
}

// download
function download() {
  cal.download("shift-schedule");
}

function publishResults(data) {
  for (let i = data.length - 1; i >= 0; i--) {
    let eventData = data[i];
    let ocrData = eventData.data.text.replace(/\n\s*\n/g, "\n");
    let extractedEvents = process(ocrData);
    allExtractedWeeks.push(extractedEvents);
  }
  allExtractedWeeks.forEach((weekEvents, _i) => {
    createEventWeek(weekEvents, _i);
  });
  selectedWeek = 0;
  changeSelectedWeek(selectedWeek);
  updateStage("review");
}

fileLoadedCheck();
