window.dungeon = window.dungeon || {};

window.dungeon.map = (function (constants, pos, createHero, createEnemy) {
  'use strict';

  var enemies = [];
  var hero;

  function matchCoordFor(colOrRow) {
    var regex = colOrRow === constants.COL ? /map-col-(\d+)/ : /map-row-(\d+)/;

    return function (prev, curr) {
      if (prev) {
        return prev;
      }

      var matches = curr.match(regex);

      if (matches) {
        return matches[1];
      }
    };
  }

  function getCoords(node) {
    var colReduce = Array.prototype.reduce.bind(node.classList);
    var rowReduce = Array.prototype.reduce.bind(node.parentNode.parentNode.classList);
    var col = parseInt(colReduce(matchCoordFor(constants.COL), null), 10);
    var row = parseInt(rowReduce(matchCoordFor(constants.ROW), null), 10);

    return {
      row: row,
      col: col
    };
  }

  function getPosNode(position) {
    return document.querySelectorAll('.map-row-' + position.row + ' .map-col-' + position.col)[0];
  }

  function moveCharInDom(charNode, nextPos) {
    charNode.parentNode.removeChild(charNode);
    //TODO: ensure nextPos node exists
    getPosNode(nextPos).appendChild(charNode);
  }

  function moveHeroTowards(toNode) {
    var heroNode = document.querySelectorAll('.hero')[0];

    hero.move(getCoords(toNode));
    moveCharInDom(heroNode, hero.getCoords());
  }

  function moveEnemies() {
    enemies.forEach(function (enemy) {
      var enemyNode = getPosNode(enemy.getCoords()).childNodes[0]; //TODO: can't always rely on this

      enemy.move(hero);
      moveCharInDom(enemyNode, enemy.getCoords());
    });
  }

  function initHero(options) {
    var heroPosNode = getPosNode(options.pos);
    var heroNode = document.createElement('div');

    heroNode.setAttribute('class', 'hero character');
    heroPosNode.appendChild(heroNode);
    document.getElementsByClassName('hero-info-health')[0].innerHTML = options.health;

    return createHero(options);
  }

  function initEnemy(options) {
    var enemyPosNode = getPosNode(options.pos);
    var enemyNode = document.createElement('div');

    enemyNode.setAttribute('class', 'enemy character');
    enemyPosNode.appendChild(enemyNode);

    return createEnemy({ pos: options.pos, aggroRange: options.aggroRange });
  }

  function init() {
    var enemyOptions = {
      pos: { col: 9, row: 4 },
      aggroRange: 2
    };
    enemies.push(initEnemy(enemyOptions));
    hero = initHero({
      pos: { row: 1, col: 1 },
      health: 10
    });
  }

  return {
    moveHeroTowards: moveHeroTowards,
    moveEnemies: moveEnemies,
    init: init
  };
}(window.dungeon.constants, window.dungeon.pos, window.dungeon.createHero, window.dungeon.createEnemy));
