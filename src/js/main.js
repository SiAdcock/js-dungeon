(function (constants, map, createHero, createEnemy, inspect) {
  'use strict';

  var turns = 0;
  var enemies = [];
  var hero;

  function incrementTurns() {
    turns += 1;
  }

  function inspectPos(position) {
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
      document.getElementsByClassName('game-info-turn-count')[0].innerHTML = turns;
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
  }

  init();
}(window.dungeon.constants, window.dungeon.map, window.dungeon.createHero, window.dungeon.createEnemy, window.dungeon.inspect));
