window.dungeon = window.dungeon || {};

window.dungeon.createHero = (function (pos, ev) {
  'use strict';

  return function createHero(options) {
    var heroPos = {
      col: options.pos.col,
      row: options.pos.row
    };
    var health = options.health;
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

    function getHealth() {
      return health;
    }

    function adjustHealthBy(amount) {
      health += amount;
    }

    function move(towardsPos) {
      var heroVector = pos.getVector(getCoords(), towardsPos);
      var newPos = pos.getNextPos(getCoords(), heroVector);

      setCoords(newPos);
      setLastVector(heroVector);
      ev.publish('hero:move:end', { newPos: newPos });
    }

    return {
      getCoords: getCoords,
      setCoords: setCoords,
      setLastVector: setLastVector,
      getLastVector: getLastVector,
      getHealth: getHealth,
      adjustHealthBy: adjustHealthBy,
      move: move
    };
  };
}(window.dungeon.pos, window.dungeon.ev));
