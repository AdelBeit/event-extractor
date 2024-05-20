document.addEventListener("DOMContentLoaded", __main__);

function __main__() {
  let inputs = document.querySelectorAll(".inputfile");
  Array.prototype.forEach.call(inputs, function (input) {
    let label = input.nextElementSibling,
      labelVal = label.innerHTML;

    input.addEventListener("change", function (e) {
      let fileName = "";
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
    let img = document.getElementById("selected-image");
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

function progressUpdate(packet) {
  let log = document.getElementById("log");
  
  // Find the corresponding div for the packet status
  let line = Array.from(log.children).find(child => child.status === packet.status);

  if (line) {
    // Update progress if it exists
    if ("progress" in packet) {
      const progress = line.querySelector("progress");
      progress.value = packet.progress;
    }
  } else {
    // Create a new div for the packet
    line = document.createElement("div");
    line.status = packet.status;
    const status = document.createElement("div");
    status.className = "status";
    status.appendChild(document.createTextNode(packet.status));
    line.appendChild(status);

    if ("progress" in packet) {
      const progress = document.createElement("progress");
      progress.value = packet.progress;
      progress.max = 1;
      line.appendChild(progress);
    }

    if (packet.status === "done") {
      const pre = document.createElement("pre");
      pre.appendChild(
        document.createTextNode(packet.data.text.replace(/\n\s*\n/g, "\n"))
      );
      line.innerHTML = "";
      line.appendChild(pre);
      toggleIcons(
        ["arrow-down", "arrow-right"],
        "fa-check",
        "fa-spinner fa-spin"
      );
      
      // Stop the timer and update the label
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 1000);
      const timerLabel = document.getElementById("timer-label");
      timerLabel.textContent = `Recognition completed in ${duration} seconds`;
    }

    log.insertBefore(line, log.firstChild);

    // Start the timer when the first packet arrives
    if (!startTime) {
      startTime = new Date();
      const timerLabel = document.createElement("div");
      timerLabel.id = "timer-label";
      log.appendChild(timerLabel);
    }
  }
}

function recognizeFile(file) {
  document.getElementById("log").innerHTML = "";
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
