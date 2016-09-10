window.dungeon = window.dungeon || {};

window.dungeon.map = (function (constants, q, pos, ev) {
  'use strict';

  var eventsBound = false;
  var hero;
  var enemies;
  var startPos;
  var endPos;
  var mapSize;

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
    return q('.map-row-' + position.row + ' .map-col-' + position.col)[0];
  }

  function moveCharInDom(charNode, nextPos) {
    charNode.parentNode.removeChild(charNode);
    //TODO: ensure nextPos node exists
    getPosNode(nextPos).appendChild(charNode);
  }

  function moveHeroTowards(newPos) {
    var heroNode = document.querySelectorAll('.hero')[0];

    moveCharInDom(heroNode, newPos);
  }

  function moveEnemy(oldPos, newPos) {
      var enemyNode = getPosNode(oldPos).childNodes[0]; //TODO: can't always rely on this

      moveCharInDom(enemyNode, newPos);
  }

  function renderMap() {
    var mapNode = q('.map')[0];
    var mapList = document.createElement('ul');
    var mapWidth = mapSize.width;
    var mapHeight = mapSize.height;
    var rowNum;
    var colNum;
    var row;
    var col;
    var rowList;
    var startNode;
    var endNode;

    for (rowNum = 1; rowNum <= mapHeight; rowNum += 1) {
      row = document.createElement('li');
      row.classList.add('map-row-' + rowNum);
      rowList = document.createElement('ul');
      for (colNum = 1; colNum <= mapWidth; colNum += 1) {
        col = document.createElement('li');
        col.classList.add('terrain', 'terrain-grass', 'map-col', 'map-col-' + colNum);
        rowList.appendChild(col);
      }
      row.appendChild(rowList);
      mapList.appendChild(row);
    }
    startNode = mapList.querySelectorAll('.map-row-' + startPos.row + ' .map-col-' + startPos.col)[0];
    endNode = mapList.querySelectorAll('.map-row-' + endPos.row + ' .map-col-' + endPos.col)[0];
    startNode.classList.add('terrain-start');
    startNode.classList.remove('terrain-grass');
    endNode.classList.add('terrain-end');
    endNode.classList.remove('terrain-grass');
    mapNode.appendChild(mapList);
  }

  function renderCharacter(position, className) {
    var posNode = getPosNode(position);
    var charNode = document.createElement('div');

    charNode.setAttribute('class', className + ' character');
    posNode.appendChild(charNode);
  }

  function renderHero(heroToRender) {
    renderCharacter(heroToRender.getCoords(), 'hero');
  }

  function renderEnemy(enemyToRender) {
    renderCharacter(enemyToRender.getCoords(), 'enemy');
  }

  function highlightMovePath(moveStartPos, moveEndPos) {
    var vector = pos.getVector(moveStartPos, moveEndPos);
    var nextPos = pos.getNextPos(moveStartPos, vector);

    getPosNode(nextPos).classList.add('terrain-move-path');
  }

  function clearMovePath() {
    q('.terrain-move-path').forEach(function (pathNode) {
      pathNode.classList.remove('terrain-move-path');
    });
  }

  function restart() {
    q('.map')[0].innerHTML = '';
    ev.publish('main:restart');
  }

  function bindEvents() {
    q('.terrain').forEach(function (el) {
      el.addEventListener('mouseover', function () {
        clearMovePath();
        highlightMovePath(hero.getCoords(), getCoords(el));
      });
    });
    document.addEventListener('click', function (e) {
      var newPos;

      if (e.target.classList.contains('map-col')) {
        newPos = getCoords(e.target);
        hero.move(newPos);
        clearMovePath();
        highlightMovePath(hero.getCoords(), newPos);
        ev.publish('hero:endTurn');
      }
      else if (e.target.classList.contains('character')) {
        newPos = getCoords(e.target.parentNode);
        hero.move(newPos);
        clearMovePath();
        highlightMovePath(hero.getCoords(), newPos);
        ev.publish('hero:endTurn');
      }
    });
    q('.restart')[0].addEventListener('click', restart);
    ev.subscribe('enemy:move', function (event) {
      moveEnemy(event.detail.oldPos, event.detail.newPos);
    });
    ev.subscribe('hero:move', function (event) {
      moveHeroTowards(event.detail.newPos);
    });
  }

  function init(options) {
    hero = options.hero;
    enemies = options.enemies;
    mapSize = options.mapSize;
    startPos = options.startPos;
    endPos = options.endPos;
    renderMap(mapSize, startPos, endPos);
    enemies.forEach(renderEnemy);
    renderHero(hero);
    if (!eventsBound) {
      bindEvents();
      eventsBound = true;
    }
  }

  function gameOver() {
    q('.map').forEach(function (mapNode) {
      var gameOverNode = document.createElement('h2');

      gameOverNode.innerHTML = 'Game over';
      mapNode.innerHTML = '';
      mapNode.appendChild(gameOverNode);
    });
  }

  return {
    init: init,
    gameOver: gameOver
  };
}(window.dungeon.constants, window.dungeon.q, window.dungeon.pos, window.dungeon.ev));
