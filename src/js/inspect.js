window.dungeon = window.dungeon || {};

window.dungeon.inspect = function inspect(position) {
  'use strict';

  return function (enemy) {
    if (enemy.getCoords().row === position.row && enemy.getCoords().col === position.col) {
      document.getElementsByClassName('inspect-attack-strength')[0].innerHTML = enemy.getAttackStrength();
      document.getElementsByClassName('inspect-name')[0].innerHTML = enemy.getName();
    }
  };
};
