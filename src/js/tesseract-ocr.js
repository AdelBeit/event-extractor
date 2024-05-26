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

fileLoadedCheck();
