"use strict";

class ImageProcessor {
  constructor() {
    this.regex80 = /00000000000000000000000000000000000000000000000000000000000000000000000000000000/gi
    this.regex40 = /0000000000000000000000000000000000000000/gi
    this.regex20 = /00000000000000000000/gi
    this.regex10 = /0000000000/gi
    this.regex4 = /1111/gi
    this.regexW = /wwwwwwwwwwwwwwwwwwww/gi
  }

  retrievePixelData(context) {
    var imageArray = context.getImageData(0, 0, 320, 320).data;
    imageArray = this.rgbaToBinary(imageArray);
    var imageString = imageArray.join('');
    imageString = this.compressString(imageString);
    return imageString;
  }

  rgbaToBinary(imageArray) {
    var binaryArray = [];
    for (i = 0; i < imageArray.length; i = i + 4) {
      binaryArray.push(imageArray[i]);
    }

    for (var i = 0, len = binaryArray.length; i < len; i++) {
      binaryArray[i] < 127 ? binaryArray[i] = 0 : binaryArray[i] = 1;
    }
    return binaryArray;
  }

  compressString(imageString) {
    //first round of compression
    imageString = imageString.replace(this.regex80, 'w');
    imageString = imageString.replace(this.regex40, 'x');
    imageString = imageString.replace(this.regex20, 'y');
    imageString = imageString.replace(this.regex10, 'z');
    imageString = imageString.replace(this.regex4, 'a');
    // second round of compression
    imageString = imageString.replace(this.regexW, 'v');
    return imageString;
  }

}