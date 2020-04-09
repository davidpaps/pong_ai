"use strict";

describe('ImageProcessor', function() {
  var imageProcessor;
  
  beforeEach(function() {
    imageProcessor = new ImageProcessor;
  })

  describe("compressString", function() {
    it("replaces 80 consecutive zeros with the letter w", function() {
      var input = '0'.repeat(80);
      expect(imageProcessor.compressString(input)).toEqual('w');
    })
    it("replaces 40 consecutive zeros with the letter x", function() {
      var input = '0'.repeat(40);
      expect(imageProcessor.compressString(input)).toEqual('x');
    })
    it("replaces 20 consecutive zeros with the letter y", function() {
      var input = '0'.repeat(20);
      expect(imageProcessor.compressString(input)).toEqual('y');
    })
    it("replaces 10 consecutive zeros with the letter z", function() {
      var input = '0'.repeat(10);
      expect(imageProcessor.compressString(input)).toEqual('z');
    })
    it("replaces 4 consecutive ones with the letter a", function() {
      var input = '1'.repeat(4);
      expect(imageProcessor.compressString(input)).toEqual('a');
    })
    it("replaces 1600 consecutive zeros with the letter v", function() {
      var input = '0'.repeat(80).repeat(20);
      expect(imageProcessor.compressString(input)).toEqual('v');
    })
    it("replaces 1750 consecutive zeros with the letters vwxyz", function() {
      var input = '0'.repeat(1750);
      expect(imageProcessor.compressString(input)).toEqual('vwxyz');
    })
    it("replaces 1750 consecutive zeros followed by 4 ones with the characters vwxyza", function() {
      var input = '0'.repeat(1750) + '1'.repeat(4);
      expect(imageProcessor.compressString(input)).toEqual('vwxyza');
    })
    it("replaces 1752 consecutive zeros with the characters vwxyz00", function() {
      var input = '0'.repeat(1752);
      expect(imageProcessor.compressString(input)).toEqual('vwxyz00');
    })
    it("replaces 1752 consecutive zeros followed by 5 ones with the characters vwxyz00a1", function() {
      var input = '0'.repeat(1752) + '1'.repeat(5);
      expect(imageProcessor.compressString(input)).toEqual('vwxyz00a1');
    })
  })

  describe("rgbaToBinary", function() {
    it("converts from rgba of 255,255,255,1 to 1", function() {
      var inputArray = [255,255,255,1];
      expect(imageProcessor.rgbaToBinary(inputArray)).toEqual([1]);
    })
    it("converts from rgba of 0,0,0,1 to 0", function() {
      var inputArray = [0,0,0,1];
      expect(imageProcessor.rgbaToBinary(inputArray)).toEqual([0]);
    })
    it("converts from rgb values greater or equal to 127 to 1", function() {
      var inputArray = [127,127,127,1];
      expect(imageProcessor.rgbaToBinary(inputArray)).toEqual([1]);
    })
    it("converts from rgba values less than 127 to 0", function() {
      var inputArray = [126,126,126,1];
      expect(imageProcessor.rgbaToBinary(inputArray)).toEqual([0]);
    })
    it("converts from an array containing multiple rgba values to an array containing binary values", function() {
      var inputArray = [255,255,255,1,0,0,0,1,255,255,255,1,50,50,50,1];
      expect(imageProcessor.rgbaToBinary(inputArray)).toEqual([1,0,1,0]);
    })
  })
});