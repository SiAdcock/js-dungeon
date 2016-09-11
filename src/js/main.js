(function (constants, q, map, createHero, createEnemy, inspectEnemyTemplate, ev) {
  'use strict';

  var turns;
  var enemies;
  var hero;

  function incrementTurns() {
    turns += 1;
  }

  function killEnemy(enemy) {
    var newEnemies = enemies.reduce(function (prev, curr) {
      if (curr.getId() !== enemy.getId()) {
        prev.push(curr);
      }
    }, []);

    if (!newEnemies) {
      enemies = [];
    }
    else {
      enemies = newEnemies;
    }
    ev.publish('enemy:kill', { pos: enemy.getCoords() });
  }

  function moveEnemies() {
    enemies.forEach(function (enemy) {
      enemy.move(hero);
    });
  }

  function findEnemyAt(position) {
    return enemies.reduce(function (prev, enemy) {
      if (enemy.getCoords().col === position.col && enemy.getCoords().row === position.row) {
        return enemy;
      }
    }, null);
  }

  function applyEffects(position) {
    var enemyAtPosition = findEnemyAt(position);

    if (enemyAtPosition) {
      hero.adjustHealthBy(-enemyAtPosition.getAttackStrength());
    }
  }

  function inspectPos(position) {
    var enemyAtPosition = findEnemyAt(position);
    var inspectNode = q('.inspect')[0];
    var inspectContentNode;

    inspectNode.removeChild(inspectNode.lastChild);
    if (enemyAtPosition) {
      inspectContentNode = inspectEnemyTemplate({
        name: enemyAtPosition.getName(),
        attackStrength: enemyAtPosition.getAttackStrength(),
        health: enemyAtPosition.getHealth()
      });
      inspectContentNode
        .getElementsByClassName('inspect-attack')[0]
        .addEventListener('click', function () {
          enemyAtPosition.adjustHealthBy(-hero.getAttackStrength());
          if (enemyAtPosition.getHealth() > 0) {
            inspectContentNode.getElementsByClassName('inspect-health')[0].innerHTML = enemyAtPosition.getHealth();
          }
          else {
            killEnemy(enemyAtPosition);
            inspectPos(position);
          }
          ev.publish('main:turn:end');
        });
    }
    else {
      inspectContentNode = document.createElement('h3');
      inspectContentNode.innerHTML = 'Nothing';
      inspectContentNode.classList.add('inspect-content');
    }
    inspectNode.appendChild(inspectContentNode);
  }

  function init() {
    var mapSize = {
      width: 10,
      height: 5
    };
    var startPos = {
      row: 1,
      col: 1
    };
    var endPos = {
      row: 5,
      col: 10
    };
    var enemyOptions = {
      id: 1,
      name: 'Claud McDastardly',
      pos: { col: 9, row: 4 },
      aggroRange: 2,
      attackStrength: 1,
      health: 5
    };
    enemies = [createEnemy(enemyOptions)];
    hero = createHero({
      pos: { row: 1, col: 1 },
      health: 10,
      attackStrength: 2
    });
    map.init({
      hero: hero,
      enemies: enemies,
      mapSize: mapSize,
      startPos: startPos,
      endPos: endPos
    });
    turns = 0;
    q('.game-info-turn-count')[0].innerHTML = turns;
    q('.hero-info-health')[0].innerHTML = hero.getHealth();
    q('.hero-info-attack-strength')[0].innerHTML = hero.getAttackStrength();
    inspectPos(startPos);
  }

  function restart() {
    init();
  }

  function bindEvents() {
    q('.restart')[0].addEventListener('click', restart);
    ev.subscribe('main:turn:end', function () {
      moveEnemies();
      incrementTurns();
      inspectPos(hero.getCoords());
      applyEffects(hero.getCoords());
      q('.game-info-turn-count')[0].innerHTML = turns;
      q('.hero-info-health')[0].innerHTML = hero.getHealth();
      if (hero.getHealth() <= 0) {
        map.gameOver();
      }
    });
    ev.subscribe('hero:move:start', function (e) {
      hero.move(e.detail.towardsPos);
    });
  }

  init();
  bindEvents();
}(window.dungeon.constants,
  window.dungeon.q,
  window.dungeon.map,
  window.dungeon.createHero,
  window.dungeon.createEnemy,
  window.dungeon.templates.inspectEnemy,
  window.dungeon.ev
));
