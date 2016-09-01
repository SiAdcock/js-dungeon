window.dungeon = window.dungeon || {};

window.dungeon.inspect = function inspect(enemy) {
  'use strict';

  var name = enemy.getName();
  var attackStrength = enemy.getAttackStrength();

  return '<h3 class="inspect-name">' + name + '</h3>' +
    'Attack strength: <span class="inspect-attack-strength">' + attackStrength + '</span>';
};
