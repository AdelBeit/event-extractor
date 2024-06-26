async function initTesseractScheduler() {
  if (!window.Tesseract) {
    const tesseractTimeout = setTimeout(() => {
      console.log("Tesseract not loaded, reloading...");
      clearTimeout(tesseractTimeout);
      initTesseractScheduler();
    }, 500);
    return;
  }
  if (scheduler) {
    console.log("Scheduler already initialized");
    return;
  }
  scheduler = Tesseract.createScheduler();
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
  console.log("scheduler initialized");
  let input = document.querySelector(".upload-button input");
  input.removeAttribute("disabled");
}

function initRecognition(files) {
  // init imagefiles with number of files for calculating loading time
  [...files].map((f, _i) => (imageFiles[_i] = undefined));
  updateStage("recognition");
  updateProgress(getProgressMessages());
  try {
    recognizeFiles(files);
  } catch (e) {
    console.log(e);
  }
}

async function recognizeFiles(files) {
  const results = [];
  var ocrData = {};
  for (let i = 0; i < files.length; i++) {
    let result = scheduler
      .addJob("recognize", files[i])
      .then((res) => {
        let fileName = i;
        ocrData[fileName] = res;
        imageFiles[fileName] = files[i];
      })
      .catch((e) => console.log(e));
    results.push(result);
  }
  await Promise.all(results);
  publishResults(ocrData);
}

fileLoadedCheck();
