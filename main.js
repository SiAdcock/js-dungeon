(function () {
  'use strict';

  var constants = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    REST: 'rest',
    COL: 'col',
    ROW: 'row'
  };
  var heroPos = {
    row: 1,
    col: 1
  };
  var turns = 0;

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

  function moveCharTowards(charNode, toNode) {
    var nodePos = getCoords(toNode);
    var charPos = getCoords(charNode.parentNode);
    var heroVector = getVector(charPos, nodePos);
    var nextPos = getNextPos(charPos, heroVector);
    var nextPosNode = document.querySelectorAll('.map-row-' + nextPos.row + ' .map-col-' + nextPos.col)[0];

    charNode.parentNode.removeChild(charNode);
    nextPosNode.appendChild(charNode);

    return nextPos;
  }

  function incrementTurns() {
    turns += 1;
  }


  function bindEvents() {
    document.addEventListener('click', function (e) {
      var hero = document.querySelectorAll('.hero')[0];
      var enemy = document.querySelectorAll('.enemy')[0];

      if (e.target.classList.contains('map-col')) {
        heroPos = moveCharTowards(hero, e.target);
        moveCharTowards(enemy, e.target);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
      else if (e.target.classList.contains('character')) {
        heroPos = moveCharTowards(hero, e.target.parentNode);
        moveCharTowards(enemy, e.target.parentNode);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
    });
    document.addEventListener('hero:endTurn', function (e) {
      incrementTurns();
      document.getElementsByClassName('info-turn-count')[0].innerHTML = turns;
    });
  }

  bindEvents();
}());
