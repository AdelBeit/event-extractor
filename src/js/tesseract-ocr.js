async function initTesseractScheduler() {
  if (scheduler) {
    console.log("scheduler already initialized");
    return;
  }
  /* scheudler */
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
}

function initRecognition(files) {
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
