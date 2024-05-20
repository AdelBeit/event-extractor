document.addEventListener("DOMContentLoaded", __main__);

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
        let file = this.files[0];
        reader.readAsDataURL(file);
        startRecognize(file);
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
}

function startRecognize(img) {
  toggleIcons(
    ["arrow-down", "arrow-right"],
    "fa-spinner fa-spin",
    "fa-arrow-right"
  );
  recognizeFile(img);
}

function recognizeFile(file) {
  document.getElementById("log").innerHTML = "";
  var startTime = new Date();
  const corePath =
    window.navigator.userAgent.indexOf("Edge") > -1
      ? `src/js/tesseract-core.asm.js`
      : `src/js/tesseract-core.wasm.js`;

  const worker = new Tesseract.TesseractWorker({
    corePath,
  });

  worker
    .recognize(file, "eng")
    .progress(function (packet) {
      console.info(packet);
      progressUpdate(packet);
    })
    .then(function (data) {
      console.log(data);
      progressUpdate({ status: "done", data: data });
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 1000);
      const timerLabel = document.createElement("div");
      timerLabel.textContent = `Recognition completed in ${duration} seconds`;
      document.querySelector("#log").appendChild(timerLabel);
    });
}

function progressUpdate(packet) {
  var log = document.getElementById("log");

  if (log.firstChild && log.firstChild.status === packet.status) {
    if ("progress" in packet) {
      var progress = log.firstChild.querySelector("progress");
      progress.value = packet.progress;
    }
  } else {
    var line = document.createElement("div");
    line.status = packet.status;
    var status = document.createElement("div");
    status.className = "status";
    status.appendChild(document.createTextNode(packet.status));
    line.appendChild(status);

    if ("progress" in packet) {
      var progress = document.createElement("progress");
      progress.value = packet.progress;
      progress.max = 1;
      line.appendChild(progress);
    }

    if (packet.status == "done") {
      log.innerHTML = "";
      extractEvents(packet.data.text);
      var pre = document.createElement("pre");
      pre.appendChild(document.createTextNode(extractedEvent.join("\n")));
      line.innerHTML = "";
      line.appendChild(pre);
      toggleIcons(
        ["arrow-down", "arrow-right"],
        "fa-check",
        "fa-spinner fa-spin"
      );
    }

    log.insertBefore(line, log.firstChild);
  }
}

function extractEvents(text){
  const lines = text.toLowerCase().split('\n');
  let days = ['mon','tue','wed','thu','fri','sat','sun'];
  let weekRange = null;
  let currentDay = null;
  let extractingShiftDetails = false;
  let shiftDetails = {day:null,hours:null,description:null};
  let storeInfo = [];
  var extractedEvents = [];
  lines.forEach((line, _i) => {
    if(!weekRange){
      extractedEvents.push(["week:", extractor.getWeek(line)]);
      gotWeek = true;
    }
  });
}

/* --------------------------------------- */
/*            AUXILIARY FUNCTIONS          */
/* --------------------------------------- */

function toggleIcons(iconIDs, addClasses, removeClasses) {
  // Ensure iconIDs is an array
  if (!Array.isArray(iconIDs)) {
    iconIDs = [iconIDs];
  }

  iconIDs.forEach(function (iconID) {
    let icon = document.getElementById(iconID);
    if (icon) {
      icon.classList.remove(...removeClasses.split(" "));
      icon.classList.add(...addClasses.split(" "));
    }
  });
}
