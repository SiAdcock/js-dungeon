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
  var pos = {
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

  function getVector(coords) {
    return {
      x: coords.col - pos.col,
      y: coords.row - pos.row
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

  function getNextPos(vector) {
    var row = pos.row;
    var col = pos.col;
    var direction = getDirection(vector);

    switch (direction) {
      case constants.UP:
        row = pos.row - 1;
        break;
      case constants.DOWN:
        row = pos.row + 1;
        break;
      case constants.LEFT:
        col = pos.col - 1;
        break;
      case constants.RIGHT:
        col = pos.col + 1;
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

  function moveCharTowards(node) {
    var hero = document.querySelectorAll('.hero')[0];
    var nextPos = getNextPos(getVector(getCoords(node)));
    var nextPosNode = document.querySelectorAll('.map-row-' + nextPos.row + ' .map-col-' + nextPos.col)[0];

    pos = nextPos;
    hero.parentNode.removeChild(hero);
    nextPosNode.appendChild(hero);
  }

  function incrementTurns() {
    turns += 1;
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('map-col')) {
        moveCharTowards(e.target);
      }
      else if (e.target.classList.contains('character')) {
        moveCharTowards(e.target.parentNode);
      }
    });
  }

  bindEvents();
}());
