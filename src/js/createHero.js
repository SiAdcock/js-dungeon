window.dungeon = window.dungeon || {};

window.dungeon.createHero = function createHero(options) {
  'use strict';
  var pos = {
    col: options.pos.col,
    row: options.pos.row
  };

  function getCoords() {
    return {
      col: pos.col,
      row: pos.row
    };
  }

  function setCoords(newPos) {
    pos.col = newPos.col;
    pos.row = newPos.row;
  }

  return {
    getCoords: getCoords,
    setCoords: setCoords
  };
};
