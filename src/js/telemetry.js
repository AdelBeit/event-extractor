function ET(key) {
  const map = {
    viewed: "",
    processed: "",
    distributed: "",
  };
  document.querySelector("div.ditto img").src = map[key];
}
