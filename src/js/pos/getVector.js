window.dungeon = window.dungeon || {};
window.dungeon.pos = window.dungeon.pos || {};

window.dungeon.pos.getVector = function getVector(oldPos, newPos) {
  'use strict';

  return {
    x: newPos.col - oldPos.col,
    y: newPos.row - oldPos.row
  };
};
