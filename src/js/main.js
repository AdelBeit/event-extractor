document.addEventListener("DOMContentLoaded", __main__);

var scheduler = undefined;
var stage = "upload";
var allExtractedWeeks = [];
var selectedWeek;

function __main__() {
  var inputs = document.querySelectorAll(".inputfile");
  Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
      labelVal = label.innerHTML;

    input.addEventListener("change", function (e) {
      var fileName = "";
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute("data-multiple-caption") || "").replace(
          "{count}",
          this.files.length
        );
      else fileName = e.target.value.split("\\").pop();

      if (fileName) {
        label.querySelector("span").innerHTML = fileName;

        let reader = new FileReader();
        reader.onload = function () {
          let dataURL = reader.result;
          document.getElementById("selected-image").src = dataURL;
          document.getElementById("selected-image").classList.add("col-12");
        };
        reader.readAsDataURL(this.files[0]);
        try {
          startRecognize(this.files);
        } catch (e) {
          console.log(e);
        }
      } else {
        label.innerHTML = labelVal;
        document.getElementById("selected-image").src = "";
        document.getElementById("selected-image").classList.remove("col-12");
        toggleIcons(
          ["arrow-down", "arrow-right"],
          "fa-arrow-right",
          "fa-check fa-spinner fa-spin"
        );
        document.getElementById("log").innerHTML = "";
      }
    });

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
  });
}


// download 
function download(){
  cal.download('shift-schedule');
}


fileLoadedCheck();
