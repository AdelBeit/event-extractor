const LOG_FILE_NAMES = false;

var fileLoadedCheck = () =>
  LOG_FILE_NAMES &&
  console.log("loaded", document.currentScript.src.split("/").pop());

/* add/remove classes from dom elements given their id
 * iconIDs: string/string[]
 * addClasses: string[]
 * removeClasses: string[]
 */
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

/* stopwatch decorator */
function stopwatchDecorator(functionToBeTimed) {
  var startTime = new Date();
  functionToBeTimed();
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000);
  const timerLabel = document.createElement("div");
  timerLabel.textContent = `Recognition completed in ${duration} seconds`;
  document.querySelector("#log").appendChild(timerLabel);
}

fileLoadedCheck();
