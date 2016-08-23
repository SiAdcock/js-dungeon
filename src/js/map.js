window.dungeon = window.dungeon || {};

window.dungeon.map = (function (constants) {
  'use strict';

  var enemies = [];
  var lastHeroVector;

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
    var heroPos = getCoords(heroNode.parentNode);
    var heroVector = getVector(heroPos, nodePos);
    var nextPos = getNextPos(heroPos, heroVector);

    moveCharInDom(heroNode, nextPos);
  }

  function moveEnemies() {
    var heroNode = document.querySelectorAll('.hero')[0];
    var heroCoords = getCoords(heroNode.parentNode);

    enemies.forEach(function (enemy) {
      var vector = getVector(enemy.pos, heroCoords);

      // if enemy and hero are at the same position
      if (vector.x === 0 && vector.y === 0) {
        return;
      }
      // hero is within aggro range
      else if (Math.abs(vector.x) <= enemy.aggroRange && Math.abs(vector.y) <= enemy.aggroRange) {
        enemy.pos = getNextPos(enemy.pos, vector);
        moveCharInDom(enemy.node, enemy.pos);
      }
    });
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
  }

  return {
    moveHeroTowards: moveHeroTowards,
    moveEnemies: moveEnemies,
    init: init
  };
}(window.dungeon.constants));
