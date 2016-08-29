window.dungeon = window.dungeon || {};

window.dungeon.createEnemy = function createEnemy(options) {
  'use strict';

  var pos = {
    col: options.pos.col,
    row: options.pos.row
  };
  var aggroRange = options.aggroRange;
  var node = options.node;

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
    setCoords: setCoords,
    getAggroRange: function () {
      return aggroRange;
    },
    getNode: function () {
      return node;
    }
  };
};
