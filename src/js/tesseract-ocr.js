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

  // document.getElementById("download").addEventListener("click", function () {
  //   console.log("starting events extraction");
  //   var extractedEvents = process(dummyData);
  //   console.log("events extraction complete");
  //   console.log("starting events creation");
  //   createEvents(extractedEvents);
  //   console.log("events creation complete", cal.events());
  // });
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
  (async () => {
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: (m) => console.log(m),
    });
    const ret = await worker.recognize(file);
    // console.log(ret.data.text);
    log.innerHTML = "";
    var log = document.getElementById("log");
    console.log(log);
    // var ocrData = packet.data.text.replace(/\n\s*\n/g, "\n");
    var ocrData = ret.data.text.replace(/\n\s*\n/g, "\n");
    // send data for text extraction
    console.log(ocrData);
    var extractedEvents = process(ocrData);
    // create icr files
    createEvents(extractedEvents);
    console.log(extractedEvents);
    // TODO: delete this stuff no need to display
    var pre = document.createElement("pre");
    pre.appendChild(document.createTextNode(ocrData));
    pre.appendChild(document.createTextNode(cal.events().join("\n")));
    line.innerHTML = "";
    line.appendChild(pre);
    toggleIcons(
      ["arrow-down", "arrow-right"],
      "fa-check",
      "fa-spinner fa-spin"
    );
    log.insertBefore(line, log.firstChild);
    await worker.terminate();
  })();
  return;
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
    if (packet.status === "done") {
      log.innerHTML = "";
      var ocrData = packet.data.text.replace(/\n\s*\n/g, "\n");
      // send data for text extraction
      var extractedEvents = process(ocrData);
      // create icr files
      createEvents(extractedEvents);
      // TODO: delete this stuff no need to display
      var pre = document.createElement("pre");
      pre.appendChild(document.createTextNode(ocrData));
      pre.appendChild(document.createTextNode(cal.events().join("\n")));
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

fileLoadedCheck();
