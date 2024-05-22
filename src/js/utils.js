const logFileNames = true;
var fileLoadedCheck = () =>
  logFileNames &&
  console.log("loaded", document.currentScript.src.split("/").pop());
fileLoadedCheck();
