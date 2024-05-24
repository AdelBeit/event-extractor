function startRecognize(img) {
  toggleIcons(
    ["arrow-down", "arrow-right"],
    "fa-spinner fa-spin",
    "fa-arrow-right"
  );
  recognizeFiles(img);
}

async function recognizeFiles(files) {
  document.getElementById("log").innerHTML = "";

  /* scheudler */
  const scheduler = Tesseract.createScheduler();
  const workerGen = async () => {
    const worker = await Tesseract.createWorker("eng", 1);
    scheduler.addWorker(worker);
  };

  const workerN = 2;
  const resArr = Array(workerN);
  for (let i = 0; i < workerN; i++) {
    resArr[i] = workerGen();
  }
  await Promise.all(resArr);

  const results = [];
  for (let i = 0; i < files.length; i++) {
    let result = scheduler.addJob("recognize", files[i]).then((ret) => {
      console.log(i, ret.data.text);
      return x;
    });
    results.push(result);
  }
  await Promise.all(results);
  await scheduler.terminate();
  return;

  // const worker = await Tesseract.createWorker("eng", 1, {
  //   logger: progressUpdate,
  // });
  // for (let i = 0; i < files.length; i++) {
  //   let file = files[i];
  //   const ret = await worker.recognize(file);
  //   console.log("done", i, file, ret.data.text);
  //   // try {
  //   //   progressUpdate({ status: "done", data: ret.data });
  //   // } catch (e) {
  //   //   console.log(e);
  //   // }
  // }
  // await worker.terminate();
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
      console.log(packet);
      log.innerHTML = "";
      var ocrData = packet.data.text.replace(/\n\s*\n/g, "\n");
      // send data for text extraction
      var extractedEvents = process(ocrData);
      // create icr files
      createEvents(extractedEvents);
      download();
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

fileLoadedCheck();
