"use strict";

describe('Pong', function() {
  var pong;
  var testCanvas;
  var fakeDocument;


  beforeEach(function() {
    testCanvas = {
      height: 150,
      width: 150,
      getContext: function() {
        return ""
      }
    }
  
    pong = new Pong(testCanvas);
  })

  describe("canvas dimensions", function() {
    it("draws the correct height", function() {
      expect(pong._canvas.height).toEqual(150)
    })
    it("draws the correct width", function() {
      expect(pong._canvas.width).toEqual(150)
    })
  })


})