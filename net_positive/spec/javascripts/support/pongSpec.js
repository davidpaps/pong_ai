"use strict";

describe('Pong', function() {
  var pong;
  var fakeCanvas;
  var fakeDocument

  beforeEach(function() {
    fakeCanvas = {
      width: 100,
      height: 100,
      getContext: function() {
        return ''
      }
    }
    fakeDocument = {
      getElementById: function() {
        return fakeCanvas
      }
    } 
  
    pong = new Pong(canvas);
  })


})