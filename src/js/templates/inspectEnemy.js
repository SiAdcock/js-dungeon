window.dungeon = window.dungeon || {};
window.dungeon.templates = window.dungeon.templates || {};

window.dungeon.templates.inspectEnemy = function inspectEnemyTemplate(enemy) {
  'use strict';

  var name = enemy.name;
  var attackStrength = enemy.attackStrength;
  var health = enemy.health;
  var inspectContent = document.createElement('div');
  var inspectName = document.createElement('h3');
  var attackStrengthPara = document.createElement('p');
  var attackStrengthSpan = document.createElement('span');
  var healthPara = document.createElement('p');
  var healthSpan = document.createElement('span');
  var attackButton = document.createElement('button');

  attackStrengthSpan.classList.add('inspect-attack-strength');
  attackStrengthSpan.innerHTML = attackStrength;
  attackStrengthPara.innerHTML = 'Attack Strength: ';
  attackStrengthPara.appendChild(attackStrengthSpan);
  healthSpan.classList.add('inspect-health');
  healthSpan.innerHTML = health;
  healthPara.innerHTML = 'Health: ';
  healthPara.appendChild(healthSpan);
  attackButton.innerHTML = 'Attack';
  attackButton.classList.add('inspect-attack');
  inspectName.innerHTML = name;
  inspectContent.classList.add('inspect-content');
  inspectContent.appendChild(inspectName);
  inspectContent.appendChild(attackStrengthPara);
  inspectContent.appendChild(healthPara);
  inspectContent.appendChild(attackButton);

  return inspectContent;
};
