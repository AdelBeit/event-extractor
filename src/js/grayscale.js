function convertToGrayscale(dataURL, callback) {
  // Create an image element
  let img = new Image();
  img.src = dataURL;

  img.onload = function () {
    // Create a canvas element
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // Set the canvas dimensions to the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0);

    // Get the image data
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Convert the image to grayscale
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Calculate the grayscale value
      let gray = 0.3 * r + 0.59 * g + 0.11 * b;

      // Set the grayscale value to the RGB channels
      data[i] = data[i + 1] = data[i + 2] = gray;
    }

    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Get the grayscale data URL
    let grayDataURL = canvas.toDataURL();

    // Call the callback function with the grayscale data URL
    callback(grayDataURL);
  };
}
