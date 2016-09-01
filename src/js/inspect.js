window.dungeon = window.dungeon || {};

window.dungeon.inspect = function inspect(position) {
  'use strict';

  return function (enemy) {
    if (enemy.getCoords().row === position.row && enemy.getCoords().col === position.col) {
      var name = enemy.getName();
      var attackStrength = enemy.getAttackStrength();
      document.getElementsByClassName('inspect-content')[0].innerHTML = '<h3 class="inspect-name">' +
        name +
        '</h3>' +
        'Attack strength: <span class="inspect-attack-strength">' +
        attackStrength +
        '</span>';
    }
  };
};
