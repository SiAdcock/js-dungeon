window.dungeon = window.dungeon || {};
window.dungeon.templates = window.dungeon.templates || {};

window.dungeon.templates.inspectEnemy = function inspectEnemyTemplate(enemy) {
  'use strict';

  var name = enemy.name;
  var attackStrength = enemy.attackStrength;

  return '<h3 class="inspect-name">' + name + '</h3>' +
    'Attack strength: <span class="inspect-attack-strength">' + attackStrength + '</span>';
};
