window.dungeon = window.dungeon || {};

window.dungeon.createHero = (function (pos) {
  'use strict';

  return function createHero(options) {
    var heroPos = {
      col: options.pos.col,
      row: options.pos.row
    };
    var lastVector;

    function getCoords() {
      return {
        col: heroPos.col,
        row: heroPos.row
      };
    }

    function setCoords(newPos) {
      heroPos.col = newPos.col;
      heroPos.row = newPos.row;
    }

    function getLastVector() {
      return lastVector;
    }

    function setLastVector(vector) {
      lastVector = vector;
    }

    function move(toCoords) {
      var heroVector = pos.getVector(getCoords(), toCoords);
      var nextPos = pos.getNextPos(getCoords(), heroVector);

      setCoords(nextPos);
      setLastVector(heroVector);
    }

    return {
      getCoords: getCoords,
      setCoords: setCoords,
      setLastVector: setLastVector,
      getLastVector: getLastVector,
      move: move
    };
  };
}(window.dungeon.pos));
