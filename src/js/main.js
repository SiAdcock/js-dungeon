(function (constants, map, createHero, createEnemy, inspect) {
  'use strict';

  var turns = 0;
  var enemies = [];
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
    /**
     * TODO: it would make more sense if we found the enemy at the specified position first,
     * then called the `inspect` function
     */
    enemies.forEach(inspect(position));
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('map-col')) {
        map.moveHeroTowards(hero, e.target);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
      else if (e.target.classList.contains('character')) {
        map.moveHeroTowards(hero, e.target.parentNode);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
    });
    document.addEventListener('hero:endTurn', function () {
      map.moveEnemies(enemies, hero);
      incrementTurns();
      inspectPos(hero.getCoords());
      applyEffects(hero.getCoords());
      document.getElementsByClassName('game-info-turn-count')[0].innerHTML = turns;
      document.getElementsByClassName('hero-info-health')[0].innerHTML = hero.getHealth();
    });
  }

  function init() {
    var enemyOptions = {
      name: 'Claud McDastardly',
      pos: { col: 9, row: 4 },
      aggroRange: 2,
      attackStrength: 1
    };
    enemies.push(createEnemy(enemyOptions));
    hero = createHero({
      pos: { row: 1, col: 1 },
      health: 10
    });
    map.init(hero, enemies);
    bindEvents();
    document.getElementsByClassName('hero-info-health')[0].innerHTML = hero.getHealth();
  }

  init();
}(window.dungeon.constants, window.dungeon.map, window.dungeon.createHero, window.dungeon.createEnemy, window.dungeon.inspect));
