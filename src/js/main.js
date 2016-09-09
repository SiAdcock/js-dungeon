(function (constants, q, map, createHero, createEnemy, inspect) {
  'use strict';

  var turns;
  var enemies;
  var hero;

  function incrementTurns() {
    turns += 1;
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
    var template;

    if (enemyAtPosition) {
      template = inspect(enemyAtPosition);
    }
    else {
      template = '<h3 class="inspect-name">Nothing</h3>';
    }
    document.getElementsByClassName('inspect-content')[0].innerHTML = template;
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
      name: 'Claud McDastardly',
      pos: { col: 9, row: 4 },
      aggroRange: 2,
      attackStrength: 1
    };
    enemies = [createEnemy(enemyOptions)];
    hero = createHero({
      pos: { row: 1, col: 1 },
      health: 10
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
  }

  function bindEvents() {
    document.addEventListener('hero:endTurn', function () {
      map.moveEnemies();
      incrementTurns();
      inspectPos(hero.getCoords());
      applyEffects(hero.getCoords());
      q('.game-info-turn-count')[0].innerHTML = turns;
      q('.hero-info-health')[0].innerHTML = hero.getHealth();
      if (hero.getHealth() <= 0) {
        map.gameOver();
      }
    });
    document.addEventListener('main:restart', init);
  }

  init();
  bindEvents();
}(window.dungeon.constants, window.dungeon.q, window.dungeon.map, window.dungeon.createHero, window.dungeon.createEnemy, window.dungeon.inspect));
