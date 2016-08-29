window.dungeon = window.dungeon || {};

window.dungeon.map = (function (constants, createHero) {
  'use strict';

  var enemies = [];
  var lastHeroVector;
  var hero;

  function setLastHeroVector(direction) {
    lastHeroVector = direction;
  }

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

  function getVector(oldPos, newPos) {
    return {
      x: newPos.col - oldPos.col,
      y: newPos.row - oldPos.row
    };
  }

  function getDirection(vector) {
    if (vector.x === 0 && vector.y === 0) {
      return constants.REST;
    }
    if (Math.abs(vector.y) > Math.abs(vector.x)) {
      if (vector.y < 0) {
        return constants.UP;
      }
      else {
        return constants.DOWN;
      }
    }
    else {
      if (vector.x < 0) {
        return constants.LEFT;
      }
      else {
        return constants.RIGHT;
      }
    }
  }

  function getNextPos(oldPos, vector) {
    var row = oldPos.row;
    var col = oldPos.col;
    var direction = getDirection(vector);

    switch (direction) {
      case constants.UP:
        row = oldPos.row - 1;
        break;
      case constants.DOWN:
        row = oldPos.row + 1;
        break;
      case constants.LEFT:
        col = oldPos.col - 1;
        break;
      case constants.RIGHT:
        col = oldPos.col + 1;
        break;
      case constants.REST:
      default:
        break;
    }

    return {
      row: row,
      col: col
    };
  }

  function getPosNode(pos) {
    return document.querySelectorAll('.map-row-' + pos.row + ' .map-col-' + pos.col)[0];
  }

  function moveCharInDom(charNode, nextPos) {
    charNode.parentNode.removeChild(charNode);
    getPosNode(nextPos).appendChild(charNode);
  }

  function moveHeroTowards(toNode) {
    var heroNode = document.querySelectorAll('.hero')[0];
    var nodePos = getCoords(toNode);
    var heroPos = hero.getCoords();
    var heroVector = getVector(heroPos, nodePos);
    var nextPos = getNextPos(heroPos, heroVector);

    hero.setCoords(nextPos);
    setLastHeroVector(heroVector);
    moveCharInDom(heroNode, nextPos);
  }

  function moveEnemies() {
    var heroCoords = hero.getCoords();

    enemies.forEach(function (enemy) {
      var vector = getVector(enemy.pos, heroCoords);
      var potentialNextPos = getNextPos(enemy.pos, vector);

      // if enemy and hero are at the same position
      if (vector.x === 0 && vector.y === 0) {
        return;
      }
      // if hero is adjacent to enemy
      else if (Math.abs(vector.x) === 1 || Math.abs(vector.y) === 1) {
        // if enemy can attack hero
        if (potentialNextPos.row === heroCoords.row && potentialNextPos.col === heroCoords.col) {
          enemy.pos = potentialNextPos;
        }
        // if enemy can't attack (i.e. can't move diagonally), mirror the hero's vector
        else {
          enemy.pos = getNextPos(enemy.pos, lastHeroVector);
        }
      }
      // if hero is within aggro range, move towards hero
      else if (Math.abs(vector.x) <= enemy.aggroRange && Math.abs(vector.y) <= enemy.aggroRange) {
        enemy.pos = potentialNextPos;
      }
      moveCharInDom(enemy.node, enemy.pos);
    });
  }

  function initHero(options) {
    var heroPosNode = getPosNode(options.pos);
    var heroNode = document.createElement('div');

    heroNode.setAttribute('class', 'hero character');
    heroPosNode.appendChild(heroNode);

    return createHero(options);
  }

  function createEnemy(options) {
    var enemyPosNode = getPosNode(options.pos);
    var enemyNode = document.createElement('div');

    enemyNode.setAttribute('class', 'enemy character');
    enemyPosNode.appendChild(enemyNode);

    return {
      pos: {
        col: options.pos.col,
        row: options.pos.row
      },
      aggroRange: options.aggroRange,
      node: enemyNode
    };
  }

  function init() {
    var enemyOptions = {
      pos: { col: 9, row: 4 },
      aggroRange: 2
    };
    enemies.push(createEnemy(enemyOptions));
    hero = initHero({ pos: { row: 1, col: 1 } });
  }

  return {
    moveHeroTowards: moveHeroTowards,
    moveEnemies: moveEnemies,
    init: init
  };
}(window.dungeon.constants, window.dungeon.createHero));
