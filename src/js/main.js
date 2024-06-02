document.addEventListener("DOMContentLoaded", __main__);

var scheduler = undefined;
var stage = "upload"; // upload | recognition | review
var allExtractedWeeks = {};
var selectedWeek;
var imageFiles = {};
var imageReader;

function __main__() {
  updateStage("upload");
  initTesseractScheduler();
  initImageReader();
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
  editButton.classList.add('hidden');
  editButton.addEventListener("click", (e) => {
    toggleButtonUIHandler(editButton);
    EDIT_MODE = !EDIT_MODE;
  });

  const showOriginalButton = document.querySelector("button.toggle-button.show-original");
  showOriginalButton.addEventListener("click", (e) => {
    toggleButtonUIHandler(showOriginalButton);
    toggleOriginal();
    SHOW_ORIGINAL = !SHOW_ORIGINAL;
  });

  const weekSelector = document.querySelector("select.week-selector");
  weekSelector.addEventListener("change", () => {
    var selectedValue = weekSelector.value;
    changeSelectedWeek(selectedValue);
  });
}

function publishResults(data) {
  let fileNames = Object.keys(data);
  const weekSelector = document.querySelector("select.week-selector");
  weekSelector.innerHTML = ""; // clear selector
  for (let i = fileNames.length - 1; i >= 0; i--) {
    let fileName = fileNames[i];
    let extractedData = data[fileName];
    let ocrText = extractedData.data.text.replace(/\n\s*\n/g, "\n");
    let extractedEvents = process(ocrText);
    allExtractedWeeks[fileName] = extractedEvents;
    createEventWeek(extractedEvents, fileName);
  }
  createDayCards(allExtractedWeeks[0].length);
  selectedWeek = fileNames[0];
  weekSelector.value = selectedWeek;
  // Trigger the change event to notify any additional listeners
  weekSelector.dispatchEvent(new Event("change"));

  updateStage("review");
}

fileLoadedCheck();
