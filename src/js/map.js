window.dungeon = window.dungeon || {};

window.dungeon.map = (function (constants, q, pos) {
  'use strict';

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

  function moveHeroTowards(hero, toNode) {
    var heroNode = document.querySelectorAll('.hero')[0];

    hero.move(getCoords(toNode));
    moveCharInDom(heroNode, hero.getCoords());
  }

  function moveEnemies(enemies, hero) {
    enemies.forEach(function (enemy) {
      var enemyNode = getPosNode(enemy.getCoords()).childNodes[0]; //TODO: can't always rely on this

      enemy.move(hero);
      moveCharInDom(enemyNode, enemy.getCoords());
    });
  }

  function renderMap(options) {
    var mapNode = q('.map')[0];
    var mapList = document.createElement('ul');
    var mapWidth = options.width;
    var mapHeight = options.height;
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
    startNode = mapList.querySelectorAll('.map-row-' + options.startPos.row + ' .map-col-' + options.startPos.col)[0];
    endNode = mapList.querySelectorAll('.map-row-' + options.endPos.row + ' .map-col-' + options.endPos.col)[0];
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

  function highlightMovePath(startPos, endPos) {
    var vector = pos.getVector(startPos, endPos);
    var nextPos = pos.getNextPos(startPos, vector);

    getPosNode(nextPos).classList.add('terrain-move-path');
  }

  function clearMovePath() {
    q('.terrain-move-path').forEach(function (pathNode) {
      pathNode.classList.remove('terrain-move-path');
    });
  }

  function bindEvents(hero) {
    q('.terrain').forEach(function (el) {
      el.addEventListener('mouseover', function () {
        clearMovePath();
        highlightMovePath(hero.getCoords(), getCoords(el));
      });
    });
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('map-col')) {
        moveHeroTowards(hero, e.target);
        clearMovePath();
        highlightMovePath(hero.getCoords(), getCoords(e.target));
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
      else if (e.target.classList.contains('character')) {
        moveHeroTowards(hero, e.target.parentNode);
        clearMovePath();
        highlightMovePath(hero.getCoords(), getCoords(e.target.parentNode));
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
    });
  }

  function init(hero, enemies) {
    renderMap({
      width: 10,
      height: 5,
      startPos: {
        row: 1,
        col: 1
      },
      endPos: {
        row: 5,
        col: 10
      }
    });
    enemies.forEach(renderEnemy);
    renderHero(hero);
    bindEvents(hero);
  }

  function gameOver() {
    q('.map').forEach(function (mapNode) {
      var gameOverNode = document.createElement('h2');

      gameOverNode.innerHTML = 'Game over';
      mapNode.parentNode.replaceChild(gameOverNode, mapNode);
    });
  }

  return {
    moveHeroTowards: moveHeroTowards,
    moveEnemies: moveEnemies,
    init: init,
    gameOver: gameOver
  };
}(window.dungeon.constants, window.dungeon.q, window.dungeon.pos));
