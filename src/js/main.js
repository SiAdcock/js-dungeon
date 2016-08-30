(function (constants, map) {
  'use strict';

  var turns = 0;

  function incrementTurns() {
    turns += 1;
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('map-col')) {
        map.moveHeroTowards(e.target);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
      else if (e.target.classList.contains('character')) {
        map.moveHeroTowards(e.target.parentNode);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
    });
    document.addEventListener('hero:endTurn', function () {
      map.moveEnemies();
      incrementTurns();
      document.getElementsByClassName('game-info-turn-count')[0].innerHTML = turns;
    });
  }

  map.init();
  bindEvents();
}(window.dungeon.constants, window.dungeon.map));
