document.addEventListener("DOMContentLoaded", __main__);


var dummyData = `4:04 [ICT TORS
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
  mT =`;

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

    // Firefox bug fix
    input.addEventListener("focus", function () {
      input.classList.add("has-focus");
    });
    input.addEventListener("blur", function () {
      input.classList.remove("has-focus");
    });
  });

  document.getElementById("startLink").addEventListener("click", function () {
    var img = document.getElementById("selected-image");
    startRecognize(img);
  });

  // document.getElementById("download").addEventListener("click", function () {
  //   console.log("starting events extraction");
  //   var extractedEvents = process(dummyData);
  //   console.log("events extraction complete");
  //   console.log("starting events creation");
  //   createEvents(extractedEvents);
  //   console.log("events creation complete", cal.events());
  // });
}


// download 
function download(){
  cal.download('shift-schedule');
}


fileLoadedCheck();
